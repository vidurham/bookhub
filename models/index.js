// import all models
const Post = require('./Post');
const User = require('./User');
const Comment = require('./Comment');
const Bookclub = require('./Bookclub');
const Like = require('./Like');

// create associations
User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

User.belongsToMany(Post, {
  through: Bookclub,
  as: 'bookclub_posts',
  foreignKey: 'bookclub_id'
})

Post.belongsToMany(User, {
  through: Bookclub,
  as: 'bookclub_posts',
  foreignKey: 'bookclub_id'
})

module.exports = { User, Post, Comment, Bookclub, Like };
