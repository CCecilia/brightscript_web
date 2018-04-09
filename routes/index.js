const express = require('express');
const router = express.Router();
const tutorial_controller = require('../controllers/tutorialController');
const requireLogin = require('../middleware/auth');

// Index
router.get('/', tutorial_controller.index);

module.exports = router;
