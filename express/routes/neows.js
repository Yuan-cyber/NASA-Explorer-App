const express = require('express');
const router = express.Router();
const neowsController = require('../controllers/neowsController');

router.get('/', neowsController.getNeowsOverview);
router.get('/asteroid/:id', neowsController.getAsteroidDetail);

module.exports = router; 