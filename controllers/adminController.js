const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
const User = require('../models/user');

// Login Page
exports.login = (req, res) => {
    res.render('adminLogin');
};

// Login Form
exports.login_handler = [
    // Validate/Sanitize fields
    body('email', 'Email required').isLength({ min: 1 }).trim(),
    body('password', 'Password required').isLength({ min: 1 }).trim(),
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        let errors = validationResult(req);
        console.log(errors);
        console.log(req.body.email);

        if (!errors.isEmpty()) {
            res.render('login', { title: 'LED Plus', errors: errors.array()});
            return;
        } else {
            User.findOne({ 'email' :  req.body.email }, function(err, user) {
                if(err) {return next(err);}

                if (!user || !user.validPassword(req.body.password)) {
                    res.render('adminLogin', { errors: [{msg: 'Incorrect username/password'}]});
                    return;
                } else {
                    req.session.user = user;
                    res.redirect(user.dashboard);
                }
            });
        }
    }
];
