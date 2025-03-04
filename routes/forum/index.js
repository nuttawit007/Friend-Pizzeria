const router = require("express").Router();
const { PizzaType } = require("@prisma/client");
const prisma = require("../../config/db");

router.get("/forum", async (req, res) => {
  const pizzaItems = await prisma.pizza.findMany({
    where: {
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
  res.render("forum/forum", { user: req.user, pizzaItems });
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
  res.render("forum/forum_detail", { user: req.user, pizza: pizzaItems });
});

module.exports = router;
