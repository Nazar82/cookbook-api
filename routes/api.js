var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Recipe = mongoose.model("Recipe");



router.get("/recipes", function(req, res) {
    Recipe.find(function(err, data) {
        if (err) {
             res.send(500, err);
        }
        res.send(data);
    })
});

router.get("/recipe/:id", function(req, res) {
  Recipe.findById(req.params.id, function(err, recipe){
   if(err) {
      res.send(500, err);
   }
   res.json(recipe);
  })
         
         console.log(req.params.id);
     
});

router.post("/recipes", function(req, res) {
    var recipe = new Recipe();
    recipe.title = req.body.title;
    recipe.descript = req.body.descript;
    recipe.ingredients = req.body.ingredients;
    recipe.body = req.body.ingredients;
    recipe.posted_by = req.body.posted_by;

    recipe.save(function(err, recipe) {
        if (err) {
            res.send(500, err);
        }
        return res.json(recipe);
    });

});

module.exports = router;
