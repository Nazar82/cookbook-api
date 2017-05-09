var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");


router.post('/user', function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save(function(err, user) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(user);
    });

});

module.exports = router;
