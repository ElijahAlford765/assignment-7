
const model = require('../models/jokebookModel');


async function listCategories(req, res) {
  try {
    const categories = await model.getCategories();
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error listing categories' });
  }
}


async function jokesInCategory(req, res) {
  try {
    const category = req.params.category;
    const limitParam = req.query.limit;
    const limit = limitParam ? parseInt(limitParam, 10) : null;
    if (limitParam && (Number.isNaN(limit) || limit <= 0)) {
      return res.status(400).json({ error: 'limit must be a positive integer' });
    }
    const jokes = await model.getJokesByCategory(category, limit);
    if (jokes === null) {
      return res.status(404).json({ error: `Category "${category}" not found` });
    }
    res.json({ category, jokes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching jokes' });
  }
}

async function randomJoke(req, res) {
  try {
    const joke = await model.getRandomJoke();
    if (!joke) return res.status(404).json({ error: 'No jokes available' });
    res.json(joke);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching random joke' });
  }
}

async function addJoke(req, res) {
  try {
    const { category, setup, delivery } = req.body;
    if (!category || !setup || !delivery) {
      return res.status(400).json({ error: 'Missing required fields: category, setup, delivery' });
    }
    await model.addJoke(category, setup, delivery);
   
    const jokes = await model.getJokesByCategory(category);
    res.status(201).json({ category, jokes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding joke' });
  }
}

module.exports = {
  listCategories,
  jokesInCategory,
  randomJoke,
  addJoke
};




