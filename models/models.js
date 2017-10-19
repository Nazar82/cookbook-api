const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


function usernameLengthChecker(username) {
    if (!username) {
        return false;
    }
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 15;
    if (username.length < MIN_LENGTH || username.length > MAX_LENGTH) {
        return false;
    }
    return true;
};

function validUsername(username) {
    if (!username) {
        return false;
    }
    const reg = new RegExp(/^[a-zA-Z0-9]+$/);
    return reg.test(username);
};

const usernameValidators = [{
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 characters but no more than 15'
    },
    {
        validator: validUsername,
        message: 'Username must not have any special characters'
    }
];

function emailLengthChecker(email) {
    if (!email) {
        return false;
    }
    const MIN_LENGTH = 5;
    const MAX_LENGTH = 254;
    if (email.length < MIN_LENGTH || email.length > MAX_LENGTH) {
        return false;
    }
    return true;
};

function validEmailChecker(email) {
    if (!email) {
        return false;
    }
    const reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return reg.test(email);
};

const emailValidators = [{
        validator: emailLengthChecker,
        message: 'E-mail must be at least 5 characters but no more than 254'
    },
    {
        validator: validEmailChecker,
        message: 'Must be a valid e-mail'
    }
];

function passwordLengthChecker(password) {
    if (!password) {
        return false;
    }
    const MIN_LENGTH = 6;
    const MAX_LENGTH = 35;
    if (password.length < MIN_LENGTH || password.length > MAX_LENGTH) {
        return false;
    }
    return true;
};

const passwordValidators = [{
    validator: passwordLengthChecker,
    message: 'Password must be at least 6 characters but no more than 35'
}];

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, validate: usernameValidators },
    email: { type: String, required: true, unique: true, validate: emailValidators },
    password: { type: String, required: true, validate: passwordValidators },
    created_at: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next;
    }
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });

});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const recipeSchema = new mongoose.Schema({
    title: String,
    descript: String,
    ingredients: String,
    directions: String,
    main: String,
    type: String,
    cuisine: String,
    posted_by: String,
    created_at: { type: Date, default: Date.now }
});

mongoose.model('User', userSchema);
mongoose.model('Recipe', recipeSchema);