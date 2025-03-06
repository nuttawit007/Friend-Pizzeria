require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const prisma = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const app = express();

const authRoutes = require("./routes/auth");

const pizzaRoutes = require("./routes/pizza");

const historyRoutes = require("./routes/history");

const forumRoutes = require("./routes/forum");

const dashboardRoutes = require("./routes/dashboard");

require("./config/auth")(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", path.join(__dirname, "views/layout.ejs"));
app.use(expressLayouts);

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  if (req.user) {
    try {
      const { baskets, ...user } = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { baskets: { include: { items: true } } },
      });
      req.user = { ...user, baskets: baskets[0].items };
    } catch (error) {
      return next(error);
    }
  }
  next();
});

app.get("/", async (req, res) => {
  const pizzas = await prisma.pizza.findMany({
    take: 4,
  });
  res.render("index", { user: req.user, pizzas });
});

app.use("/auth", authRoutes);
app.use(pizzaRoutes);
app.use(historyRoutes);
app.use(forumRoutes);
app.use("/dashboard", dashboardRoutes);

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
