// controllers/favorites.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

// GET all favorites
const getAll = async (req, res) => {
  try {
    const db = getDb();
    const favorites = await db.collection('favorites').find().toArray();
    res.json(favorites);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    res.status(500).json({ error: 'An error occurred while fetching favorites.' });
  }
};

// GET a single favorite
const getSingle = async (req, res) => {
  const db = getDb();
  const favoriteId = req.params.id;

  if (!ObjectId.isValid(favoriteId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const favorite = await db.collection('favorites').findOne({ _id: new ObjectId(favoriteId) });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json(favorite);
  } catch (error) {
    console.error('Error fetching favorite:', error);
    res.status(500).json({ error: 'Failed to fetch favorite' });
  }
};

// POST a new favorite
const createFavorite = async (req, res) => {
  const db = getDb();
  const favorite = {
    recipeId: req.body.recipeId,
    userId: req.body.userId,
    favoritedAt: new Date()
  };

  if (!favorite.recipeId || !favorite.userId) {
    return res.status(400).json({ error: 'Missing recipeId or userId' });
  }

  try {
    const result = await db.collection('favorites').insertOne(favorite);
    res.status(201).json({ message: 'Favorite added', id: result.insertedId });
  } catch (error) {
    console.error('Error creating favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// DELETE a favorite
const deleteFavorite = async (req, res) => {
  const db = getDb();
  const favoriteId = req.params.id;

  if (!ObjectId.isValid(favoriteId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const result = await db.collection('favorites').deleteOne({ _id: new ObjectId(favoriteId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createFavorite,
  deleteFavorite
};
