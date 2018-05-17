const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const i18n = require('i18n-express');
const handlebars = require('handlebars');
const exphbs  = require('express-handlebars');
const helpers = require('handlebars-helpers')(['comparison']);
const rtlcss = require('rtlcss');



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();


const hbs = exphbs.create({
  helpers: {
    compare : helpers.compare,
    eq: helpers.eq
  },
  defaultLayout : '../layout.hbs'
  // handlebars: handlebars
})

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en","ku"],
  textsVarName: 'translation',
  defaultLang: 'en',
  cookieLangName: 'lang'
  
}));

app.use(function(req, res, next){
  res.locals.lang = req.session.lang || '';
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
