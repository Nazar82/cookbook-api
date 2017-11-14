const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');
const User = mongoose.model('User');
const config = require('../config');
const jwt = require('jsonwebtoken');
const HTTP_STATUS_CODES = require('../http_codes');
const logger = require('../logs/log')(module);

router.get('/recipes', function(req, res) {
    const perPage = 2;
    const page = Number(req.query.page) || 1;
    Recipe
        .find({})
        .sort({ 'created_at': -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, recipes) {
            if (err) {
                logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
            }
            Recipe.count().exec(function(err, count) {
                if (err) {
                    logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
                }
                res.json({ recipes: recipes, recipes_number: count });
            });
        });
});

router.get('/recipesbymain', function(req, res) {
    const perPage = 2;
    const page = Number(req.query.page) || 1;
    Recipe.find({ main: req.query.main })
        .sort({ 'created_at': -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, recipes) {
            if (err) {
                logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
            }
            Recipe.count({ main: req.query.main }).exec(function(err, count) {
                if (err) {
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
                }
                res.json({ recipes: recipes, recipes_number: count });
            });
        });
});

router.get('/recipesbytype', function(req, res) {
    const perPage = 2;
    const page = Number(req.query.page) || 1;
    Recipe.find({ type: req.query.type })
        .sort({ 'created_at': -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, recipes) {
            if (err) {
                logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
            }
            Recipe.count({ type: req.query.type }).exec(function(err, count) {
                if (err) {
                    logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
                }
                res.json({ recipes: recipes, recipes_number: count });
            });
        });
});

router.get('/recipesbycuisine', function(req, res) {
    const perPage = 2;
    const page = Number(req.query.page) || 1;
    Recipe.find({ cuisine: req.query.cuisine })
        .sort({ 'created_at': -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, recipes) {
            if (err) {
                logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
            }
            Recipe.count({ cuisine: req.query.cuisine }).exec(function(err, count) {
                if (err) {
                    logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
                }
                res.json({ recipes: recipes, recipes_number: count });
            });
        });
});

router.get('/recipes/:id', function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
        }
        const parsedRecipe = {};
        parsedRecipe._id = recipe._id;
        parsedRecipe.title = recipe.title;
        parsedRecipe.descript = recipe.descript;
        parsedRecipe.ingredients = recipe.ingredients;
        parsedRecipe.directions = recipe.directions;
        parsedRecipe.type = recipe.type;
        parsedRecipe.main = recipe.main;
        parsedRecipe.cuisine = recipe.cuisine;
        parsedRecipe.posted_by = recipe.posted_by;

        res.json(parsedRecipe);
    });
});

router.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.json({ success: false, message: 'No token provided' });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.json({ success: false, message: 'Token invalid ' + err });
        }
        req.decoded = decoded;
        console.log(decoded);
        next();
    });
});

router.post('/recipes', function(req, res) {
    const recipe = new Recipe();
    recipe.title = req.body.title;
    recipe.descript = req.body.descript;
    recipe.ingredients = req.body.ingredients;
    recipe.directions = req.body.directions;
    recipe.main = req.body.main;
    recipe.type = req.body.type;
    recipe.cuisine = req.body.cuisine;
    recipe.posted_by = req.body.posted_by;

    recipe.save(function(err, recipe) {
        if (err) {
            logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
        }
        res.json(recipe);
    });
});

router.put('/recipe/:id', function(req, res) {
    User.findOne({ _id: req.decoded.userId }, (err, user) => {
        if (err) {
            logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            return res.json({ success: false, code: HTTP_STATUS_CODES.SERVER_ERROR, message: err });
        }
        Recipe.findById(req.params.id, function(err, recipe) {
            if (err) {
                logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
            }
            if (user.username !== recipe.posted_by) {
                return res.json({ code: HTTP_STATUS_CODES.FORBIDDEN, message: 'You may edit only recipes You have posted' });
            }
            recipe.title = req.body.title;
            recipe.descript = req.body.descript;
            recipe.ingredients = req.body.ingredients;
            recipe.directions = req.body.directions;
            recipe.main = req.body.main;
            recipe.type = req.body.type;
            recipe.cuisine = req.body.cuisine;
            recipe.save(function(err, recipe) {
                if (err) {
                    logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
                }
                res.json(recipe);
            });
        });
    });
});


router.delete('/recipe/:id', function(req, res) {
    User.findOne({ _id: req.decoded.userId }, (err, user) => {
        if (err) {
            logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            return res.json({ success: false, code: HTTP_STATUS_CODES.SERVER_ERROR, message: err });
        }
        Recipe.findById(req.params.id, function(err, recipe) {
            if (err) {
                logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
            }
            if (user.username !== recipe.posted_by) {
                return res.json({ code: HTTP_STATUS_CODES.FORBIDDEN, message: 'You may delete only recipes You have posted' });
            }
            Recipe.remove({ _id: req.params.id }, function(err, data) {
                if (err) {
                    logger.error({ message: 'Server error', code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, message: 'Server error' });
                }
                res.json(data);
            });
        });
    });
});

module.exports = router;
