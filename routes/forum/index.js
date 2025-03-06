const router = require("express").Router();
const { PizzaType } = require("@prisma/client");
const prisma = require("../../config/db");

router.get("/forum", async (req, res) => {
  const query = req.query.filter == "me" ? { authorId: 1 } : {};
  const pizzaItems = await prisma.pizza.findMany({
    where: {
      type: PizzaType.CUSTOM,
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
  res.render("forum/forum", { user: req.user, pizzaItems, query: req.query.filter });
});

router.get("/forum/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.redirect("/forum");
  }
  const pizzaItems = await prisma.pizza.findFirst({
    where: {
      id: Number(id),
      type: PizzaType.CUSTOM,
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
  const counter = await prisma.order.count({
    where: { items: { some: { pizzaId: Number(id) } } },
  });

  console.log(counter);
  res.render("forum/forum_detail", { user: req.user, pizza: { ...pizzaItems, counter } });
});

module.exports = router;
