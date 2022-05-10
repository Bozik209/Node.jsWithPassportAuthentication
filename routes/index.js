const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.render("welcome")); //views/welcome.ejs

module.exports = router;
