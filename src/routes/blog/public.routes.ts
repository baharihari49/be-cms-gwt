// routes/blog/public.routes.ts
import { Router } from 'express';
import * as postController from '../../controllers/blog/post.controller';
import * as categoryController from '../../controllers/blog/category.controller';
import * as tagController from '../../controllers/blog/tag.controller';
import * as authorController from '../../controllers/blog/author.controller';
import * as commentController from '../../controllers/blog/comment.controller';

const router = Router();

// ========== POST ROUTES ==========
router.get('/posts', postController.getAllPosts);
router.get('/posts/featured', postController.getFeaturedPosts);
router.get('/posts/popular', postController.getPopularPosts);
router.get('/posts/recent', postController.getRecentPosts);
router.get('/posts/search', postController.searchPosts);
router.get('/posts/slug/:slug', postController.getPostBySlug);
router.get('/posts/:id', postController.getPostById);
router.get('/posts/category/:categoryId', postController.getPostsByCategory);
router.get('/posts/tag/:tagId', postController.getPostsByTag);
router.get('/posts/author/:authorId', postController.getPostsByAuthor);
router.patch('/posts/:id/stats', postController.updatePostStats);

// ========== CATEGORY ROUTES ==========
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);

// ========== TAG ROUTES ==========
router.get('/tags', tagController.getAllTags);
router.get('/tags/:id', tagController.getTagById);

// ========== AUTHOR ROUTES ==========
router.get('/authors', authorController.getAllAuthors);
router.get('/authors/:id', authorController.getAuthorById);

// ========== COMMENT ROUTES ==========
router.get('/posts/:postId/comments', commentController.getCommentsByPost);
router.post('/posts/:postId/comments', commentController.createComment);

export default router;