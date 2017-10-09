const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


let emailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
};

const emailValidators = [{
    validator: emailChecker,
    message: 'E-mail must be at least 5 charaters but not more than 30'
}];

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, validate: emailValidators },
    password: { type: String, required: true },
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
    body: String,
    type: String,
    posted_by: String,
    created_at: { type: Date, default: Date.now }
});

mongoose.model('User', userSchema);
mongoose.model('Recipe', recipeSchema);