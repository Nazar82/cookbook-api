var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Recipe = mongoose.model("Recipe");
const config = require('../config');
const jwt = require("jsonwebtoken");
const codes = require('../codes');

router.get("/recipes", function(req, res) {

    Recipe.find(function(err, data) {
        if (err) {
            res.send({ code: codes.serverError, error: err });
        }
        res.send(data);
    });
});

router.get("/recipe/:id", function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            res.send({ code: codes.serverError, error: err });
        }
        res.json(recipe);
    })
});

router.put("/recipe/:id", function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            res.json({ code: codes.serverError, error: err });
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
                res.json({ code: codes.serverError, error: err });
            }
            return res.json(recipe);

        });

    });

});

router.delete("/recipe/:id", function(req, res) {
    Recipe.remove({
        _id: req.params.id
    }, function(err, data) {
        if (err) {
            res.json({ code: codes.serverError, error: err });
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


router.post("/recipes", function(req, res) {
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
            res.send({ code: codes.serverError, error: err });
        }
        res.json(recipe);
    });
});

module.exports = router;