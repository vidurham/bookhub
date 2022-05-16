const router = require("express").Router();
const profileQuest = require('../data/profile-quest.json')
const sequelize = require('../config/config');
const { User, Comment, Vote, Post, Bookclub } = require("../models/");
const withAuth = require("../utils/auth");
const fetch = require("node-fetch");


// homepage
router.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/user-feed');
    return;
  }
  res.render('signup');
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/user-feed');
    return;
  }

  res.render('login');
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

router.get('/search-page', (req, res) => {
  fetch(`http://openlibrary.org/search.json?title=the+hunger+games`, {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    },
  })
  .then(res => res.json())
  .then(data => {
    var bookArr = [];
      for (var i = 0; i < 20; i++) {
        var bookCover = data.docs[i].cover_i;
        var bookTitle = data.docs[i].title;
        var bookAuthor = data.docs[i].author_name[0];
        var bookKey = data.docs[i].key;
        var book = {
          cover: bookCover,
          title: bookTitle,
          author: bookAuthor,
          key: bookKey
        }
        bookArr.push(book);
      }
      res.render('search-page', {
        book: bookArr
      });
  });
});

module.exports = router;
