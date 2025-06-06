// controllers/blog/tag.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../../utils/helpers';

const prisma = new PrismaClient();

// Create tag
export const createTag = async (req: Request, res: Response): Promise<void> => {
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
export const getAllTags = async (req: Request, res: Response): Promise<void> => {
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
export const getTagById = async (req: Request, res: Response): Promise<void> => {
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
      res.status(404).json({ error: 'Tag not found' });
      return;
    }
    
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tag', details: error });
  }
};

// Update tag
export const updateTag = async (req: Request, res: Response): Promise<void> => {
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
export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if tag is used by any posts
    const postsCount = await prisma.blogPostTag.count({
      where: { tagId: id }
    });
    
    if (postsCount > 0) {
      res.status(400).json({ 
        error: 'Cannot delete tag that is in use',
        postsCount 
      });
      return;
    }
    
    await prisma.blogTag.delete({
      where: { id }
    });
    
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tag', details: error });
  }
};