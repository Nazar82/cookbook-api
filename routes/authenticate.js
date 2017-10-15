 const mongoose = require("mongoose");
 const User = mongoose.model("User");
 const jwt = require("jsonwebtoken");
 const config = require('../config');
 const codes = require('../codes');

 module.exports = (router) => {

     router.post('/register', (req, res) => {
         if (!req.body.username) {
             return res.json({ success: false, code: codes.badRequest, message: 'You must provide a username' });
         }
         if (!req.body.email) {
             return res.json({ success: false, code: codes.badRequest, message: 'You must provide an e-mail' });
         }
         if (!req.body.password) {
             return res.json({ success: false, code: codes.badRequest, message: 'You must provide a password' });
         }
         if (req.body.password !== req.body.confirm) {
             return res.json({ success: false, code: codes.badRequest, message: 'Passwords do not match' });
         }

         let user = new User({
             email: req.body.email,
             username: req.body.username,
             password: req.body.password
         });

         user.save((err) => {
             if (err) {
                 if (err.code === codes.mdDuplicate) {
                     return res.json({ success: false, code: codes.badRequest, message: 'Username or e-mail already exists' });
                 }
                 if (err.errors) {
                     if (err.errors.username) {
                         return res.json({ success: false, code: codes.badRequest, message: err.errors.username.message });
                     }
                     if (err.errors.email) {
                         return res.json({ success: false, code: codes.badRequest, message: err.errors.email.message });
                     }
                     if (err.errors.password) {
                         return res.json({ success: false, code: codes.badRequest, message: err.errors.password.message });
                     }
                     return res.json({ success: false, code: codes.badRequest, message: err });
                 }
                 return res.json({ success: false, code: codes.badRequest, message: 'Could not save user. Error: ', err });
             }
             res.json({ success: true, code: codes.created, message: 'Account registered' });
         });
     });

     router.post('/login', (req, res) => {
         if (!req.body.username) {
             return res.json({ success: false, code: badRequest, message: 'No username provided' });
         }
         if (!req.body.password) {
             return res.json({ success: false, code: badRequest, message: 'No password provided' });
         }
         User.findOne({ username: req.body.username }, (err, user) => {
             if (err) {
                 return res.json({ success: false, code: codes.serverError, message: err })
             }
             if (!user) {
                 return res.json({ success: false, code: codes.badRequest, message: 'Username not found' });
             }
             const validPassword = user.comparePassword(req.body.password);
             if (!validPassword) {
                 return res.json({ success: false,  code: codes.badRequest, message: 'Password invalid' });
             }
             const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
             return res.json({ success: true, code: codes.ok, message: 'Success', token: token, user: { username: user.username } });
         })
     })

     return router;
 }


















 /*var express = require("express");
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

 }  */













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