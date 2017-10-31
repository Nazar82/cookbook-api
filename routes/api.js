const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');
const config = require('../config');
const jwt = require('jsonwebtoken');
const HTTP_STATUS_CODES = require('../http_codes');

router.get('/recipes', function(req, res) {
    const perPage = 2;
    const page = Number(req.query.page) || 1;
    Recipe
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, recipes) {
            if (err) {
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            }
            Recipe.count().exec(function(err, count) {
                if (err) {
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                }
                res.json({ recipes: recipes, recipes_number: count });
            });
        });
});

router.get('/recipesbymain', function(req, res) {
    const perPage = 2;
    const page = Number(req.query.page) || 1;
    Recipe.find({ main: req.query.main })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, recipes) {
            if (err) {
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            }
            Recipe.count({ main: req.query.main }).exec(function(err, count) {
                if (err) {
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                }
                res.json({ recipes: recipes, recipes_number: count });
            });
        });
});

router.get('/recipesbytype', function(req, res) {
    const perPage = 2;
    const page = Number(req.query.page) || 1;
    Recipe.find({ type: req.query.type })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, recipes) {
            if (err) {
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            }
            Recipe.count({ type: req.query.type }).exec(function(err, count) {
                if (err) {
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                }
                res.json({ recipes: recipes, recipes_number: count });
            });
        });
});

router.get('/recipesbycuisine', function(req, res) {
    const perPage = 2;
    const page = Number(req.query.page) || 1;
    Recipe.find({ cuisine: req.query.cuisine })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, recipes) {
            if (err) {
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            }
            Recipe.count({ cuisine: req.query.cuisine }).exec(function(err, count) {
                if (err) {
                    return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
                }
                res.json({ recipes: recipes, recipes_number: count });
            });
        });
});

router.get('/recipes/:id', function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
        }
        const parsedRecipe = {};
        parsedRecipe.title = recipe.title;
        parsedRecipe.descript = recipe.descript;
        parsedRecipe.ingredients = recipe.ingredients;
        parsedRecipe.directions = recipe.directions;
        parsedRecipe.posted_by = recipe.posted_by;
        res.json(parsedRecipe);
    });
});

router.put('/recipe/:id', function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
        }
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
                return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            }
            res.json(recipe);
        });
    });
});

router.delete('/recipe/:id', function(req, res) {
    Recipe.remove({ _id: req.params.id }, function(err, data) {
        if (err) {
            return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
        }
        res.send(data);
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
            return res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
        }
        res.json(recipe);
    });
});

module.exports = router;
