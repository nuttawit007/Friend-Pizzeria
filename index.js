require('dotenv')();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const app = express();

// Passport config (using the updated setup)
require('./config/auth')(passport);

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes

// Home route
app.get('/', (req, res) => {
  console.log(req.user);
  res.render('index', { user: req.user });
});

// Google OAuth route
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Google OAuth callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});