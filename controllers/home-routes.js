const router = require("express").Router();
const sequelize = require('../config/config');
const { User, Comment, Like, Post, Bookclub } = require("../models/");

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
  Post.findAll({
    attributes: [
        'id',
        'title',
        'post_content',
        'created_at',
    ],
    include: [
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['first_name', 'last_name']
            }
        },
        {
            model: User,
            attributes: ['first_name', 'last_name']
        }
    ]
})
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('user-feed', { 
            posts, 
            loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
      });

router.get('/user-profile', (req, res) => {
  res.render('user-profile');
});

module.exports = router;
