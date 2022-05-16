const router = require('express').Router();
const { DataTypes } = require('sequelize/types');
const { User, Comment, Post, Vote } = require('../../models');

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

//POST /api/users/
router.post('/', (req, res) => {
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
        req.session.last_name = dbUserData.last_name

        res.json({user: dbUserData, message: "You are now logged in"});
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users/profile-quest
router.post('/profile-quest', (req, res) => {
  let checkedArr = req.body.checkedArr
  await User.define('user', {
    book_genres: {
      type: Sequelize.STRING,
      allowNull: true,
      set(checkedArr) {
        this.setDataValue('book_genres', checkedArr.join(';'))
      }
    }
  })
    .then(dbUserData => {
      console.log(dbUserData);
    })
    // .then(dbUserData => {
    //   req.session.save(() => {
    //     req.session.loggedIn = true;
    //     req.session.user_id = dbUserData.id;
    //     req.session.first_name = dbUserData.first_name;
    //     req.session.last_name = dbUserData.last_name

    //     res.json({user: dbUserData, message: "You are now logged in"});
    //   });
    // })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users/login
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
// POST /api/users/logout
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
