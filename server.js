const express = require('express');
const mongodb = require('./db/connection');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors'); //

const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());


app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// cors middleware calls
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// Routes
app.use('/', require('./routes/index'));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done ){
  
  return done(null, profile);
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user,done) =>{
  done(null, user);
});

//app.get('/', (req, res) => {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

app.get('/', (req, res) => {
  if (req.session.user) {
    const name = req.session.user.displayName || req.session.user.username || 'Unknown';
    res.send(`Logged in as ${name}`);
  } else {
    res.send("Logged Out");
  }
});

app.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs', session: false}),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  });

// Start server after DB is ready
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    if (require.main === module) {
      app.listen(port, () => console.log(`DB connected. Server running on port: ${port}`));
    }
  }
});

module.exports = app; // ✅ allow importing in tests
