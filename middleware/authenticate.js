require('dotenv').config(); // near the top of your file

const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      // Store or use the GitHub user profile here
      return done(null, profile);
    }
  )
);

// serialize/deserialize logic
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
