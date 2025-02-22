require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const prisma = require("./config/db");

const app = express();

require("./config/auth")(passport);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  prisma.$connect().then(() => {
    console.log("Connected to the database");
  });
  console.log(`Server running on port ${PORT}`);
});

app.on("close", () => {
  console.log("Disconnected the server");
  prisma.$disconnect();
});
