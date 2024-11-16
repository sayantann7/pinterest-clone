var express = require("express");
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
var router = express.Router();
const upload = require("./multer");
const postModel = require("./posts");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("signup");
});

router.get("/login",function(req,res){
  res.render("login",{error:req.flash('error')});
});

router.get("/profile-created", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({
    username: req.session.passport.user
  });
  await user.populate("posts");
  res.render("profile-created",{user});
});

router.get("/profile-saved", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({
    username: req.session.passport.user
  });
  await user.populate("savedPosts");
  res.render("profile-saved",{user});
});

router.get("/feed", isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const posts = await postModel.find({}).populate('user').sort({ createdAt: -1 });
  await user.populate("posts");
  res.render('feed', { user: user, posts: posts, timeAgo: timeAgo });
});

router.post("/upload",isLoggedIn,upload.single("file"),async function(req,res){
  if (!req.file){
    return res.status(400).send("No file uploaded");
  }
  const user = await userModel.findOne({username:req.session.passport.user});
  const post = await postModel.create({
    imageText:req.body.filecaption,
    image:req.file.filename,
    user:user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.get("/post-page/:postID",isLoggedIn,async function(req,res){
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const post = await postModel.findById(req.params.postID);
  await user.populate("posts");
  await post.populate("user");
  res.render("postPage",{user:user,post:post,timeAgo:timeAgo});
});

router.get("/userProfile/:username",isLoggedIn,async function(req,res){
  const user = await userModel.findOne({username:req.params.username});
  await user.populate("posts");
  res.render("userProfile",{user});
});

router.get("/likePost/:postID",isLoggedIn,async function(req,res){
  const post = await postModel.findById(req.params.postID);
  const user = await userModel.findOne({username:req.session.passport.user});
  if (post.likes.includes(user._id)){
    post.likes.pull(user._id);
  }else{
    post.likes.push(user._id);
  }
  await post.save();
  res.redirect("/post-page/"+req.params.postID);
});

router.get("/savePost/:postID",isLoggedIn,async function(req,res){
  const post = await postModel.findById(req.params.postID);
  const user = await userModel.findOne({username:req.session.passport.user});
  if (user.savedPosts.includes(post._id)){
    user.savedPosts.pull(post._id);
  }else{
    user.savedPosts.push(post._id);
  }
  await user.save();
  res.redirect("/post-page/"+req.params.postID);
});

router.post("/upload-profile-pic",isLoggedIn,upload.single("profilePic"),async function(req,res){
  if (!req.file){
    return res.status(400).send("No file uploaded");
  }
  const user = await userModel.findOne({username:req.session.passport.user});
  user.dp = req.file.filename;
  await user.save();
  res.redirect("/profile");
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


function timeAgo(postedTime) {
  const now = new Date();
  const postedDate = new Date(postedTime);

  // Calculate the difference in milliseconds
  const diffMs = now - postedDate;

  // Define time conversions
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Determine the most appropriate unit of time
  if (seconds < 60) {
    return `Posted ${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
  } else if (minutes < 60) {
    return `Posted ${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `Posted ${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 30) {
    return `Posted ${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (months < 12) {
    return `Posted ${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    return `Posted ${years} year${years !== 1 ? 's' : ''} ago`;
  }
}


module.exports = router;
