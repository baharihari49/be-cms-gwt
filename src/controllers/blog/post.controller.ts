// controllers/blog/post.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../../utils/helpers';

const prisma = new PrismaClient();

// Create new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, excerpt, content, image, featured, authorId, categoryId, tags, readTime } = req.body;
    
    const slug = generateSlug(title);
    
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        featured: featured || false,
        readTime,
        authorId,
        categoryId,
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
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
        stats: true
      }
    });
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post', details: error });
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

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: {
          [orderBy as string]: order
        },
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
          stats: true
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
    const { limit = 3 } = req.query;
    
    const posts = await prisma.blogPost.findMany({
      where: {
        featured: true,
        published: true
      },
      take: Number(limit),
      orderBy: {
        publishedAt: 'desc'
      },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
        stats: true
      }
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured posts', details: error });
  }
};

// Get post by ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
        stats: true,
        comments: {
          where: { parentId: null },
          include: {
            replies: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
    // Increment view count
    await prisma.blogPostStats.update({
      where: { postId: id },
      data: { views: { increment: 1 } }
    });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post', details: error });
  }
};

// Get post by slug
export const getPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
        stats: true,
        comments: {
          where: { parentId: null },
          include: {
            replies: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
    // Increment view count
    await prisma.blogPostStats.update({
      where: { postId: post.id },
      data: { views: { increment: 1 } }
    });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post', details: error });
  }
};

// Update post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, image, featured, categoryId, tags, readTime, published } = req.body;
    
    // Update slug if title changed
    const updateData: any = {
      excerpt,
      content,
      image,
      featured,
      categoryId,
      readTime,
      published
    };
    
    if (title) {
      updateData.title = title;
      updateData.slug = generateSlug(title);
    }
    
    // Handle tags update
    if (tags) {
      // Remove existing tags
      await prisma.blogPostTag.deleteMany({
        where: { postId: id }
      });
      
      // Add new tags
      updateData.tags = {
        create: tags.map((tagId: string) => ({
          tag: { connect: { id: tagId } }
        }))
      };
    }
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
        stats: true
      }
    });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post', details: error });
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.blogPost.delete({
      where: { id }
    });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post', details: error });
  }
};

// Get posts by category
export const getPostsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          categoryId,
          published: true
        },
        skip,
        take: Number(limit),
        orderBy: {
          publishedAt: 'desc'
        },
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
          stats: true
        }
      }),
      prisma.blogPost.count({
        where: {
          categoryId,
          published: true
        }
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
    res.status(500).json({ error: 'Failed to fetch posts by category', details: error });
  }
};

// Get posts by tag
export const getPostsByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
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
        take: Number(limit),
        orderBy: {
          publishedAt: 'desc'
        },
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
          stats: true
        }
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
    res.status(500).json({ error: 'Failed to fetch posts by tag', details: error });
  }
};

// Get posts by author
export const getPostsByAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { authorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          authorId,
          published: true
        },
        skip,
        take: Number(limit),
        orderBy: {
          publishedAt: 'desc'
        },
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
          stats: true
        }
      }),
      prisma.blogPost.count({
        where: {
          authorId,
          published: true
        }
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
    res.status(500).json({ error: 'Failed to fetch posts by author', details: error });
  }
};

// Search posts
export const searchPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          AND: [
            { published: true },
            {
              OR: [
                { title: { contains: q as string } },
                { excerpt: { contains: q as string } },
                { content: { contains: q as string } }
              ]
            }
          ]
        },
        skip,
        take: Number(limit),
        orderBy: {
          publishedAt: 'desc'
        },
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } },
          stats: true
        }
      }),
      prisma.blogPost.count({
        where: {
          AND: [
            { published: true },
            {
              OR: [
                { title: { contains: q as string } },
                { excerpt: { contains: q as string } },
                { content: { contains: q as string } }
              ]
            }
          ]
        }
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
    res.status(500).json({ error: 'Failed to search posts', details: error });
  }
};

// Update post stats
export const updatePostStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like', 'unlike', 'share'
    
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
        res.status(400).json({ error: 'Invalid action' });
        return;
    }
    
    const stats = await prisma.blogPostStats.update({
      where: { postId: id },
      data: updateData
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post stats', details: error });
  }
};

// Get popular posts
export const getPopularPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 5, period = '7d' } = req.query;
    
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
    }
    
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        publishedAt: {
          gte: date
        }
      },
      take: Number(limit),
      orderBy: {
        stats: {
          views: 'desc'
        }
      },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
        stats: true
      }
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular posts', details: error });
  }
};

// Get recent posts
export const getRecentPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 5 } = req.query;
    
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true
      },
      take: Number(limit),
      orderBy: {
        publishedAt: 'desc'
      },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
        stats: true
      }
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent posts', details: error });
  }
};