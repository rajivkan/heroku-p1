var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	jwtsso = require('jwtsso'),
	jwt = require("jwt-simple");
var _ = require('lodash');

// Create the application
var app = express();

app.set('port', (process.env.PORT || 5000));


// Middleware necessary for REST API's
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
    console.log("=====================================method==========================");
    console.log(req.method);
    if (req.method === 'OPTIONS') { //  || req.method === 'GET' || req.method === 'POST'
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        //res.header('Access-Control-Allow-Credentials', true);
        res.send(200);
        //return next();
    } else {
        return next();
    }
});


// Config details based on env
var config = require('config');

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

// Connecting to Master Database
var masterDB = require('./config/db/masterDB');

app.get('/favicon.ico', function(req, res){
    console.log("favicon");
    res.send(200);
});
//app.use(express.cookieParser());
app.use(cookieParser(config.cookieSecret));
app.use(cookieParser({ secret: "zY6OgVD4CCovzan8" }));
app.use(jwtsso({
    // Service endpoint that issues the jwt tokens 
    authEndpoint: "https://rajiv-test.herokuapp.com/sso",
 
    // Shared secret string with the above service 
    sharedSecret: "zY6OgVD4CCovzan8",
 
    // Public mountpoint for this app 
    mountPoint: "https://rajiv-p1.herokuapp.com",
 
    // Set max age in seconds for the tokens 
    // Defaults to 60 seconds 
    maxAge: 300,

    // Hook function call after login
    hook: function(token, done) {
        console.log("got token", token);
        done();
    }, 
}));


app.use(function(req, res, next){
	console.log(req.session.jwt);
    if (!req.session.jwt){
	    console.log('check token status');
    	return res.requestJwt();
    } 
    next();
});

console.log("Server {product} start working");

// Protect dashboard route with JWT
app.get('/dashboard', function(req, res) { 
console.log("RESULT++++++++++++++DASHBOARD==========="); 
  res.send({
                success: true,
                message: '/dashboard'
            });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//app.listen(config.get('server.listenPort'));
