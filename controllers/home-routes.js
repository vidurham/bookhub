const router = require("express").Router();
const { User } = require("../models/");

// homepage
router.get("/", (req, res) => {
  res.render("home");
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
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

module.exports = router;
