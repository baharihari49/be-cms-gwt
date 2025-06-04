// routes/blog/admin.routes.ts
import { Router } from 'express';
import * as postController from '../../controllers/blog/post.controller';
import * as categoryController from '../../controllers/blog/category.controller';
import * as tagController from '../../controllers/blog/tag.controller';
import * as authorController from '../../controllers/blog/author.controller';
import * as commentController from '../../controllers/blog/comment.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// Apply middleware to all admin routes
router.use(verifyToken, isAdmin);

// ========== POST ROUTES ==========
router.post('/posts', postController.createPost);
router.put('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);

// ========== CATEGORY ROUTES ==========
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// ========== TAG ROUTES ==========
router.post('/tags', tagController.createTag);
router.put('/tags/:id', tagController.updateTag);
router.delete('/tags/:id', tagController.deleteTag);

// ========== AUTHOR ROUTES ==========
router.post('/authors', authorController.createAuthor);
router.put('/authors/:id', authorController.updateAuthor);
router.delete('/authors/:id', authorController.deleteAuthor);

// ========== COMMENT ROUTES ==========
router.delete('/comments/:id', commentController.deleteComment);

export default router;