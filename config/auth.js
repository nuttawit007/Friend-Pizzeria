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
          let user = await prisma.user.findUnique({
            where: { username: id },
            include: { baskets: { include: { items: true } } },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name: displayName,
                username: id,
                email: emails[0].value,
                photoUrl: photos[0].value,
              },
              include: { baskets: { include: { items: true } } },
            });
          }

          if (!user.baskets || user.baskets.length === 0) {
            await prisma.basket.create({
              data: {
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });

            user = await prisma.user.findUnique({
              where: { username: id },
              include: { baskets: { include: { items: true } } },
            });
          }

          return done(null, { baskets: user.baskets[0]?.items || [], ...user });
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
      const { baskets, ...user } = await prisma.user.findUnique({
        where: { id },
        include: { baskets: { include: { items: true } } },
      });

      done(null, { ...user, baskets: baskets[0].items });
    } catch (error) {
      done(error);
    }
  });
};
