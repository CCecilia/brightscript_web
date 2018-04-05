const express = require('express');
const router = express.Router();
const admin_controller = require('../controllers/adminController');
const requireLogin = require('../middleware/auth');

// Login Page
router.get('/', admin_controller.login);

// Login Form
router.post('/', admin_controller.login_handler);

// Dashboard page
router.get('/dashboard', requireLogin, admin_controller.dashboard);

// Tutorials
router.get('/tutorials', requireLogin, admin_controller.tutorials);

// Tutorials:create page
router.get('/tutorials/create', requireLogin, admin_controller.tutorial_create);

// Tutorial:update call
router.post('/tutorials/update',  admin_controller.tutorial_update);

// Tutorial:publish call
router.post('/tutorials/publish',  admin_controller.tutorial_publish);

// Tutorial:categories
router.get('/categories',  admin_controller.categories);

// Tutorial:categories create
router.put('/categories/new',  admin_controller.category_new);

module.exports = router;
