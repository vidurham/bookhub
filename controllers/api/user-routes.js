const router = require('express').Router();
const { User, Comment, Post, Vote } = require('../../models');
const { writeToJSON, validateAccount} = require('../../lib/account-data');
const accountData = require('../../data/account-data');

// get all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_content', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//POST /api/user/
router.post('/', (req, res) => {
  // write to file json account data
  if (!validateAccount(req.body)) {
    res.status(400).send("The account info is missing or not formatted correctly.");
  } else {
    writeToJSON(req.body);
    res.json({message: "Account info submitted"});
  }
});

// PUT /api/users/profile-quest
router.post('/profile-quest', (req, res) => { 
  // account data from sign up page
  const { first_name, last_name, email, password } = accountData.accountData;
  // create code
  User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.user_id = dbUserData.id;
        req.session.first_name = dbUserData.first_name;
<<<<<<< HEAD
        req.session.last_name = dbUserData.last_name;
        req.session.book_genres = req.body.checkedArr;
=======
        req.session.last_name = dbUserData.last_name
>>>>>>> a7e29a48d754ab67ef0fcd4a9afdfd946f946a4f

        res.json({user: dbUserData, message: "You are now logged in"});
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/user/login
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.first_name = dbUserData.first_name;
      req.session.last_name = dbUserData.last_name;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

// log out route
// POST /api/user/logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res
        .status(204)
        .json({ message: 'You are now logged out!' })
        .end();
    });
  } else {
    res.status(400).end();
  }
});

module.exports = router;
