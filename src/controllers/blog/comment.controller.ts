// controllers/blog/comment.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create comment
export const createComment = async (req: Request, res: Response): Promise<void> => {
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
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
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
export const updateComment = async (req: Request, res: Response): Promise<void> => {
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
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Get comment to find postId
    const comment = await prisma.blogComment.findUnique({
      where: { id },
      include: {
        _count: {
          select: { replies: true }
        }
      }
    });
    
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    
    // Calculate total comments to decrement (including replies)
    const totalToDecrement = 1 + (comment._count?.replies || 0);
    
    // Delete comment (replies will be cascade deleted)
    await prisma.blogComment.delete({
      where: { id }
    });
    
    // Update comment count
    await prisma.blogPostStats.update({
      where: { postId: comment.postId },
      data: { comments: { decrement: totalToDecrement } }
    });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment', details: error });
  }
};