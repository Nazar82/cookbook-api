var mongoose = require("mongoose");
var mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    created_at: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next){
    console.log("sssf");
   if(!this.isModified('password')) {
    console.log("sssf");
    return next;
   }

   bcrypt.hash(this.password, null, null, (err, hash) => {
    console.log("ggg");
     if(err) return next(err);
     this.password = hash;
     next();
   });

}); 



var recipeSchema = new mongoose.Schema({
    title: String,
    descript: String,
    ingredients: String,
    body: String,
    type: String,
    posted_by: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
mongoose.model('Recipe', recipeSchema);
