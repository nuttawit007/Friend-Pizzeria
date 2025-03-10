const router = require("express").Router();
const { ProductType } = require("@prisma/client");
const prisma = require("../../config/db");

router.get("/forum", async (req, res) => {
  const query = req.query.filter == "me" ? { authorId: req.user.id } : { public: true };
  let pizzaItems = await prisma.pizza.findMany({
    where: {
      type: ProductType.CUSTOM,
      ...query,
    },
    include: {
      author: true,
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
  const order = await prisma.orderItem.findMany({
    where: { pizzaId: { in: pizzaItems.map((item) => item.id) } },
  });

  pizzaItems.forEach((item) => {
    item.counter = order.filter((order) => order.pizzaId == item.id).length;
  });
  res.render("forum/forum", {
    user: req.user,
    pizzaItems,
    query: req.query.filter,
  });
});

router.get("/forum/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.redirect("/forum");
  }
  const pizzaItems = await prisma.pizza.findFirst({
    where: {
      id: Number(id),
      type: ProductType.CUSTOM,
    },
    include: {
      author: true,
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
  const isMine = pizzaItems.authorId == req.user.id;
  const counter = await prisma.order.count({
    where: { items: { some: { pizzaId: Number(id) } } },
  });

  res.render("forum/forum_detail", { user: req.user, pizza: { ...pizzaItems, counter, isMine } });
});

module.exports = router;
