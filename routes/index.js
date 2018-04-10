const express = require('express');
const router = express.Router();
const tutorial_controller = require('../controllers/tutorialController');
const requireLogin = require('../middleware/auth');

// Index
router.get('/', tutorial_controller.index);

// Index: tutorial
router.get('/tutorial/:id', tutorial_controller.tutorial);

// Index: references
router.get('/references', tutorial_controller.references);

module.exports = router;
