require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const prisma = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const app = express();

const authRoutes = require("./routes/auth");
const catalogRoutes = require("./routes/catalog");

require("./config/auth")(passport);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  const pizzas = [
    { name: "Pepperoni", desc: "Classic pepperoni pizza with mozzarella", price: "฿299" },
    { name: "Hawaiian", desc: "Ham and pineapple on a crispy crust", price: "฿279" },
    { name: "BBQ Chicken", desc: "Grilled chicken with BBQ sauce", price: "฿319" },
    { name: "Vegetarian", desc: "Loaded with fresh veggies", price: "฿259" },
  ];

  res.render("index", { user: req.user, pizzas });
});

app.use("/auth", authRoutes);
app.use("/catalog", catalogRoutes);

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
