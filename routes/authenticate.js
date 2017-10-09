 const mongoose = require("mongoose");
 const User = mongoose.model("User");
 const jwt = require("jsonwebtoken");
 const crypto = require('crypto');
 const secret = crypto.randomBytes(256).toString('hex');

 module.exports = (router) => {

     router.post('/register', (req, res) => {

         if (!req.body.email) {
             res.json({ success: false, message: 'You must provide an e-mail' });
         } else {
             if (!req.body.username) {
                 res.json({ success: false, message: 'You must provide a username' });
             } else {
                 if (!req.body.password) {
                     res.json({ success: false, message: 'You must provide a password' });
                 } else {

                     let user = new User({
                         email: req.body.email,
                         username: req.body.username,
                         password: req.body.password
                     });

                     user.save((err) => {
                         if (err) {
                             if (err.code === 11000) {
                                 res.json({ success: false, message: 'Username or e-mail already exists' });
                             } else {
                                 if (err.errors) {
                                     if (err.errors.email) {
                                         res.json({ success: false, message: err.errors.email.message });
                                     }
                                 } else {
                                     res.json({ success: false, message: 'Could not save user. Error ', err });
                                 }
                             }
                         } else {
                             console.log(secret);
                             const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' });

                             res.json({ success: true, message: 'Account registered' });
                         }
                     });

                 }
             }
         }

     });

     router.post('/login', (req, res) => {
         if (!req.body.username) {
             res.json({ success: false, message: 'No username provided' });
         } else {
             if (!req.body.password) {
                 res.json({ success: false, message: 'No password provided' });
             } else {
                 User.findOne({ username: req.body.username }, (err, user) => {
                     if (err) {
                         res.json({ success: false, message: err })
                     } else {
                         if (!user) {
                             res.json({ success: false, message: 'Username not found' });
                         } else {
                             const validPassword = user.comparePassword(req.body.password);
                             if (!validPassword) {
                                 res.json({ success: false, message: 'Password invalid' });

                             } else {
                                 const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' });
                                 res.json({ success: true, message: 'Success', token: token, user: { username: user.username } });
                             }

                         }
                     }
                 })
             }
         }

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