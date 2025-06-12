const express = require('express');
const mongodb = require('./db/connection');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const MongoStore = require('connect-mongo');

const port = process.env.PORT || 3000;

// MongoDB session store setup
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions'
  })
}));

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// Headers for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.use('/', require('./routes/index'));

// Login check
app.get('/', (req, res) => {
  if (req.session.user) {
    const name = req.session.user.displayName || req.session.user.username || 'Unknown';
    res.send(`Logged in as ${name}`);
  } else {
    res.send("Logged Out");
  }
});

// Start GitHub login
app.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// OAuth callback
app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs'
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

// Connect to DB and start server
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => console.log(`DB connected. Server running on port: ${port}`));
  }
});
