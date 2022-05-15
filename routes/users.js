const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passpord = require("passport");

// User model
const User = require("../models/User");

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
    console.log(errors);
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // mongoose Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // User exists
        errors.push({ msg: "Email is aleready registered" });
        console.log(errors);

        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        // create user mongoose
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // Save user in mongoose
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passpord.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "you are logged out");
  res.redirect("/user/login");
});

module.exports = router;
