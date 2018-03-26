const express = require('express');
const router = express.Router();
const admin_controller = require('../controllers/adminController');

// Login Page
router.get('/', admin_controller.login);

// Login Form
router.post('/', admin_controller.login_handler);

module.exports = router;
