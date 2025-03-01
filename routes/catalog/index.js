const router = require("express").Router();

router.get("/", (req, res) => {
  const payload = {
    query: req.query,
  };

  res.render("catalogs/catalogs", { user: req.user, ...payload });
});

module.exports = router;
