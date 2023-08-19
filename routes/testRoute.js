const {Router} = require("express");
const router = Router();

router.get("/", (req,res) => {
  res.json("successful");
})

module.exports = router;
