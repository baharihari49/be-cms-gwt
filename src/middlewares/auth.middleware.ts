// middleware/authMiddleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../types/auth';
import prisma from '../prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify JWT token
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for token in header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : null;

    if (!token) {
      res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid Bearer token' 
      });
      return;
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      
      // Optional: Verify user still exists in database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true }
      });

      if (!user) {
        res.status(401).json({ 
          error: 'Invalid token',
          message: 'User no longer exists' 
        });
        return;
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ 
          error: 'Token expired',
          message: 'Please login again to get a new token' 
        });
        return;
      }
      
      if (jwtError instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ 
          error: 'Invalid token',
          message: 'Token is malformed or invalid' 
        });
        return;
      }
      
      throw jwtError;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication error',
      message: 'An error occurred during authentication' 
    });
  }
};

// Check user role
export const checkRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Authentication required' 
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ 
          error: 'Forbidden',
          message: `This action requires one of the following roles: ${roles.join(', ')}`,
          userRole: req.user.role 
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ 
        error: 'Authorization error',
        message: 'An error occurred during authorization' 
      });
    }
  };
};

// Check if user is admin
export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required' 
      });
      return;
    }

    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ 
        error: 'Forbidden',
        message: 'Admin access required',
        userRole: req.user.role 
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ 
      error: 'Authorization error',
      message: 'An error occurred during authorization' 
    });
  }
};

// Optional: Check if user owns the resource
export const isOwner = (resourceIdParam: string = 'id') => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Authentication required' 
        });
        return;
      }

      const resourceId = parseInt(req.params[resourceIdParam]);
      
      if (isNaN(resourceId)) {
        res.status(400).json({ 
          error: 'Bad request',
          message: 'Invalid resource ID' 
        });
        return;
      }

      // Admin can access everything
      if (req.user.role === 'ADMIN') {
        next();
        return;
      }

      // Check ownership based on the route
      // This is a generic example, adjust based on your needs
      if (req.user.id !== resourceId) {
        res.status(403).json({ 
          error: 'Forbidden',
          message: 'You can only access your own resources' 
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ 
        error: 'Authorization error',
        message: 'An error occurred during authorization' 
      });
    }
  };
};

// Optional: Rate limiting per user
export const userRateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  const requests = new Map<number, { count: number; resetTime: number }>();

  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      next();
      return;
    }

    const now = Date.now();
    const userLimits = requests.get(req.user.id);

    if (!userLimits || now > userLimits.resetTime) {
      requests.set(req.user.id, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
      return;
    }

    if (userLimits.count >= maxRequests) {
      const retryAfter = Math.ceil((userLimits.resetTime - now) / 1000);
      res.status(429).json({ 
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds`,
        retryAfter 
      });
      return;
    }

    userLimits.count++;
    next();
  };
};

// Combine multiple middleware
export const authorize = (...middlewares: Array<(req: AuthRequest, res: Response, next: NextFunction) => Promise<void>>) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    for (const middleware of middlewares) {
      await new Promise<void>((resolve, reject) => {
        middleware(req, res, (err?: any) => {
          if (err) reject(err);
          else resolve();
        });
      }).catch(() => {
        // Error already handled by middleware
      });
      
      // If response was sent, stop processing
      if (res.headersSent) return;
    }
    next();
  };
};