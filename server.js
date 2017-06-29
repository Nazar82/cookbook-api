var express = require("express");
var path = require('path');
var logger = require('morgan');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var mongoose = require("mongoose");
var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

var mongodb = "mongodb://Nazar82:02070207@ds127801.mlab.com:27801/cookbook_db"
mongoose.connect(mongodb, options);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once("open", function() {
    console.log("Connected to mlab");
});

require('./models/models.js');

var api = require("./routes/api");
var auth = require("./routes/authenticate")(passport);

var app = express();
 
var port = process.env.PORT || 8080;

app.use(logger('dev'));
app.use(session({
    secret: "keyboard cat"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", api);
app.use("/auth", auth);
 

var initPassport = require("./passport-init");
initPassport(passport);



app.listen(port, function() {
    console.log("app running on 8080");
})
