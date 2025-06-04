// controllers/blog/author.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create author
export const createAuthor = async (req: Request, res: Response): Promise<void> => {
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
export const getAllAuthors = async (req: Request, res: Response): Promise<void> => {
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
export const getAuthorById = async (req: Request, res: Response): Promise<void> => {
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
          where: {
            published: true
          },
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
      res.status(404).json({ error: 'Author not found' });
      return;
    }
    
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch author', details: error });
  }
};

// Update author
export const updateAuthor = async (req: Request, res: Response): Promise<void> => {
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
export const deleteAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if author has posts
    const postsCount = await prisma.blogPost.count({
      where: { authorId: id }
    });
    
    if (postsCount > 0) {
      res.status(400).json({ 
        error: 'Cannot delete author with existing posts',
        postsCount 
      });
      return;
    }
    
    await prisma.blogAuthor.delete({
      where: { id }
    });
    
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete author', details: error });
  }
};