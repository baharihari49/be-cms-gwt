// controllers/blogController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function untuk generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// ========== POST CONTROLLERS ==========

// Create new post
export const createPost = async (req: Request, res: Response) => {
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
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, published = true, orderBy = 'publishedAt', order = 'desc' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          published: published === 'true'
        },
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
        where: {
          published: published === 'true'
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
    res.status(500).json({ error: 'Failed to fetch posts', details: error });
  }
};

// Get featured posts
export const getFeaturedPosts = async (req: Request, res: Response) => {
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
export const getPostById = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'Post not found' });
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
export const getPostBySlug = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'Post not found' });
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
export const updatePost = async (req: Request, res: Response) => {
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
export const deletePost = async (req: Request, res: Response) => {
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
export const getPostsByCategory = async (req: Request, res: Response) => {
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
export const getPostsByTag = async (req: Request, res: Response) => {
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
export const getPostsByAuthor = async (req: Request, res: Response) => {
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
export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
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
export const updatePostStats = async (req: Request, res: Response) => {
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
        return res.status(400).json({ error: 'Invalid action' });
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
export const getPopularPosts = async (req: Request, res: Response) => {
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
export const getRecentPosts = async (req: Request, res: Response) => {
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

// ========== CATEGORY CONTROLLERS ==========

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, icon, color } = req.body;
    
    const category = await prisma.blogCategory.create({
      data: {
        name,
        slug: generateSlug(name),
        description,
        icon,
        color
      }
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category', details: error });
  }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category', details: error });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, icon, color } = req.body;
    
    const updateData: any = { description, icon, color };
    
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    
    const category = await prisma.blogCategory.update({
      where: { id },
      data: updateData
    });
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category', details: error });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.blogCategory.delete({
      where: { id }
    });
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category', details: error });
  }
};

// ========== TAG CONTROLLERS ==========

// Create tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    const tag = await prisma.blogTag.create({
      data: {
        name,
        slug: generateSlug(name)
      }
    });
    
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tag', details: error });
  }
};

// Get all tags
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags', details: error });
  }
};

// Get tag by ID
export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const tag = await prisma.blogTag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tag', details: error });
  }
};

// Update tag
export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const tag = await prisma.blogTag.update({
      where: { id },
      data: {
        name,
        slug: generateSlug(name)
      }
    });
    
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tag', details: error });
  }
};

// Delete tag
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.blogTag.delete({
      where: { id }
    });
    
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tag', details: error });
  }
};

// ========== AUTHOR CONTROLLERS ==========

// Create author
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { name, email, bio, avatar } = req.body;
    
    const author = await prisma.blogAuthor.create({
      data: {
        name,
        email,
        bio,
        avatar
      }
    });
    
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create author', details: error });
  }
};

// Get all authors
export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await prisma.blogAuthor.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch authors', details: error });
  }
};

// Get author by ID
export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const author = await prisma.blogAuthor.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        },
        posts: {
          take: 5,
          orderBy: {
            publishedAt: 'desc'
          },
          include: {
            category: true,
            stats: true
          }
        }
      }
    });
    
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch author', details: error });
  }
};

// Update author
export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, bio, avatar } = req.body;
    
    const author = await prisma.blogAuthor.update({
      where: { id },
      data: {
        name,
        email,
        bio,
        avatar
      }
    });
    
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update author', details: error });
  }
};

// Delete author
export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.blogAuthor.delete({
      where: { id }
    });
    
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete author', details: error });
  }
};

// ========== COMMENT CONTROLLERS ==========

// Create comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, authorName, authorEmail, parentId } = req.body;
    
    const comment = await prisma.blogComment.create({
      data: {
        content,
        postId,
        authorName,
        authorEmail,
        parentId
      }
    });
    
    // Update comment count
    await prisma.blogPostStats.update({
      where: { postId },
      data: { comments: { increment: 1 } }
    });
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment', details: error });
  }
};

// Get comments by post
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [comments, total] = await Promise.all([
      prisma.blogComment.findMany({
        where: {
          postId,
          parentId: null
        },
        skip,
        take: Number(limit),
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          replies: {
            include: {
              replies: true
            }
          }
        }
      }),
      prisma.blogComment.count({
        where: {
          postId,
          parentId: null
        }
      })
    ]);
    
    res.json({
      comments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments', details: error });
  }
};

// Update comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const comment = await prisma.blogComment.update({
      where: { id },
      data: { content }
    });
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment', details: error });
  }
};

// Delete comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get comment to find postId
    const comment = await prisma.blogComment.findUnique({
      where: { id }
    });
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Delete comment
    await prisma.blogComment.delete({
      where: { id }
    });
    
    // Update comment count
    await prisma.blogPostStats.update({
      where: { postId: comment.postId },
      data: { comments: { decrement: 1 } }
    });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment', details: error });
  }
};