var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var fileUpload = require('express-fileupload');





var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));



io.on('connection', function(socket){
	
	console.log('a user connected');
	socket.on('chat message', function(msg){
		//console.log(msg);
		io.emit('chat message', msg);
		
	});
	socket.on('type message', function(msg){
		//console.log(msg);
		io.emit('type message', msg);
		
	});
	socket.on('disconnect', function(){
		
		console.log('A user disconnected');
		
	});
});

http.listen(9000, function(){
	
	console.log("App is Listening port 3000");
	
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use("/public", express.static(path.join(__dirname, 'public')));





app.get('/readText', routes.readText);
app.get('/readDoc', routes.readDoc);
app.get('/readDjango', routes.readDjango);
app.post('/userRecord', routes.userRecord);
app.post('/newuserLoginRecord', routes.newuserLoginRecord);
app.post('/newuserCVRecord', routes.newuserCVRecord);
app.post('/getSuitableProfile', routes.getSuitableProfile);
app.get('/Djangologin', routes.Djangologin);
app.get('/Djangohome', routes.Djangohome);
app.get('/DjangoJob', routes.DjangoJob);
app.get('/Check', routes.Check);
app.get('/postJob', routes.postJob);
app.post('/postJobData', routes.postJobData);
app.get('/do_logout', routes.do_logout);
app.get('/uploader_login', routes.uploader_login);
app.post('/newuserUploaderRecord', routes.newuserUploaderRecord);
app.get('/uploader_logout', routes.uploader_logout);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
