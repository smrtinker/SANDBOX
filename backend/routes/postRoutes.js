import express from 'express';
import { 
  getPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost, 
  commentPost 
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);  // Get all posts

// Protected routes
router.post('/', protect, createPost);  // Create a new post
router.put('/:id', protect, updatePost);  // Update a post by ID
router.delete('/:id', protect, deletePost);  // Delete a post by ID
router.put('/:id/like', protect, likePost);  // Like a post by ID
router.post('/:id/comments', protect, commentPost);  // Add a comment to a post by ID

export default router;