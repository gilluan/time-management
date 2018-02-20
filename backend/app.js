var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require('cors');
var dateParser = require('express-query-date');
var mongoose = require('mongoose');

var users = require('./routes/users');
var tasks = require('./routes/tasks');
var auth = require('./routes/auth')

var User = require('./models/users');

var appMiddlewares = require('./middlewares/appMiddlewares');

var config = require('./config')

mongoose.connect('mongodb://localhost/tm-db');

mongoose.connection.on('connected', function () {
  config.configureDefaultUser();
});
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json({ type: function() { return true; } }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(dateParser({ formats: ['YYYY-MM-DD'] }));

app.use(cors());

app.use('/', auth);
app.use('/users', users);
app.use('/tasks', tasks);

app.use(appMiddlewares.verifyToken);
app.use(appMiddlewares.checkRole);
app.use(appMiddlewares.notFound);
app.use(appMiddlewares.devErrors);

module.exports = app;
