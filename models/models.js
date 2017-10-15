const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    }
    if (username.length < 3 || username.length > 15) {
        return false;
    }
    return true;
};

let validUsername = (username) => {
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



let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    }
    if (email.length < 5 || email.length > 30) {
        return false;
    }
    return true;
};


let validEmailChecker = (email) => {
    if (!email) {
        return false;
    }
    const reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return reg.test(email); 
};

const emailValidators = [{
        validator: emailLengthChecker,
        message: 'E-mail must be at least 5 characters but no more than 30'
    },
    {
        validator: validEmailChecker,
        message: 'Must be a valid e-mail'
    }
];


let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    }
    if (password.length < 3 || password.length > 35) {
        return false;
    }
    return true;
};



const passwordValidators = [{
    validator: passwordLengthChecker,
    message: 'Password must be at least 3 characters but no more than 35'
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