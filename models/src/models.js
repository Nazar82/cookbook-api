var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    created_at: { type: Date, default: Date.now }
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

mongoose.model('User', userSchema);
mongoose.model('Recipe', recipeSchema);
