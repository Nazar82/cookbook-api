const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const HTTP_STATUS_CODES = require('../http_codes');
const MD_CODES = require('../md_codes');

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.username) {
            return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'You must provide a username' });
        }
        if (!req.body.email) {
            return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'You must provide an e-mail' });
        }
        if (!req.body.password) {
            return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'You must provide a password' });
        }
        if (req.body.password !== req.body.confirm) {
            return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'Passwords do not match' });
        }

        let user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        });

        user.save((err) => {
            if (err) {
                if (err.code === MD_CODES.MD_DUPLICATE) {
                    return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'Username or e-mail already exists' });
                }
                if (err.errors) {
                    if (err.errors.username) {
                        return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: err.errors.username.message });
                    }
                    if (err.errors.email) {
                        return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: err.errors.email.message });
                    }
                    if (err.errors.password) {
                        return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: err.errors.password.message });
                    }
                    return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: err });
                }
                return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'Could not save user. Error: ', err });
            }
            res.json({ success: true, code: HTTP_STATUS_CODES.CREATED, message: 'Account registered' });
        });
    });

    router.post('/login', (req, res) => {
        if (!req.body.username) {
            return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'No username provided' });
        }
        if (!req.body.password) {
            return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'No password provided' });
        }
        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
                return res.json({ success: false, code: HTTP_STATUS_CODES.SERVER_ERROR, message: err });
            }
            if (!user) {
                return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'Username not found' });
            }
            const validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                return res.json({ success: false, code: HTTP_STATUS_CODES.BAD_REQUEST, message: 'Password invalid' });
            }
            console.log(user);
            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
            return res.json({ success: true, code: HTTP_STATUS_CODES.OK, message: 'Success', token: token, user: { username: user.username } });
        });
    });
    return router;
};