var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , FoursquareStrategy = require('passport-foursquare').Strategy
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , expressLayouts = require('express-ejs-layouts');

var FOURSQUARE_CLIENT_ID = "4ZWLPRNEK3EKR4XFDIQHHPSOSTGSGRMYIE0OW3WQODZODCUT"
var FOURSQUARE_CLIENT_SECRET = "W0CBJBGBTE3HWVGM0C51M1QVTWAWOVOCVUEW4YDXCKV0AKMY";
var registeredusers = [];


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Foursquare profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FoursquareStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Foursquare
//   profile), and invoke a callback with a user object.
passport.use(new FoursquareStrategy({
    clientID: FOURSQUARE_CLIENT_ID,
    clientSecret: FOURSQUARE_CLIENT_SECRET,
    callbackURL: "http://ec2-52-10-184-237.us-west-2.compute.amazonaws.com:3000/auth/foursquare/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Foursquare profile is returned
      // to represent the logged-in user.  In a typical application, you would
      // want to associate the Foursquare account with a user record in your
      // database, and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express();

// configure Express

  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(session({ secret: 'keyboard cat' }));
  app.use(expressLayouts);
  app.set('layout','layout');
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
    if (req.user) {
        var alreadythere = false;
        for (var i = 0;i < registeredusers.length;i++) {
            if (req.user.name.familyName == registeredusers[i].name.familyName) {
                alreadythere = true;
            }
        }
        if (!alreadythere) {
            registeredusers.push(req.user);
        }


    }

  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user, users: registeredusers });
});

app.get('/login', function(req, res){

  res.render('login', { user: req.user });
});

app.get('/user', function(req, res){
    var showuser = null;
    for (var i = 0;i < registeredusers.length;i++) {
        if (registeredusers[i].name.familyName == req.query.fname) {
            showuser = registeredusers[i];
        }
    }
    // var sameUser = false;
    // if (req.user.id == showuser.id) {
    //     sameUser = true;
    // }
    var raw  = eval("(" + showuser._raw + ")");

  res.render('user', { userCheckins: raw.response.user.checkins.items, user: req.user, numberCheckins: raw.response.user.checkins.count });
});

app.get('/showaccount', ensureAuthenticated, function(req,res){
    if (req.user.name.familyName == req.query.lname) {
        //put stuff in here
    }
    res.render('accountview', { user: req.user, fname: req.query.fname, lname: req.query.lname});
});


// GET /auth/foursquare
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Foursquare authentication will involve
//   redirecting the user to foursquare.com.  After authorization, Foursquare
//   will redirect the user back to this application at /auth/foursquare/callback
app.get('/auth/foursquare',
  passport.authenticate('foursquare'),
  function(req, res){
    // The request will be redirected to Foursquare for authentication, so this
    // function will not be called.
  });

// GET /auth/foursquare/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/foursquare/callback',
  passport.authenticate('foursquare', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
