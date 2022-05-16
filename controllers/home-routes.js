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
    last_name: req.session.last_name,
    book_genres: req.session.book_genres
});
});

router.get('/profile-quest', (req, res) => {
  res.render('profile-quest', {profileQuest});
});

router.get('/bookclub-page', (req, res) => {
  res.render('bookclub-page', { 
    loggedIn: req.session.loggedIn,
    id: req.session.user_id,
    first_name: req.session.first_name,
    last_name: req.session.last_name
});;
});

router.get('/friends', (req, res) => {
  res.render('sample-friends', { 
    loggedIn: req.session.loggedIn,
    id: req.session.user_id,
    first_name: req.session.first_name,
    last_name: req.session.last_name
});;
});

router.get('/search-page', (req, res) => {
  const searchQuery = req.query.q
  fetch(`http://openlibrary.org/search.json?q=` + searchQuery, {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    },
  })
  .then(res => res.json())
  .then(data => {
    var bookArr = [];
    var bookCover;
    var bookTitle;
    var bookAuthor;
    var bookKey;
    if (data){
      for (var i = 0; i < 20; i++) {
        if(data.docs[i]){
          if (data.docs[i].cover_i){
            bookCover = data.docs[i].cover_i;
          };
          if (data.docs[i].title){
            bookTitle = data.docs[i].title;
          };
          if (data.docs[i].author_name){
            bookAuthor = data.docs[i].author_name;
          };
          if (data.docs[i].key){
            bookKey = data.docs[i].key;
          };
        };
        var book = {
          cover: bookCover,
          title: bookTitle,
          author: bookAuthor,
          key: bookKey
        }
        bookArr.push(book);
      }
    } else {
      bookArr = "No titles found"
    }
    res.render('search-page', {
      book: bookArr,
      loggedIn: req.session.loggedIn,
      id: req.session.user_id,
      first_name: req.session.first_name,
      last_name: req.session.last_name
    });
  });
});

module.exports = router;