const router = require("express").Router();
const { OrderStatus } = require("@prisma/client");
const prisma = require("../../config/db");

router.get("/history", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const statusType = {
      success: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED],
      pending: [OrderStatus.PENDING],
    };

    const status = statusType[req.query.filter] || [];
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        userId,
        ...(status.length > 0 && { status: { in: status } }),
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
      queryString: req.query.filter || "",
      orders,
    });
  } catch (error) {
    console.error("Database Query Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
