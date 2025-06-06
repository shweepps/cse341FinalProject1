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


module.exports = {getAll, getSingle};