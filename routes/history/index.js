const router = require("express").Router();
const prisma = require("../../config/db");

router.get("/history", async (req, res) => {
  const userId = 1;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          pizza: { include: { ingredients: { include: { ingredient: true } } } },
        },
      },
    },
  });

  res.render("history/history", { user: req.user, orders });
});

module.exports = router;
