const router = require("express").Router();
const { OrderStatus } = require("@prisma/client");
const prisma = require("../../config/db");

router.get("/history", async (req, res) => {
  const statusType = {
    success: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED],
    pending: [OrderStatus.PENDING],
  };

  const status = statusType[req.query.filter] || null;
  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: {
      ...(status && { status: { in: status } }),
      userId,
    },
    include: {
      items: {
        include: {
          pizza: { include: { ingredients: { include: { ingredient: true } } } },
          appetizer: true,
          snack: true,
          drink: true,
        },
      },
    },
  });
  res.render("history/history", {
    user: req.user,
    queryString: req.query.filter,
    orders,
  });
});

module.exports = router;
