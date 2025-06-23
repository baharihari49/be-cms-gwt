import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Existing basic counts
    const totalProjects = await prisma.project.count()
    const totalBlogPosts = await prisma.blogPost.count({ where: { published: true } })
    const totalClients = await prisma.client.count()
    
    // Project status breakdown
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    // ✅ ADD: QuickStats data
    // Project completion stats
    const completedProjects = await prisma.project.count({
      where: { status: 'LIVE' }
    })
    
    const inProgressProjects = await prisma.project.count({
      where: { 
        status: { 
          in: ['DEVELOPMENT', 'BETA'] 
        }
      }
    })

    // Client satisfaction from testimonials
    const testimonialRatings = await prisma.testimonial.findMany({
      where: { rating: { not: null } },
      select: { rating: true }
    })
    
    const averageRating = testimonialRatings.length > 0 
      ? testimonialRatings.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonialRatings.length
      : 0

    const activeClients = await prisma.client.count({
      where: { isActive: true }
    })

    // Technology usage (existing)
    const technologyUsage = await prisma.projectTechnology.groupBy({
      by: ['technologyId'],
      _count: { technologyId: true },
      orderBy: { _count: { technologyId: 'desc' } },
      take: 10
    })

    const technologyIds = technologyUsage.map(t => t.technologyId)
    const technologies = await prisma.technology.findMany({
      where: { id: { in: technologyIds } }
    })

    const technologyData = technologyUsage.map(usage => {
      const tech = technologies.find(t => t.id === usage.technologyId)
      return {
        name: tech?.name || 'Unknown',
        count: usage._count.technologyId
      }
    })

    // Recent Activities (existing)
    const recentProjects = await prisma.project.findMany({
      take: 3,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true
      }
    })

    const recentBlogPosts = await prisma.blogPost.findMany({
      take: 3,
      orderBy: { updatedAt: 'desc' },
      where: { published: true },
      select: {
        id: true,
        title: true,
        updatedAt: true
      }
    })

    const recentTestimonials = await prisma.testimonial.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        author: true,
        content: true,
        createdAt: true
      }
    })

    const activities = [
      ...recentProjects.map(project => ({
        id: `project-${project.id}`,
        type: 'project' as const,
        title: `Project Updated: ${project.title}`,
        description: `Status changed to ${project.status}`,
        timestamp: project.updatedAt,
        status: project.status
      })),
      ...recentBlogPosts.map(post => ({
        id: `blog-${post.id}`,
        type: 'blog' as const,
        title: `New Blog Post: ${post.title}`,
        description: 'Published and live',
        timestamp: post.updatedAt,
        status: 'Published'
      })),
      ...recentTestimonials.map(testimonial => ({
        id: `testimonial-${testimonial.id}`,
        type: 'testimonial' as const,
        title: `New Testimonial from ${testimonial.author}`,
        description: testimonial.content.substring(0, 50) + '...',
        timestamp: testimonial.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

   res.json({
      success: true,
      data: {
        totalProjects,
        totalBlogPosts,
        totalClients,
        projectsByStatus,
        technologyUsage: technologyData,
        projectStats: {
          totalProjects,
          completedProjects,
          inProgressProjects
        },
        clientStats: {
          totalClients,
          activeClients,
          averageRating: Math.round(averageRating * 10) / 10
        },
        recentActivities: activities
      }
    })
  } catch (error) {
    // ✅ Fix: Proper error handling
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    })
  }
}