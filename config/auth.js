const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./db");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const CALLBACK_URL = process.env.CALLBACK_URL;

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        const { id, displayName, emails, photos } = profile;

        try {
          let user = await prisma.user.findUnique({ where: { id } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                id,
                name: displayName,
                email: emails[0].value,
                photoUrl: photos[0].value,
              },
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
