const router = require("express").Router();
const prisma = require("../../config/db");

router.get("/", async (req, res) => {
  const transaction = await prisma.order.count({ where: { status: "DELIVERED" } });
  const member = await prisma.user.count();

  res.render("dashboard/dashboard", {
    transaction,
    member,
    user: req.user,
  });
});

router.get("/transaction", async (req, res) => {
  const transaction = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          drink: true,
          appetizer: true,
          snack: true,
          pizza: true,
        },
      },
    },
  });

  res.render("dashboard/history/transaction", {
    user: req.user,
    transaction: transaction.map((order) => {
      return {
        ...order,
        review: order.review ? JSON.parse(order.review) : null,
      };
    }),
    filter: req.query.filter || "",
  });
});

router.get("/transaction/:id", async (req, res) => {
  const transaction = await prisma.order.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      user: true,
      items: {
        include: {
          drink: true,
          appetizer: true,
          snack: true,
          pizza: {
            include: {
              ingredients: {
                include: {
                  ingredient: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const formattedItems = transaction.items.map((item) => {
    let itemName = "";
    let itemType = "";
    let itemPrice = 0;
    let properties = {};
    let ingredients = null;

    if (item.pizza) {
      itemName = item.pizza.name;
      itemType = item.pizza.type;
      itemPrice = item.pizza.price;
      ingredients = item.pizza.ingredients;
      Object.assign(properties, {
        size: item.pizza.size,
        dought: item.pizza.pizzaDough,
        paymentType: transaction.paymentType,
      });
    } else if (item.drink) {
      itemName = item.drink.name;
      itemType = "Drink";
      itemPrice = item.drink.price;
      Object.assign(properties, {
        paymentType: transaction.paymentType,
      });
    } else if (item.appetizer) {
      itemName = item.appetizer.name;
      itemType = "Appetizer";
      itemPrice = item.appetizer.price;
      Object.assign(properties, {
        paymentType: transaction.paymentType,
      });
    } else if (item.snack) {
      itemName = item.snack.name;
      itemType = "Snack";
      itemPrice = item.snack.price;
      Object.assign(properties, {
        paymentType: transaction.paymentType,
      });
    }

    return {
      id: item.id,
      type: itemType,
      name: itemName,
      quantity: item.quantity,
      price: itemPrice,
      ingredients,
      ...properties,
      totalPrice: item.quantity * itemPrice,
    };
  });

  res.render("dashboard/history/transaction_detail", {
    user: req.user,
    info: {
      ...transaction,
      review: transaction.review ? JSON.parse(transaction.review) : [],
    },
    transaction: formattedItems,
    total: transaction.totalPrice,
    filter: req.query.filter || "",
  });
});

router.get("/member", async (req, res) => {
  const member = await prisma.user.findMany({
    include: {
      orders: true,
    },
  });
  res.render("dashboard/config/member", {
    user: req.user,
    member,
    filter: req.query.filter || "",
  });
});

router.get("/menu", async (req, res) => {
  const menu = await prisma.pizza.findMany({
    include: {
      author: true,
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
  const appetizer = await prisma.appetizer.findMany();
  const snack = await prisma.snack.findMany();
  const drink = await prisma.drink.findMany();
  const filter = {
    pizza: ["NORMAL", "CUSTOM"],
    appetizer: ["APPETIZER"],
    snack: ["SNACK"],
    drink: ["DRINK"],
  };

  const filteredMenu = [
    ...menu,
    ...appetizer.map((e) => {
      e.author = null;
      return e;
    }),
    ...snack.map((e) => {
      e.author = null;
      return e;
    }),
    ...drink.map((e) => {
      e.author = null;
      return e;
    }),
  ].filter((e) => {
    if (req.query.filter && filter[req.query.filter]) {
      return filter[req.query.filter].includes(e.type);
    } else {
      return true;
    }
  });

  res.render("dashboard/config/menu", {
    user: req.user,
    menu: filteredMenu,
    filter: req.query.filter || "",
  });
});

router.get("/ingredient", async (req, res) => {
  const ingredients = await prisma.ingredient.findMany();
  res.render("dashboard/config/ingredient", {
    user: req.user,
    ingredients,
  });
});

module.exports = router;
