const router = require("express").Router();
const profileQuest = require('../data/profile-quest.json')
const sequelize = require('../config/config');
const { User, Comment, Vote, Post, Bookclub } = require("../models/");
const withAuth = require("../utils/auth");

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
    res.redirect('/user-feed');
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
        'created_at'
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
        console.log(posts);
        console.log(req.session.first_name)
        res.render('user-feed', { 
            posts, 
            loggedIn: req.session.loggedIn,
            id: req.session.user_id,
            first_name: req.session.first_name,
            last_name: req.session.last_name
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/user-feed/:id', (req, res) => {
  Post.findOne({
    where: {
        id: req.params.id
    },
    attributes: [
        'id',
        'title',
        'post_content',
        'created_at'
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
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id'});
            return;
        }

        const post = dbPostData.get({ plain: true });
        res.render('single-post', { 
            post,
            loggedIn: req.session.loggedIn,
            id: req.session.user_id,
            first_name: req.session.first_name,
            last_name: req.session.last_name
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/user-profile', (req, res) => {
  res.render('user-profile', { 
    loggedIn: req.session.loggedIn,
    id: req.session.user_id,
    first_name: req.session.first_name,
    last_name: req.session.last_name
});
});

router.get('/profile-quest', (req, res) => {
  res.render('profile-quest', {profileQuest});
});

router.get('/bookclub-page', (req, res) => {
  res.render('bookclub-page');
});

module.exports = router;
