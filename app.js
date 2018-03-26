const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('./config');
const User = require('./models/user');

const index = require('./routes/index');
const users = require('./routes/users');
const admin = require('./routes/admin');

const app = express();

// Database Setup
mongoose.connect(config.mongoURI[app.settings.env], (err, res) => {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoDBStore({
  uri: config.mongoURI[app.settings.env],
    collection: 'user_session'
  });
  // Catch errors
  store.on('error', (error) => {
    assert.ifError(error);
    assert.ok(false);
});

app.use(session({
  secret: 'f-_k-o5+&x34=b)xh@w-fuk7=k4gz7l1&s2i&3mp*oj#^i=z80',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, (err, user) => {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;
      }
      next();
    });
  } else {
    next();
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
