const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const { getDb } = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};

const getSingle = async (req, res) => {
  const db = getDb();
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch {
    res.status(400).send('Invalid ID format');
  }
};

const createUser = async (req, res) => {
  const db = getDb();
  const user = {
    Name: req.body.Name,
    Surname: req.body.Surname,
    Email: req.body.Email,
    Country: req.body.Country
  };

  try {
    const result = await db.collection('users').insertOne(user);
    res.status(201).json({ message: 'User created successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  const db = getDb();
  const userId = req.params.id;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  const updatedUser = {
    Name: req.body.Name,
    Surname: req.body.Surname,
    Email: req.body.Email,
    Country: req.body.Country
  };

  if (
    !updatedUser.Name || !updatedUser.Surname || !updatedUser.Email || !updatedUser.Country
  ) {
    return res.status(400).json({ error: 'Missing required user fields' });
  }

  try {
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedUser }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  const db = getDb();
  const userId = req.params.id;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };
