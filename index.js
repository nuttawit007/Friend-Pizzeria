require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const prisma = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const app = express();

const authRoutes = require("./routes/auth");

const menuRoutes = require("./routes/menu");

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

function requireAuth(req, res, next) {
  const whitelist = ["/"];

  if (whitelist.includes(req.path) || req.path.startsWith("/auth")) {
    return next();
  }

  if (!req.user) {
    return res.redirect("/auth/google");
  }

  next();
}
app.use(requireAuth);

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
  const appetizers = await prisma.appetizer.findMany({
    take: 4,
  });
  const drinks = await prisma.drink.findMany({
    take: 4,
  });
  const snacks = await prisma.snack.findMany({
    take: 4,
  });
  res.render("index", { user: req.user, pizzas, appetizers, drinks, snacks });
});

app.use("/auth", authRoutes);
app.use(menuRoutes);
app.use(historyRoutes);
app.use(forumRoutes);
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 3000;

async function seedDatabase() {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        username: "114919480762617826201",
        email: "friendpizzeria@gmail.com"
      }
    })
    if(!admin) {
      const user = await prisma.user.create({
        data: {
          email: "friendpizzeria@gmail.com",
          username: "114919480762617826201",
          photoUrl: "https://lh3.googleusercontent.com/a/ACg8ocIGSItGmju1c1HaWRNnElavgJ2W8mGMnTK5YfKlQHiqX_2i=s96-c",
          name: "Friend Pizzeria",
          role: "ADMIN"
        }
      })
      await prisma.basket.create({
        data: {userId: user.id}
      })
    }
    const ingredient = [
      {
        name: "มอซซาเรลล่า",
        imageUrl: "/img/assets/ingredient/cheese/mozzarella.png",
        key: "mozzarella",
        amount: 10,
        color: null,
        type: "CHEESE",
      },
      {
        name: "พาร์เมซาน",
        imageUrl: "/img/assets/ingredient/cheese/parmesan.png",
        key: "parmesan",
        amount: 10,
        color: null,
        type: "CHEESE",
      },
      {
        name: "บลูชีส",
        imageUrl: "/img/assets/ingredient/cheese/bluecheese.png",
        key: "bluecheese",
        amount: 0,
        color: null,
        type: "CHEESE",
      },
      {
        name: "เชดดาร์",
        imageUrl: "/img/assets/ingredient/cheese/cheddar.png",
        key: "cheddar",
        amount: 10,
        color: null,
        type: "CHEESE",
      },
      {
        name: "เฟต้า",
        imageUrl: "/img/assets/ingredient/cheese/feta.png",
        key: "feta",
        amount: 0,
        color: null,
        type: "CHEESE",
      },
      {
        name: "แฮม",
        imageUrl: "/img/assets/ingredient/meat/ham.png",
        key: "ham",
        amount: 10,
        color: null,
        type: "MEAT",
      },
      {
        name: "กุ้ง",
        imageUrl: "/img/assets/ingredient/meat/shrimp.png",
        key: "shrimp",
        amount: 10,
        color: null,
        type: "MEAT",
      },
      {
        name: "ไก่บัพฟาโล",
        imageUrl: "/img/assets/ingredient/meat/buffalochicken.png",
        key: "friedchicken",
        amount: 0,
        color: null,
        type: "MEAT",
      },
      {
        name: "หมูรวมควัน",
        imageUrl: "/img/assets/ingredient/meat/pulledpork.png",
        key: "pulledpork",
        amount: 10,
        color: null,
        type: "MEAT",
      },
      {
        name: "เปปเปอโรนี",
        imageUrl: "/img/assets/ingredient/meat/pepperoni.png",
        key: "pepperoni",
        amount: 10,
        color: null,
        type: "MEAT",
      },
      {
        name: "เบคอน",
        imageUrl: "/img/assets/ingredient/meat/bacon.png",
        key: "bacon",
        amount: 10,
        color: null,
        type: "MEAT",
      },
      {
        name: "เห็ด",
        imageUrl: "/img/assets/ingredient/veg/mushroom.png",
        key: "mushroom",
        amount: 0,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "ฮาลาพีโย่",
        imageUrl: "/img/assets/ingredient/veg/jalapeno.png",
        key: "jalapeno",
        amount: 0,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "พริก",
        imageUrl: "/img/assets/ingredient/veg/redchili.png",
        key: "redchili",
        amount: 10,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "พริกหวาน",
        imageUrl: "/img/assets/ingredient/veg/bellpepper.png",
        key: "bellpaper",
        amount: 0,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "หอมแดง",
        imageUrl: "/img/assets/ingredient/veg/onion.png",
        key: "onion",
        amount: 10,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "มะกอก",
        imageUrl: "/img/assets/ingredient/veg/blackolive.png",
        key: "olive",
        amount: 10,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "มะเขือเทศ",
        imageUrl: "/img/assets/ingredient/veg/tomato.png",
        key: "tomato",
        amount: 10,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "ปวยเล้ง",
        imageUrl: "/img/assets/ingredient/veg/spinach.png",
        key: "spinach",
        amount: 10,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "โหระพา",
        imageUrl: "/img/assets/ingredient/veg/basil.png",
        key: "basil",
        amount: 10,
        color: null,
        type: "VEGETABLE",
      },
      {
        name: "ซอสแดง",
        imageUrl: "/img/assets/ingredient/sauce/saucetomato.png",
        key: "saucetomato",
        amount: 10,
        color: null,
        type: "SAUCE",
      },
      {
        name: "ซอสขาว",
        imageUrl: "/img/assets/ingredient/sauce/saucewhite.png",
        key: "saucewhite",
        amount: 10,
        color: null,
        type: "SAUCE",
      },
      {
        name: "ซอสบัฟฟาโล",
        imageUrl: "/img/assets/ingredient/sauce/saucebuffalo.png",
        key: "saucebuffalo",
        amount: 10,
        color: null,
        type: "SAUCE",
      },
      {
        name: "ซอสบาบีคิว",
        imageUrl: "/img/assets/ingredient/sauce/saucebbq.png",
        key: "saurcebbq",
        amount: 10,
        color: null,
        type: "SAUCE",
      },
      {
        name: "ออริกาโน่",
        imageUrl: "/img/assets/ingredient/spice/oregano.png",
        key: "oregano",
        amount: 10,
        color: null,
        type: "SPICE",
      },
      {
        name: "พริกไทยดำ",
        imageUrl: "/img/assets/ingredient/spice/blackpepper.png",
        key: "blackpepper",
        amount: 10,
        color: null,
        type: "SPICE",
      },
      {
        name: "เกลือ",
        imageUrl: "/img/assets/ingredient/spice/salt.png",
        key: "salt",
        amount: 10,
        color: null,
        type: "SPICE",
      },
    ];
    const isIngredient = await prisma.ingredient.findMany();
    if (isIngredient.length <= 0) {
      await prisma.ingredient.createMany({
        data: ingredient,
      });
    }
    const isPizza = await prisma.pizza.findFirst();
    const isSnack = await prisma.snack.findFirst();
    const isDrink = await prisma.drink.findFirst();
    const isAppetizer = await prisma.appetizer.findFirst();
    const pizza = [
      {
        name: "มาการ์ริต้า",
        description: "เปปเปอโรนี, มอซซาเรลล่า, โหระพา",
        price: 199.0,
        ingredients: ["pepperoni", "mozzarella", "basil"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza1.png",
        public: true,
      },
      {
        name: "มีทเลิฟเวอร์",
        description: "หมูรวมควัน, มะกอก, แฮม, เบคอน",
        price: 249.0,
        ingredients: ["pulledpork", "olive", "ham", "bacon"],
        type: "NORMAL",
        size: "LARGE",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza2.png",
        public: true,
      },
      {
        name: "เปปเปอโรนีดีลักซ์",
        description: "เปปเปอโรนี, มะกอก, พาร์เมซาน",
        price: 229.0,
        ingredients: ["pepperoni", "olive", "parmesan"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza3.png",
        public: true,
      },
      {
        name: "นาโปลี",
        description: "แฮม, มอซเซอเรลล่า, โหระพา",
        price: 239.0,
        ingredients: ["ham", "mozzarella", "basil"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza4.png",
        public: true,
      },
      {
        name: "มัชรูมดีลักซ์",
        description: "เห็ด, มอซเซอเรลล่า, โหระพา",
        price: 219.0,
        ingredients: ["mushroom", "mozzarella", "basil"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza5.png",
        public: true,
      },
      {
        name: "เปปเปอโรนีดับเบิลชีส",
        description: "เปปเปอโรนี, เชดดาร์, มอซซาเรลล่า",
        price: 259.0,
        ingredients: ["pepperoni", "cheddar", "mozzarella"],
        type: "NORMAL",
        size: "LARGE",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza6.png",
        public: true,
      },
      {
        name: "โอลีฟดีลักซ์",
        description: "มะกอก, มอซเซอเรลล่า, เห็ด",
        price: 199.0,
        ingredients: ["olive", "mozzarella", "mushroom"],
        type: "NORMAL",
        size: "SMALL",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza7.png",
        public: true,
      },
      {
        name: "สตาจิโอนี",
        description: "มะกอก, พาร์เมซาน, ฮาลาพีโย่",
        price: 229.0,
        ingredients: ["olive", "parmesan", "jalapeno"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza8.png",
        public: true,
      },
      {
        name: "ดับเบิลชีส",
        description: "พาร์เมซาน, มอซเซอเรลล่า",
        price: 219.0,
        ingredients: ["parmesan", "mozzarella"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza9.png",
        public: true,
      },
      {
        name: "ซีฟู้ดดีลักซ์",
        description: "กุ้ง, มะเขือเทศ, ปวยเล้ง",
        price: 269.0,
        ingredients: ["shrimp", "tomato", "spinach"],
        type: "NORMAL",
        size: "LARGE",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza10.png",
        public: true,
      },
      {
        name: "มัชรูมสลามิ",
        description: "มอซเซอเรลล่า, เห็ด, พริกหยวก",
        price: 249.0,
        ingredients: ["mozzarella", "mushroom", "bellpaper"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza11.png",
        public: true,
      },
      {
        name: "ไวท์ชีสมีท",
        description: "แฮม, เฟต้า, พริกหยวก",
        price: 239.0,
        ingredients: ["ham", "feta", "bellpaper"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza12.png",
        public: true,
      },
      {
        name: "ลาซานญ่า",
        description: "หอมแดง, สัปปะรด, มอซเซอเรลล่า, แฮม",
        price: 259.0,
        ingredients: ["onion", "pineapple", "mozzarella", "ham"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza13.png",
        public: true,
      },
      {
        name: "มีทแอนด์ชีส",
        description: "เบคอน, มอซเซอเรลล่า",
        price: 249.0,
        ingredients: ["bacon", "mozzarella"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza14.png",
        public: true,
      },
      {
        name: "โทมาโท่ฟิวชั่น",
        description: "มะเขือเทศ, โหระพา, เชดดาร์",
        price: 219.0,
        ingredients: ["tomato", "basil", "cheddar"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza15.png",
        public: true,
      },
      {
        name: "เฟตูชินีพิซซ่า",
        description: "มะเขือเทศ, มอซเซอเรลล่า",
        price: 239.0,
        ingredients: ["tomato", "mozzarella"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza16.png",
        public: true,
      },
      {
        name: "โอลีฟดับเบิลชีส",
        description: "มะกอก, มอซเซอเรลล่า, พาร์เมซาน",
        price: 229.0,
        ingredients: ["olive", "mozzarella", "parmesan"],
        type: "NORMAL",
        size: "MEDIUM",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza17.png",
        public: true,
      },
      {
        name: "เอ็กซ์ตร้าเปปเปอโรนิ",
        description: "เปปเปอโรนิ*2",
        price: 259.0,
        ingredients: ["pepperoni"],
        type: "NORMAL",
        size: "LARGE",
        pizzaDough: "THICK",
        imageUrl: "/img/assets/pizza/pizza18.png",
        public: true,
      },
      {
        name: "โอลีฟฟิวชั่น",
        description: "มะกอก, มอซเซอเรลล่า",
        price: 199.0,
        ingredients: ["olive", "mozzarella"],
        type: "NORMAL",
        size: "SMALL",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza19.png",
        public: true,
      },
      {
        name: "เบลเพพเพอร์ลันช์",
        description: "พริกหยวก, เฟต้า",
        price: 199.0,
        ingredients: ["bellpaper", "feta"],
        type: "NORMAL",
        size: "SMALL",
        pizzaDough: "THIN",
        imageUrl: "/img/assets/pizza/pizza20.png",
        public: true,
      },
    ];

    const snack = [
      {
        name: "บัพฟาโลวิงซ์",
        description: "พร้อมซอสสไปซี่",
        price: 99,
        imageUrl: "/img/assets/snack/snack1.png",
        public: true,
      },
      {
        name: "เฟรนช์ฟรายซ์",
        description: "แสนอร่อย",
        price: 80,
        imageUrl: "/img/assets/snack/snack2.png",
        public: true,
      },
      {
        name: "นักเก็ตส์",
        description: "กรอบๆสู้ฟัน",
        price: 80,
        imageUrl: "/img/assets/snack/snack3.png",
        public: true,
      },
      {
        name: "มอซเซอเรลล่าสติกซ์",
        description: "พร้อมซอสเปรี้ยว",
        price: 99,
        imageUrl: "/img/assets/snack/snack4.png",
        public: true,
      },
    ];

    const drink = [
      {
        name: "น้ำเปล่า",
        description: "สดชื่น",
        price: 10,
        imageUrl: "/img/assets/drink/drink1.png",
        public: true,
      },
      {
        name: "น้ำอัดลม",
        description: "ซาบซ่าถึงใจ",
        price: 20,
        imageUrl: "/img/assets/drink/drink2.png",
        public: true,
      },
      {
        name: "มะนาวโซดา",
        description: "เปรี้ยวซ่าทั้งกาย",
        price: 20,
        imageUrl: "/img/assets/drink/drink3.png",
        public: true,
      },
      {
        name: "เบียร์",
        description: "ข้าวหอมหมัก",
        price: 59,
        imageUrl: "/img/assets/drink/drink4.png",
        public: true,
      },
    ];

    const appetizer = [
      {
        name: "พาสต้าอัลเฟรดโด",
        description: "ราดไวท์อัลเฟรดโดซอส",
        price: 159,
        imageUrl: "/img/assets/appetizer/appetizer1.png",
        public: true,
      },
      {
        name: "สปาเกตตี้มีทบอล",
        description: "มีทบอลเนื้อราดซอสแดง",
        price: 159,
        imageUrl: "/img/assets/appetizer/appetizer2.png",
        public: true,
      },
      {
        name: "ลาซานญ่า",
        description: "ซ้อนแบบเข้มข้น",
        price: 179,
        imageUrl: "/img/assets/appetizer/appetizer3.png",
        public: true,
      },
      {
        name: "ราวิโอลี",
        description: "สอดไส้ซอสแดง",
        price: 159,
        imageUrl: "/img/assets/appetizer/appetizer4.png",
        public: true,
      },
    ];

    const mappedPizza = pizza.map((p) => ({
      ...p,
      ingredients: p.ingredients
        .map((ingredientName) => isIngredient.find((ing) => ing.key === ingredientName)?.id)
        .filter(Boolean),
    }));
    if (!isPizza) {
      for (const p of mappedPizza) {
        const pizza = await prisma.pizza.create({
          data: {
            name: p.name,
            description: p.description,
            imageUrl: p.imageUrl,
            price: p.price,
            type: p.type,
            size: p.size,
            pizzaDough: p.pizzaDough,
            public: true,
          },
        });
        await prisma.pizzaIngredient.createMany({
          data: p.ingredients.map((ingredientId) => ({
            pizzaId: pizza.id,
            ingredientId,
          })),
        });
      }
    }
    if (!isSnack) {
      await prisma.snack.createMany({
        data: snack,
      });
    }
    if (!isDrink) {
      await prisma.drink.createMany({
        data: drink,
      });
    }
    if (!isAppetizer) {
      await prisma.appetizer.createMany({
        data: appetizer,
      });
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

app.listen(PORT, () => {
  prisma.$connect().then(() => {
    console.log("Connected to the database");
  });
  seedDatabase();
  console.log(`Server running on port ${PORT}`);
});

app.on("close", () => {
  console.log("Disconnected the server");
  prisma.$disconnect();
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
});
