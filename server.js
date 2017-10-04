var express = require("express");
var path = require('path');
var logger = require('morgan');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var mongoose = require("mongoose");
var cors = require("cors");

var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

var mongodb = "mongodb://Nazar82:020702070207@ds159254.mlab.com:59254/cookbook_data_base";
mongoose.connect(mongodb, options);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once("open", function() {
    console.log("Connected to mlab");
});

require('./models/models.js');

var app = express();

var port = process.env.PORT || 8080;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var api = require("./routes/api");
var auth = require("./routes/authenticate")(passport);



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


/* app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); */

  app.use(cors());


app.use("/api", api);
app.use("/auth", auth);
 

var initPassport = require("./passport-init");
initPassport(passport);



app.listen(port, function() {
    console.log("app running on " + port);
})
