const express = require('express');
const ObjectId  = require('mongodb').ObjectId;
const router = express.Router();
const {getDb}  = require('../db/connection');



const getAll = async (req, res) => {
  try {
    const db = getDb();
    const books = await db.collection('Books').find().toArray();
    res.json(books);
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    res.status(500).json({ error: 'An error occurred while fetching Books.' });
  }
};

const getSingle = ('/:id', async (req, res) => {
  const db = getDb();
  try {
    const books = await db.collection('Books').findOne({ _id: new ObjectId(req.params.id) });
    if (!books) return res.status(404).send('Book not found');
    res.json(books);
  } catch {
    res.status(400).send('Invalid ID format');
  }
});

const createBook = async (req, res) => {
  const db = getDb();
  const book = {
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    publishedDate: req.body.publishedDate,
    genre: req.body.genre,
    pages: req.body.pages,
    language: req.body.language
  };

  try {
    const result = await db.collection('Books').insertOne(book);
    res.status(201).json({ message: 'Book created successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
};

const updateBook = async (req, res) => {
  const db = getDb();
  const bookId = req.params.id;

  // Validate ObjectId
  if (!ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID format' });
  }

  const updatedBook = {
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    publishedDate: req.body.publishedDate,
    genre: req.body.genre,
    pages: req.body.pages,
    language: req.body.language
  };

  // Optional: basic validation (you can enhance this with express-validator or Joi)
  if (
    !updatedBook.title || !updatedBook.author || !updatedBook.isbn ||
    !updatedBook.publishedDate || !updatedBook.genre ||
    typeof updatedBook.pages !== 'number' || !updatedBook.language
  ) {
    return res.status(400).json({ error: 'Missing or invalid book fields' });
  }

  try {
    const result = await db.collection('Books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: updatedBook }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

const deleteBook = async (req, res) => {
  const db = getDb();
  const bookId = req.params.id;

  // Validate ObjectId
  if (!ObjectId.isValid(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID format' });
  }

  try {
    const result = await db.collection('Books').deleteOne({ _id: new ObjectId(bookId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};



module.exports = {getAll, getSingle, createBook, updateBook, deleteBook};