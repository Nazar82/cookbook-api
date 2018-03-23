const express = require('express');
const path = require('path');
const logger = require('./logs/log')(module);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();

const mongodb = 'mongodb://Nazar82:020702070207@ds159254.mlab.com:59254/cookbook_data_base';

mongoose.connect(mongodb, {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30
});

const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function () {
    logger.info('Connected to mlab');
});

require('./models/models.js');

const app = express();
const port = process.env.PORT || 8080;

const api = require('./routes/api');
const auth = require('./routes/authenticate')(router);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api', api);
app.use('/auth', auth);

app.listen(port, function () {
    logger.info('App running on ' + port);
});
