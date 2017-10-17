const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');
const config = require('../config');
const jwt = require('jsonwebtoken');
const HTTP_STATUS_CODES = require('../http_codes');

router.get('/recipes', function(req, res) {

    Recipe.find(function(err, data) {
        if (err) {
            res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
        }
        res.send(data);
    });
});

router.get('/recipe/:id', function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
        }
        res.json(recipe);
    })
});

router.put('/recipe/:id', function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
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
                res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
            }
            return res.json(recipe);
        });
    });
});

router.delete('/recipe/:id', function(req, res) {
    Recipe.remove({
        _id: req.params.id
    }, function(err, data) {
        if (err) {
            res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
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
        console.log(decoded);
        next();
    });
});

router.post('/recipes', function(req, res) {
    var recipe = new Recipe();
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
            res.json({ code: HTTP_STATUS_CODES.SERVER_ERROR, error: err });
        }
        res.json(recipe);
    });
});

module.exports = router;