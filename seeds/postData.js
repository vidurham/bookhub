const {Post} = require('../models');

const postdata = [
    {
        title: "Vince is here",
        post_content: "Hello World",
        user_id: 1
    },
    {
        title: "Hunter is here",
        post_content: "Hello World",
        user_id: 2
    }
];

const seedPost = () => Post.bulkCreate(postdata);

module.exports = seedPost;