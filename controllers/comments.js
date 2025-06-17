// controllers/comments.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

// GET all comments
const getAll = async (req, res) => {
  try {
    const db = getDb();
    const comments = await db.collection('comments').find().toArray();
    res.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ error: 'An error occurred while fetching comments.' });
  }
};

// GET a single comment
const getSingle = async (req, res) => {
  const db = getDb();
  const commentId = req.params.id;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
};

// POST a new comment
const createComment = async (req, res) => {
  const db = getDb();
  const comment = {
    recipeId: req.body.recipeId,
    userId: req.body.userId,
    content: req.body.content,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (!comment.recipeId || !comment.userId || !comment.content) {
    return res.status(400).json({ error: 'Missing required comment fields' });
  }

  try {
    const result = await db.collection('comments').insertOne(comment);
    res.status(201).json({ message: 'Comment created', id: result.insertedId });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// PUT update comment
const updateComment = async (req, res) => {
  const db = getDb();
  const commentId = req.params.id;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const updatedComment = {
    content: req.body.content,
    updatedAt: new Date()
  };

  if (!updatedComment.content) {
    return res.status(400).json({ error: 'Missing content' });
  }

  try {
    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      { $set: updatedComment }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// DELETE a comment
const deleteComment = async (req, res) => {
  const db = getDb();
  const commentId = req.params.id;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(commentId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createComment,
  updateComment,
  deleteComment
};

