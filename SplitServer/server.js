// modules =================================================
var express        = require('express');
var expressSession = require('express-session');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport       = require('passport');

var flash          = require('connect-flash');
var morgan         = require('morgan');
// configuration ===========================================
	
// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

//app.use(morgan('dev'));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views',__dirname +'/public/views');

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(expressSession({ secret: 'mySecretKey', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
require('./app/routes.js')(app,passport);

require('./app/friendRoutes.js')(app);
require('./app/billsRoutes.js')(app);

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app

