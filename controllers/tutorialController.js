const mongoose = require('mongoose');
const Tutorial = require('../models/tutorial');
const Category = require('../models/category');
const debug = require('debug')('admin');
const async = require('async');

// Index
exports.index = (req, res) => {
    async.parallel({
        tutorials: (callback) => {
            Tutorial.find()
            .sort({date_created: 1})
            .exec(callback);
        },
        categories: (callback) => {
            Category.find()
            .sort({name: 1})
            .exec(callback);
        }
    }, (err, results) => {
        if(err){
            debug(`error @ index: ${err}`);
            return next(err);
        }

        let template_context = {
            location: 'Index',
            user: req.session.user,
            tutorials: results.tutorials,
            categories: results.categories
        }
        res.render('index', template_context);
    });
};

exports.tutorial = (req, res, next) => {
    async.parallel({
        tutorial: (callback) => {
            Tutorial.findById(req.params.id)
            .exec(callback);
        },
        categories: (callback) => {
            Category.find()
            .sort({name: 1})
            .exec(callback);
        }
    }, (err, results) => {
        if(err){
            debug(`error @ tutorial: ${err}`);
            return next(err);
        }

        let template_context = {
            location: 'Index',
            user: req.session.user,
            tutorial: results.tutorial,
            categories: results.categories
        };

        res.render('tutorial', template_context);
    });
};

exports.references = (req, res, next) => {
    async.parallel({
        references: (callback) => {
            Reference.find()
            .sort({date_created: 1})
            .exec(callback);
        },
        categories: (callback) => {
            Category.find()
            .sort({name: 1})
            .exec(callback);
        }
    }, (err, results) => {
        if(err){
            debug(`error @ references: ${err}`);
            return next(err);
        } 

        let template_context = {
            location: 'References',
            user: req.session.user,
            references: results.references,
            categories: results.categories
        };

        res.render('references', template_context);
    });
};
