// models/jokebookModel.js
const db = require('../db');

async function getCategories() {
  const res = await db.query('SELECT name FROM categories ORDER BY name');
  return res.rows.map(r => r.name);
}

async function getCategoryIdByName(name) {
  const res = await db.query('SELECT category_id FROM categories WHERE name = $1', [name]);
  return res.rows[0] ? res.rows[0].category_id : null;
}

async function createCategory(name) {
  const res = await db.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING category_id, name',
    [name]
  );
  return res.rows[0];
}

async function getJokesByCategory(name, limit = null) {
  const catId = await getCategoryIdByName(name);
  if (!catId) return null; 
  let sql = 'SELECT setup, delivery FROM jokes WHERE category_id = $1 ORDER BY created_at DESC';
  const params = [catId];
  if (limit) {
    sql += ' LIMIT $2';
    params.push(limit);
  }
  const res = await db.query(sql, params);
  return res.rows;
}

async function addJoke(categoryName, setup, delivery) {
  let catId = await getCategoryIdByName(categoryName);
  if (!catId) {
    const newCat = await createCategory(categoryName);
    catId = newCat.category_id;
  }
  const res = await db.query(
    'INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3) RETURNING joke_id, setup, delivery',
    [catId, setup, delivery]
  );
  return res.rows[0];
}

async function getRandomJoke() {
  
  const res = await db.query('SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1');
  return res.rows[0];
}

module.exports = {
  getCategories,
  getJokesByCategory,
  addJoke,
  getRandomJoke,
  getCategoryIdByName,
  createCategory
};
