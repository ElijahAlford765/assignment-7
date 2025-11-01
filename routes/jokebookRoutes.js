// routes/jokebookRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/jokebookController');
const model = require('../models/jokebookModel');

router.get('/random', ctrl.randomJoke);
router.get('/categories', ctrl.listCategories);
router.get('/category/:category', ctrl.jokesInCategory);
router.post('/joke/add', ctrl.addJoke);

module.exports = router;
