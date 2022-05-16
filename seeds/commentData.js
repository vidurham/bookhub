const {Comment} = require('../models');

const commentdata = [
    {
        comment_text: "Awesome",
        user_id: 1,
        post_id: 1
    },
    {
        comment_text: "Cool beans",
        user_id: 2,
        post_id: 1
    },
    {
        comment_text: "So cool",
        user_id: 1,
        post_id: 2
    }
];

const seedComment = () => Comment.bulkCreate(commentdata);

module.exports = seedComment;