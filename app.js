var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var validator = require('express-validator');
var cors = require('cors');
var responseHelper = require('./helper/response');
var mongoose = require('mongoose');
var config = require('./config/dev');
var auth = require('./common/auth');

var generateErrorObject = (param, msg, value, location) => {
  return {
      field: param,
      msg: msg
  };
};

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true }).then(() => {
    console.log('DB connection successful');
}).catch((err) => console.error(err));

app.responseHelper = responseHelper;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(cors());
app.use(auth.verify);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(validator());


app.use(require("./routes"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
