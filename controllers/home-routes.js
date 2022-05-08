const router = require("express").Router();
const { User } = require("../models/");

// homepage
router.get("/", (req, res) => {
  res.render("home");
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/user-feed');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

router.get('/user-feed', (req, res) => {
  res.render('user-feed');
});

router.get('/user-profile', (req, res) => {
  res.render('user-profile');
});

module.exports = router;
