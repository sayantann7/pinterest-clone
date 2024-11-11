var express = require("express");
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
var router = express.Router();

passport.authenticate(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/profile", isLoggedIn, function (req, res) {
  res.send("profile");
});

router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
  .then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    })
  })
});

router.post("/login", passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
}), function (req, res) {});

router.get("/logout",function(req,res){
  req.logout(function(err) {
    if (err) {return next(err);}
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
