const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
const User = require('../models/user');
const Tutorial = require('../models/tutorial');
const Category = require('../models/category');
const debug = require('debug')('admin');
const async = require('async');

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

        if (!errors.isEmpty()) {
            res.render('login', { title: 'LED Plus', errors: errors.array()});
            return;
        } else {
            User.findOne({ 'email' :  req.body.email }, function(err, user) {
                if(err) {return next(err);}

                if (!user || !user.validPassword(req.body.password)) {
                    res.render('adminLogin', { errors: [{msg: 'Incorrect username/password'}]});
                    return;
                } else if ( !user.admin ) {
                    res.render('adminLogin', { errors: [{msg: 'Incorrect permissions'}]});
                    return;
                } else {
                    req.session.user = user;
                    res.redirect('/admin/dashboard/');
                }
            });
        }
    }
];

// Dashboard
exports.dashboard = (req, res) => {
    let template_context = {
        location: 'Dashboard',
        user: req.session.user
    }
    res.render('adminDashboard', template_context);
};

// Tutorials
exports.tutorials = (req, res, next) => {
    async.parallel({
        tutorials: (callback) => {
            Tutorial.find()
            .sort({date_created: 1})
            .exec(callback);
        }
    }, (err, results) => {
        if(err){
            debug(`error @ tutorial list: ${err}`);
            return next(err);
        }

        let template_context = {
            location: 'Tutorials',
            user: req.session.user,
            tutorials: results.tutorials
        }
        res.render('adminTutorials', template_context);
    });
};

// Tutorials:Create
exports.tutorial_create = (req, res) => {
    let template_context = {
        location: 'Tutorial Create',
        user: req.session.user
    }
    res.render('adminTutorialCreate', template_context);
};

// Tutorials:Update
exports.tutorial_update = (req, res) => {
    //  Update/Create
    if( req.body._id ) {
        update = {
            cover_title: req.body.cover_title,
            cover_description: req.body.cover_description,
            cover_image: req.body.cover_image,
            steps: req.body.steps
        };

        Tutorial.findByIdAndUpdate(
            req.body._id,
            update,
            {upsert: true},
            (err, results) => {
                 console.log(results);
                 if(err) {
                     debug(`error @ update tutorial: ${err}`);
                     res.json({status: 500, error_msg: err.msg});
                 }

                 res.json({status: 200, tutorial_id: req.body._id})
             }
         )
    } else {
        let new_tutorial = new Tutorial({
            cover_title: req.body.cover_title,
            cover_image: req.body.cover_image,
            cover_description: req.body.cover_description,
            step: []
        });

        // handle steps
        let steps = req.body.steps;
        for( let i = 0; i < steps.length; i++) {
            // create new step
            let new_step = {
                title: steps[i].title,
                description: steps[i].description,
                image: steps[i].image
            };

            // add step to tutorial
            new_tutorial.steps.push(new_step);
        }
        console.log(new_tutorial);

        // save new tutorial
        new_tutorial.save((err) => {
            if(err){
                debug(`error @ create tutorial: ${err}`);
                res.json({status: 500, error_msg: 'Tutorial failed to save'});
            }
            res.json({status: 200, tutorial_id: new_tutorial._id});
        });
    }
};

// Tutorials:Publish
exports.tutorial_publish = (req, res) => {
    console.log(req.body._id);
    Tutorial.findByIdAndUpdate(
        req.body._id,
        {published: true},
        (err, results) => {
            console.log(results);
            if(err) {
                debug(`error @ update tutorial: ${err}`);
                res.json({status: 500, error_msg: err.msg});
            }

            res.json({status: 200})
        }
    );
    res.json({status: 200});
};

// Categories
exports.categories = (req, res) => {
    async.parallel({
        categories: (callback) => {
            Category.find()
            .sort({name: 1})
            .exec(callback);
        }
    }, (err, results) => {
        if(err){
            debug(`error @ category list: ${err}`);
            return next(err);
        }

        let template_context = {
            location: 'Categories',
            user: req.session.user,
            categories: results.categories
        };
        res.render('adminCategories', template_context);
    });

}

// Categories: create
exports.category_new = (req, res) => {
    // create new category
    let new_category = new Category({
        name: req.body.name
    });

    // save new category
    new_category.save((err) => {
        if(err){
            debug(`error @ create category: ${err}`);
            res.json({status: 500, error_msg: 'category failed to save'});
        }
        res.json({status: 200});
    });
};
