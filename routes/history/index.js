const router = require("express").Router();

router.get("/history", (req, res) => {
  res.render("history/history", { user: req.user });
});

module.exports = router;
