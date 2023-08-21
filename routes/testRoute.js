const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.json({ env: process.env.DATABASE_URL, status: process.env.TEST });
});

module.exports = router;
