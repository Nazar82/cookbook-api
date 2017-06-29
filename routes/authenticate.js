var express = require("express");
var router = express.Router();

module.exports = function(passport) {

    //sends success login state back to angular
    router.get('/success', function(req, res) {

        res.send({ state: 'success', user: req.user ? req.user : null });
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res) {
        res.send({ state: 'failure', user: null, message: "Invalid username or password" });
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //log out
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    return router;

}












/*var express = require("express");
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
*/
