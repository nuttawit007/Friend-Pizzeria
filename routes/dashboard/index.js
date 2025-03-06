const router = require("express").Router();
const prisma = require("../../config/db");

router.get("/", async (req, res) => {
  res.render("dashboard/dashboard", {
    user: req.user,
  });
});

router.get("/funding", async (req, res) => {
  const funding = await prisma.order.findMany({
    where: {
      OR: [
        { user: { name: { contains: req.query.filter } } },
        { user: { email: { contains: req.query.filter } } },
      ],
    },
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

  res.render("dashboard/history/funding", {
    user: req.user,
    funding,
    filter: req.query.filter || "",
  });
});

router.get("/transaction", async (req, res) => {
  const transaction = await prisma.orderItem.findMany({
    include: {
      order: true,
      drink: true,
      appetizer: true,
      snack: true,
      pizza: true,
    },
  });
  const formattedOrders = transaction.map((order) => {
    let itemName = "";
    let itemType = "";

    if (order.pizza) {
      itemName = order.pizza.name;
      itemType = "Pizza";
    } else if (order.drink) {
      itemName = order.drink.name;
      itemType = "Drink";
    } else if (order.appetizer) {
      itemName = order.appetizer.name;
      itemType = "Appetizer";
    } else if (order.snack) {
      itemName = order.snack.name;
      itemType = "Snack";
    }

    return {
      id: order.id,
      type: itemType,
      name: itemName,
      quantity: order.quantity,
      totalPrice: order.order.totalPrice,
      status: order.order.status,
      createdAt: order.order.createdAt,
    };
  });
  console.log(formattedOrders);
  res.render("dashboard/history/transaction", {
    user: req.user,
    transaction: formattedOrders,
    filter: req.query.filter || "",
  });
});

router.get("/member", async (req, res) => {
  const member = await prisma.user.findMany();
  res.render("dashboard/config/member", {
    user: req.user,
    member,
    filter: req.query.filter || "",
  });
});

router.get("/menu", async (req, res) => {
  res.render("dashboard/config/menu", {
    user: req.user,
  });
});

router.get("/ingredient", async (req, res) => {
  res.render("dashboard/config/ingredient", {
    user: req.user,
  });
});

router.get("/forum", async (req, res) => {
  res.render("dashboard/config/forum", {
    user: req.user,
  });
});

module.exports = router;
