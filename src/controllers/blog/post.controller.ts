// controllers/blog/post.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../../utils/helpers';

const prisma = new PrismaClient();

// Helper function to parse pagination parameters
const parsePaginationParams = (req: Request) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Helper function to parse ordering parameters
const parseOrderParams = (req: Request) => {
  const orderBy = (req.query.orderBy as string) || 'publishedAt';
  const order = (req.query.order as string) === 'asc' ? 'asc' : 'desc';

  // Validate orderBy field to prevent SQL injection
  const allowedOrderFields = [
    'title', 'publishedAt', 'createdAt', 'updatedAt',
    'views', 'likes', 'comments', 'shares'
  ];

  const validOrderBy = allowedOrderFields.includes(orderBy) ? orderBy : 'publishedAt';

  // Handle stats ordering
  if (['views', 'likes', 'comments', 'shares'].includes(validOrderBy)) {
    return {
      stats: {
        [validOrderBy]: order
      }
    };
  }

  return {
    [validOrderBy]: order
  };
};

// Common include for post queries
const getPostInclude = () => ({
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      createdAt: true,
      updatedAt: true
    }
  },
  category: true,
  tags: {
    include: {
      tag: true
    }
  },
  stats: true
});

// Create new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, excerpt, content, image, featured, authorId, categoryId, tags, readTime } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content || !authorId || !categoryId) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['title', 'excerpt', 'content', 'authorId', 'categoryId']
      });
      return;
    }

    const slug = generateSlug(title);

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (existingPost) {
      res.status(400).json({
        error: 'A post with this title already exists',
        details: 'Please choose a different title'
      });
      return;
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image: image || null,
        featured: Boolean(featured),
        readTime,
        authorId,
        categoryId,
        published: false, // Default to draft
        publishedAt: undefined,
        tags: {
          create: tags?.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          })) || []
        },
        stats: {
          create: {
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0
          }
        }
      },
      include: getPostInclude()
    });

    res.status(201).json({
      success: true,
      post,
      message: 'Post created successfully'
    });
  } catch (error: any) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: 'Failed to create post',
      details: error.message || 'Internal server error'
    });
  }
};

// Get all posts with pagination and filters
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, published, orderBy = 'publishedAt', order = 'desc' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (published !== undefined) {
      whereClause.published = published === 'true';
    }

    // Handle orderBy untuk stats
    let orderByClause: any = {};
    if (['views', 'likes', 'comments', 'shares'].includes(orderBy as string)) {
      orderByClause = {
        stats: {
          [orderBy as string]: order
        }
      };
    } else {
      orderByClause = {
        [orderBy as string]: order
      };
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: orderByClause,
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
          stats: true,
          comments: true,
        }
      }),
      prisma.blogPost.count({
        where: whereClause
      })
    ]);

    res.json({
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts', details: error });
  }
};

// Get featured posts
export const getFeaturedPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit as string) || 3);

    const posts = await prisma.blogPost.findMany({
      where: {
        featured: true,
        published: true
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc'
      },
      include: getPostInclude()
    });

    res.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error: any) {
    console.error('Get featured posts error:', error);
    res.status(500).json({
      error: 'Failed to fetch featured posts',
      details: error.message || 'Internal server error'
    });
  }
};

// Get post by ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        ...getPostInclude(),
        comments: {
          where: { parentId: null },
          include: {
            replies: {
              include: {
                author: {
                  select: { id: true, name: true, avatar: true }
                }
              }
            },
            author: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
        message: `No post found with ID: ${id}`
      });
      return;
    }

    // Increment view count asynchronously
    prisma.blogPostStats.update({
      where: { postId: id },
      data: { views: { increment: 1 } }
    }).catch(error => {
      console.error('Failed to increment view count:', error);
    });

    res.json({
      success: true,
      post
    });
  } catch (error: any) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      details: error.message || 'Internal server error'
    });
  }
};

// Get post by slug
export const getPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!slug) {
      res.status(400).json({ error: 'Post slug is required' });
      return;
    }

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        ...getPostInclude(),
        comments: {
          where: { parentId: null },
          include: {
            replies: {
              include: {
                author: {
                  select: { id: true, name: true, avatar: true }
                }
              }
            },
            author: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
        message: `No post found with slug: ${slug}`
      });
      return;
    }

    // Increment view count asynchronously
    prisma.blogPostStats.update({
      where: { postId: post.id },
      data: { views: { increment: 1 } }
    }).catch(error => {
      console.error('Failed to increment view count:', error);
    });

    res.json({
      success: true,
      post
    });
  } catch (error: any) {
    console.error('Get post by slug error:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      details: error.message || 'Internal server error'
    });
  }
};

// Update post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      image,
      featured,
      categoryId,
      tags,
      readTime,
      published
    } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      res.status(404).json({
        error: 'Post not found',
        message: `No post found with ID: ${id}`
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};

    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (readTime !== undefined) updateData.readTime = readTime;

    // Handle published status change
    if (published !== undefined) {
      updateData.published = Boolean(published);
      if (Boolean(published) && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      } else if (!Boolean(published)) {
        updateData.publishedAt = null;
      }
    }

    // Update slug if title changed
    if (title && title !== existingPost.title) {
      const newSlug = generateSlug(title);

      // Check if new slug already exists
      const slugExists = await prisma.blogPost.findFirst({
        where: {
          slug: newSlug,
          id: { not: id }
        }
      });

      if (slugExists) {
        res.status(400).json({
          error: 'Title conflict',
          message: 'A post with this title already exists'
        });
        return;
      }

      updateData.title = title;
      updateData.slug = newSlug;
    }

    // Handle tags update
    if (tags !== undefined) {
      // Remove existing tags
      await prisma.blogPostTag.deleteMany({
        where: { postId: id }
      });

      // Add new tags if provided
      if (tags.length > 0) {
        updateData.tags = {
          create: tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          }))
        };
      }
    }

    updateData.updatedAt = new Date();

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: getPostInclude()
    });

    res.json({
      success: true,
      post,
      message: 'Post updated successfully'
    });
  } catch (error: any) {
    console.error('Update post error:', error);
    res.status(500).json({
      error: 'Failed to update post',
      details: error.message || 'Internal server error'
    });
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      res.status(404).json({
        error: 'Post not found',
        message: `No post found with ID: ${id}`
      });
      return;
    }

    // Delete post (cascade delete will handle related records)
    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Post deleted successfully',
      deletedPost: {
        id: existingPost.id,
        title: existingPost.title
      }
    });
  } catch (error: any) {
    console.error('Delete post error:', error);
    res.status(500).json({
      error: 'Failed to delete post',
      details: error.message || 'Internal server error'
    });
  }
};

// Get posts by category
export const getPostsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { page, limit, skip } = parsePaginationParams(req);

    if (!categoryId) {
      res.status(400).json({ error: 'Category ID is required' });
      return;
    }

    // Check if category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      res.status(404).json({
        error: 'Category not found',
        message: `No category found with ID: ${categoryId}`
      });
      return;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          categoryId,
          published: true
        },
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc'
        },
        include: getPostInclude()
      }),
      prisma.blogPost.count({
        where: {
          categoryId,
          published: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      posts,
      category,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    console.error('Get posts by category error:', error);
    res.status(500).json({
      error: 'Failed to fetch posts by category',
      details: error.message || 'Internal server error'
    });
  }
};

// Get posts by tag
export const getPostsByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;
    const { page, limit, skip } = parsePaginationParams(req);

    if (!tagId) {
      res.status(400).json({ error: 'Tag ID is required' });
      return;
    }

    // Check if tag exists
    const tag = await prisma.blogTag.findUnique({
      where: { id: tagId }
    });

    if (!tag) {
      res.status(404).json({
        error: 'Tag not found',
        message: `No tag found with ID: ${tagId}`
      });
      return;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          tags: {
            some: {
              tagId
            }
          },
          published: true
        },
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc'
        },
        include: getPostInclude()
      }),
      prisma.blogPost.count({
        where: {
          tags: {
            some: {
              tagId
            }
          },
          published: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      posts,
      tag,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    console.error('Get posts by tag error:', error);
    res.status(500).json({
      error: 'Failed to fetch posts by tag',
      details: error.message || 'Internal server error'
    });
  }
};

// Get posts by author
export const getPostsByAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { authorId } = req.params;
    const { page, limit, skip } = parsePaginationParams(req);

    if (!authorId) {
      res.status(400).json({ error: 'Author ID is required' });
      return;
    }

    // Check if author exists
    const author = await prisma.blogAuthor.findUnique({
      where: { id: authorId },
      select: { id: true, name: true, email: true, bio: true, avatar: true }
    });

    if (!author) {
      res.status(404).json({
        error: 'Author not found',
        message: `No author found with ID: ${authorId}`
      });
      return;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          authorId,
          published: true
        },
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc'
        },
        include: getPostInclude()
      }),
      prisma.blogPost.count({
        where: {
          authorId,
          published: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      posts,
      author,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    console.error('Get posts by author error:', error);
    res.status(500).json({
      error: 'Failed to fetch posts by author',
      details: error.message || 'Internal server error'
    });
  }
};

// Search posts
export const searchPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const { page, limit, skip } = parsePaginationParams(req);

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      res.status(400).json({
        error: 'Search query is required',
        message: 'Please provide a non-empty search query'
      });
      return;
    }

    const searchQuery = q.trim();

    // Build search conditions
    const searchConditions = {
      AND: [
        { published: true },
        {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' as const } },
            { excerpt: { contains: searchQuery, mode: 'insensitive' as const } },
            { content: { contains: searchQuery, mode: 'insensitive' as const } },
            {
              author: {
                name: { contains: searchQuery, mode: 'insensitive' as const }
              }
            },
            {
              category: {
                name: { contains: searchQuery, mode: 'insensitive' as const }
              }
            },
            {
              tags: {
                some: {
                  tag: {
                    name: { contains: searchQuery, mode: 'insensitive' as const }
                  }
                }
              }
            }
          ]
        }
      ]
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: searchConditions,
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc'
        },
        include: getPostInclude()
      }),
      prisma.blogPost.count({
        where: searchConditions
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      posts,
      searchQuery,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    console.error('Search posts error:', error);
    res.status(500).json({
      error: 'Failed to search posts',
      details: error.message || 'Internal server error'
    });
  }
};

// Update post stats
export const updatePostStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    if (!action) {
      res.status(400).json({ error: 'Action is required' });
      return;
    }

    const updateData: any = {};

    switch (action) {
      case 'like':
        updateData.likes = { increment: 1 };
        break;
      case 'unlike':
        updateData.likes = { decrement: 1 };
        break;
      case 'share':
        updateData.shares = { increment: 1 };
        break;
      default:
        res.status(400).json({
          error: 'Invalid action',
          message: 'Action must be one of: like, unlike, share'
        });
        return;
    }

    const stats = await prisma.blogPostStats.update({
      where: { postId: id },
      data: updateData
    });

    res.json({
      success: true,
      stats,
      action,
      message: `Post ${action}d successfully`
    });
  } catch (error: any) {
    console.error('Update post stats error:', error);

    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Post not found',
        message: 'Cannot update stats for non-existent post'
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to update post stats',
      details: error.message || 'Internal server error'
    });
  }
};

// Get popular posts
export const getPopularPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit as string) || 5);
    const period = (req.query.period as string) || '7d';

    // Calculate date based on period
    const date = new Date();
    switch (period) {
      case '24h':
        date.setHours(date.getHours() - 24);
        break;
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      case 'all':
        date.setFullYear(2000);
        break;
      default:
        date.setDate(date.getDate() - 7);
    }

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: {
          gte: date
        }
      },
      take: limit,
      orderBy: {
        stats: {
          views: 'desc'
        }
      },
      include: getPostInclude()
    });

    res.json({
      success: true,
      posts,
      period,
      count: posts.length
    });
  } catch (error: any) {
    console.error('Get popular posts error:', error);
    res.status(500).json({
      error: 'Failed to fetch popular posts',
      details: error.message || 'Internal server error'
    });
  }
};

// Get recent posts
export const getRecentPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit as string) || 5);

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc'
      },
      include: getPostInclude()
    });

    res.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error: any) {
    console.error('Get recent posts error:', error);
    res.status(500).json({
      error: 'Failed to fetch recent posts',
      details: error.message || 'Internal server error'
    });
  }
};

// Bulk operations
export const bulkUpdatePosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postIds, action, data } = req.body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      res.status(400).json({
        error: 'Post IDs array is required',
        message: 'Please provide an array of post IDs'
      });
      return;
    }

    if (!action) {
      res.status(400).json({ error: 'Action is required' });
      return;
    }

    let updateData: any = {};

    switch (action) {
      case 'publish':
        updateData = {
          published: true,
          publishedAt: new Date()
        };
        break;
      case 'unpublish':
        updateData = {
          published: false,
          publishedAt: null
        };
        break;
      case 'feature':
        updateData = { featured: true };
        break;
      case 'unfeature':
        updateData = { featured: false };
        break;
      case 'update':
        if (!data) {
          res.status(400).json({ error: 'Update data is required for update action' });
          return;
        }
        updateData = data;
        break;
      default:
        res.status(400).json({
          error: 'Invalid action',
          message: 'Action must be one of: publish, unpublish, feature, unfeature, update'
        });
        return;
    }

    const result = await prisma.blogPost.updateMany({
      where: {
        id: { in: postIds }
      },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      updatedCount: result.count,
      action
    });
  } catch (error: any) {
    console.error('Bulk update posts error:', error);
    res.status(500).json({
      error: 'Failed to perform bulk operation',
      details: error.message || 'Internal server error'
    });
  }
};

// Get post analytics - FIXED VERSION
export const getPostAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { period = '30d' } = req.query;

    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        stats: true,
        author: {
          select: { id: true, name: true }
        },
        category: {
          select: { id: true, name: true }
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true }
            }
          }
        },
        comments: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      }
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
        message: `No post found with ID: ${id}`
      });
      return;
    }

    // SOLUSI 1: Menggunakan aggregate pada tabel BlogPostStats langsung
    const categoryStats = await prisma.blogPostStats.aggregate({
      where: {
        post: {
          categoryId: post.categoryId,
          published: true,
          id: { not: id }
        }
      },
      _avg: {
        views: true,
        likes: true,
        comments: true,
        shares: true
      }
    });

    const analytics = {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: post.publishedAt,
        author: post.author,
        category: post.category,
        tags: post.tags.map(t => t.tag)
      },
      stats: post.stats,
      period: {
        start: startDate,
        end: endDate,
        days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      },
      comparison: {
        categoryAverage: categoryStats._avg,
        performance: {
          views: post.stats ? (post.stats.views / (categoryStats._avg.views || 1)) * 100 : 0,
          likes: post.stats ? (post.stats.likes / (categoryStats._avg.likes || 1)) * 100 : 0,
          comments: post.stats ? (post.stats.comments / (categoryStats._avg.comments || 1)) * 100 : 0,
          shares: post.stats ? (post.stats.shares / (categoryStats._avg.shares || 1)) * 100 : 0,
        }
      },
      engagement: {
        total: post.stats ? post.stats.likes + post.stats.comments + post.stats.shares : 0,
        rate: post.stats ? ((post.stats.likes + post.stats.comments + post.stats.shares) / Math.max(post.stats.views, 1)) * 100 : 0
      }
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error: any) {
    console.error('Get post analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch post analytics',
      details: error.message || 'Internal server error'
    });
  }
};

// ALTERNATIF SOLUSI 2: Menggunakan raw query atau findMany + manual calculation
export const getPostAnalyticsAlternative = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { period = '30d' } = req.query;

    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    // Get post data
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        stats: true,
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } }
      }
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
        message: `No post found with ID: ${id}`
      });
      return;
    }

    // Get category posts with stats for manual calculation
    const categoryPostsWithStats = await prisma.blogPost.findMany({
      where: {
        categoryId: post.categoryId,
        published: true,
        id: { not: id }
      },
      include: {
        stats: true
      }
    });

    // Manual calculation of averages
    const categoryStats = categoryPostsWithStats.reduce((acc, categoryPost) => {
      if (categoryPost.stats) {
        acc.totalViews += categoryPost.stats.views;
        acc.totalLikes += categoryPost.stats.likes;
        acc.totalComments += categoryPost.stats.comments;
        acc.totalShares += categoryPost.stats.shares;
        acc.count++;
      }
      return acc;
    }, {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      count: 0
    });

    const categoryAverage = {
      views: categoryStats.count > 0 ? categoryStats.totalViews / categoryStats.count : 0,
      likes: categoryStats.count > 0 ? categoryStats.totalLikes / categoryStats.count : 0,
      comments: categoryStats.count > 0 ? categoryStats.totalComments / categoryStats.count : 0,
      shares: categoryStats.count > 0 ? categoryStats.totalShares / categoryStats.count : 0,
    };

    const analytics = {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: post.publishedAt,
        author: post.author,
        category: post.category,
        tags: post.tags.map(t => t.tag)
      },
      stats: post.stats,
      comparison: {
        categoryAverage,
        performance: {
          views: post.stats ? (post.stats.views / (categoryAverage.views || 1)) * 100 : 0,
          likes: post.stats ? (post.stats.likes / (categoryAverage.likes || 1)) * 100 : 0,
          comments: post.stats ? (post.stats.comments / (categoryAverage.comments || 1)) * 100 : 0,
          shares: post.stats ? (post.stats.shares / (categoryAverage.shares || 1)) * 100 : 0,
        }
      },
      engagement: {
        total: post.stats ? post.stats.likes + post.stats.comments + post.stats.shares : 0,
        rate: post.stats ? ((post.stats.likes + post.stats.comments + post.stats.shares) / Math.max(post.stats.views, 1)) * 100 : 0
      }
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error: any) {
    console.error('Get post analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch post analytics',
      details: error.message || 'Internal server error'
    });
  }
};

// SOLUSI 3: Menggunakan Raw Query (jika diperlukan)
export const getPostAnalyticsRaw = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get post data
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        stats: true,
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } }
      }
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
        message: `No post found with ID: ${id}`
      });
      return;
    }

    // Raw query untuk mendapatkan average stats per category
    const categoryStatsRaw = await prisma.$queryRaw`
      SELECT 
        AVG(s.views) as avg_views,
        AVG(s.likes) as avg_likes,
        AVG(s.comments) as avg_comments,
        AVG(s.shares) as avg_shares
      FROM "BlogPostStats" s
      INNER JOIN "BlogPost" p ON s."postId" = p.id
      WHERE p."categoryId" = ${post.categoryId}
      AND p.published = true
      AND p.id != ${id}
    ` as any[];

    const categoryAverage = categoryStatsRaw[0] ? {
      views: Number(categoryStatsRaw[0].avg_views) || 0,
      likes: Number(categoryStatsRaw[0].avg_likes) || 0,
      comments: Number(categoryStatsRaw[0].avg_comments) || 0,
      shares: Number(categoryStatsRaw[0].avg_shares) || 0,
    } : {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };

    const analytics = {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: post.publishedAt,
        author: post.author,
        category: post.category,
        tags: post.tags.map(t => t.tag)
      },
      stats: post.stats,
      comparison: {
        categoryAverage,
        performance: {
          views: post.stats ? (post.stats.views / (categoryAverage.views || 1)) * 100 : 0,
          likes: post.stats ? (post.stats.likes / (categoryAverage.likes || 1)) * 100 : 0,
          comments: post.stats ? (post.stats.comments / (categoryAverage.comments || 1)) * 100 : 0,
          shares: post.stats ? (post.stats.shares / (categoryAverage.shares || 1)) * 100 : 0,
        }
      },
      engagement: {
        total: post.stats ? post.stats.likes + post.stats.comments + post.stats.shares : 0,
        rate: post.stats ? ((post.stats.likes + post.stats.comments + post.stats.shares) / Math.max(post.stats.views, 1)) * 100 : 0
      }
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error: any) {
    console.error('Get post analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch post analytics',
      details: error.message || 'Internal server error'
    });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      recentPosts,
      topCategories,
      topTags
    ] = await Promise.all([
      // Total posts
      prisma.blogPost.count(),

      // Published posts
      prisma.blogPost.count({
        where: { published: true }
      }),

      // Draft posts
      prisma.blogPost.count({
        where: { published: false }
      }),

      // Featured posts
      prisma.blogPost.count({
        where: { featured: true }
      }),

      // Total views
      prisma.blogPostStats.aggregate({
        _sum: { views: true }
      }),

      // Total likes
      prisma.blogPostStats.aggregate({
        _sum: { likes: true }
      }),

      // Total comments
      prisma.blogPostStats.aggregate({
        _sum: { comments: true }
      }),

      // Total shares
      prisma.blogPostStats.aggregate({
        _sum: { shares: true }
      }),

      // Recent posts in period
      prisma.blogPost.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Top categories
      prisma.blogCategory.findMany({
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 5
      }),

      // Top tags
      prisma.blogTag.findMany({
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ]);

    const stats = {
      overview: {
        totalPosts,
        publishedPosts,
        draftPosts,
        featuredPosts,
        publishedRate: totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0
      },
      engagement: {
        totalViews: totalViews._sum.views || 0,
        totalLikes: totalLikes._sum.likes || 0,
        totalComments: totalComments._sum.comments || 0,
        totalShares: totalShares._sum.shares || 0,
        avgViewsPerPost: publishedPosts > 0 ? (totalViews._sum.views || 0) / publishedPosts : 0,
        engagementRate: (totalViews._sum.views || 0) > 0 ?
          (((totalLikes._sum.likes || 0) + (totalComments._sum.comments || 0) + (totalShares._sum.shares || 0)) / (totalViews._sum.views || 1)) * 100 : 0
      },
      period: {
        start: startDate,
        end: endDate,
        recentPosts
      },
      topCategories: topCategories.map(cat => ({
        ...cat,
        postCount: cat._count.posts
      })),
      topTags: topTags.map(tag => ({
        ...tag,
        postCount: tag._count.posts
      }))
    };

    res.json({
      success: true,
      stats,
      period
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard stats',
      details: error.message || 'Internal server error'
    });
  }
};