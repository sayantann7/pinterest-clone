var express = require("express");
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
var router = express.Router();
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("signup");
});

router.get("/login",function(req,res){
  res.render("login",{error:req.flash('error')});
});

router.get("/profile", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render("profile",{user});
});

router.get("/feed",isLoggedIn,async function(req,res){
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render('feed',{user});
});

router.post("/upload",upload.single("file"),function(req,res){
  if (!req.file){
    return res.status(400).send("No file uploaded");
  }else{
    console.log("File uploaded succesfully");
    res.redirect("/feed");
  }
});

router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
  .then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/feed");
    })
  })
});

router.post("/login", passport.authenticate("local",{
  successRedirect: "/feed",
  failureRedirect: "/login",
  failureFlash: true
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
