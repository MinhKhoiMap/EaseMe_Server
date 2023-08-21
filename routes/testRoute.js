const {Router} = require("express");
const router = Router();

router.get("/", (req,res) => {
  res.json(process.env.DATABASE_URL);
})

module.exports = router;
