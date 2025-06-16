const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

// GET all recipes
const getAll = async (req, res) => {
  try {
    const db = getDb();
    const recipes = await db.collection('recipes').find().toArray();
    res.json(recipes);
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    res.status(500).json({ error: 'An error occurred while fetching recipes.' });
  }
};

// GET a single recipe
const getSingle = async (req, res) => {
  const db = getDb();
  const recipeId = req.params.id;

  if (!ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(recipeId) });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

// POST a new recipe
const createRecipe = async (req, res) => {
  const db = getDb();
  const recipe = {
    title: req.body.title,
    ingredients: req.body.ingredients, // Array of strings
    instructions: req.body.instructions,
    cookingTime: req.body.cookingTime, // Number
    difficulty: req.body.difficulty,
    tags: req.body.tags || [], // Optional
    imageUrl: req.body.imageUrl || null,
    createdBy: req.body.createdBy || null // User ID or string
  };

  // Simple validation
  if (
    !recipe.title || !Array.isArray(recipe.ingredients) || !recipe.instructions ||
    typeof recipe.cookingTime !== 'number' || !recipe.difficulty
  ) {
    return res.status(400).json({ error: 'Missing or invalid recipe fields' });
  }

  try {
    const result = await db.collection('recipes').insertOne(recipe);
    res.status(201).json({ message: 'Recipe created successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

// PUT update recipe
const updateRecipe = async (req, res) => {
  const db = getDb();
  const recipeId = req.params.id;

  if (!ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const updatedRecipe = {
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    cookingTime: req.body.cookingTime,
    difficulty: req.body.difficulty,
    tags: req.body.tags || [],
    imageUrl: req.body.imageUrl || null
  };

  if (
    !updatedRecipe.title || !Array.isArray(updatedRecipe.ingredients) ||
    !updatedRecipe.instructions || typeof updatedRecipe.cookingTime !== 'number' ||
    !updatedRecipe.difficulty
  ) {
    return res.status(400).json({ error: 'Missing or invalid recipe fields' });
  }

  try {
    const result = await db.collection('recipes').updateOne(
      { _id: new ObjectId(recipeId) },
      { $set: updatedRecipe }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe updated successfully' });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

// DELETE a recipe
const deleteRecipe = async (req, res) => {
  const db = getDb();
  const recipeId = req.params.id;

  if (!ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const result = await db.collection('recipes').deleteOne({ _id: new ObjectId(recipeId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
