const express = require("express");
const router = express.Router();

// Login Page
router.get("/login", (req, res) => res.render("login")); //views/login.ejs

// Register Page
router.get("/register", (req, res) => res.render("register")); //views/register.ejs

// Register Heandle
router.post("/register", (req, res) => {
  // console.log(req.body);

  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }
  // Check password match
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  //   Check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    res.send("pass");
  }
});

module.exports = router;
