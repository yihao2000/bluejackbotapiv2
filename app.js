const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Sequelize, DataTypes } = require("sequelize");
const config = require('./config/config.json')['development'];
const cors = require('cors')



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const classRouter = require('./routes/classes')
const semestersRouter = require('./routes/semesters')
const channelsRouter = require('./routes/channels')
const messagesRouter = require('./routes/messages')
const messageTemplateRouter = require("./routes/message_templates")


const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const db = require("./models/index");

db.sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/classes', classRouter);
app.use('/semesters', semestersRouter);
app.use('/channels', channelsRouter);
app.use('/messages', messagesRouter);
app.use('/message_templates', messageTemplateRouter);




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
