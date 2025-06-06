// controllers/blog/category.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../../utils/helpers';

const prisma = new PrismaClient();

// Create category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
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
    
    res.status(201).json({success: true, category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category', details: error });
  }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
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
    
    res.json({success: true, categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
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
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category', details: error });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
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
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if category has posts
    const postsCount = await prisma.blogPost.count({
      where: { categoryId: id }
    });
    
    if (postsCount > 0) {
      res.status(400).json({ 
        error: 'Cannot delete category with existing posts',
        postsCount 
      });
      return;
    }
    
    await prisma.blogCategory.delete({
      where: { id }
    });
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category', details: error });
  }
};