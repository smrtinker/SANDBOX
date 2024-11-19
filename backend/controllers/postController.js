import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    res.status(400);
    throw new Error('Content cannot be empty');
  }
  const post = new Post({
    author: req.user._id,
    content,
  });

  await post.save();
  await post.populate('author', 'username');
  res.status(201).json(post);
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
  res.json(posts);
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to update this post');
  }

  post.content = req.body.content || post.content;
  await post.save();

  res.json(post);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to delete this post');
  }

  await post.deleteOne();
  res.json({ message: 'Post removed' });
});

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const alreadyLiked = post.likes.find(
    (like) => like.user.toString() === req.user._id.toString()
  );

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user._id.toString()
    );
  } else {
    post.likes.push({ user: req.user._id });
  }

  await post.save();
  res.json(post.likes);
});

// @desc    Comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private
const commentPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = {
    user: req.user._id,
    username: req.user.username,
    content,
  };

  post.comments.push(comment);
  await post.save();

  res.status(201).json(post.comments);
});

export { getPosts, createPost, updatePost, deletePost, likePost, commentPost };