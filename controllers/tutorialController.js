const mongoose = require('mongoose');
const Tutorial = require('../models/tutorial');
const debug = require('debug')('admin');
const async = require('async');

// Login Page
exports.index = (req, res) => {
    res.render('index');
};
