const express = require('express');
const router = express.Router();
const epicController = require('../controllers/epicController');

router.get('/', epicController.getEpic);

module.exports = router; 