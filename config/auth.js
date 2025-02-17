const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db'); // ตรวจสอบว่า path ถูกต้อง

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const CALLBACK_URL = process.env.CALLBACK_URL;

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      function (accessToken, refreshToken, profile, done) {
        const { id, displayName, emails, photos } = profile;

        db.get('SELECT * FROM user WHERE id = ?', [id], (err, row) => {
          if (err) return done(err);

          if (row) {
            return done(null, row);
          } else {
            db.run(
              'INSERT INTO user (id, name, email, photoUrl) VALUES (?, ?, ?, ?)',
              [id, displayName, emails[0].value, photos[0].value],
              function (err) {
                if (err) return done(err);
                return done(null, {
                  id,
                  displayName,
                  email: emails[0].value,
                  photoUrl: photos[0].value,
                });
              }
            );
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM user WHERE id = ?', [id], (err, row) => {
      if (err) return done(err);
      done(null, row);
    });
  });
};
