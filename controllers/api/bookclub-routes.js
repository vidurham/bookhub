const router = require('express').Router();
const { Bookclub, User, Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Bookclub.findAll()
      .then(dbBookclubData => res.json(dbBookclubData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/', withAuth, (req, res) => {
    Bookclub.create({
      bookclub_name: req.body.comment_text,
      user_id: req.session.user_id,
    })
      .then(dbBookclubData => res.json(dbBookclubData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
});

router.get('/:id', (req, res) => {
    Bookclub.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'bookclub_name',
        'user_id',
        'created_at'
      ],
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_content', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['first_name']
          }
        },
        {
          model: User,
          attributes: ['first_name']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});
  

module.exports = router