const express = require('express');
const router = express.Router();
const admin_controller = require('../controllers/adminController');
const requireLogin = require('../middleware/auth');

// Login Page
router.get('/', admin_controller.login);

// Login Form
router.post('/', admin_controller.login_handler);

// Dashboard
router.get('/dashboard', requireLogin, admin_controller.dashboard);

// Tutorials
router.get('/tutorials', requireLogin, admin_controller.tutorials);

// Tutorials: create page
router.get('/tutorials/create', requireLogin, admin_controller.tutorial_create);

// Tutorial: update
router.post('/tutorials/update',  admin_controller.tutorial_update);

// Tutorial: tutorial
router.get('/tutorials/:id', admin_controller.tutorial);

// Tutorial: categories
router.get('/categories',  admin_controller.categories);

// Tutorial: categories create
router.put('/categories/new',  admin_controller.category_new);

module.exports = router;
