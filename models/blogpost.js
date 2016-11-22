var slug = require('slug');

module.exports = function(sequelize, DataTypes) {
  var BlogPost = sequelize.define('BlogPost', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
  hooks: {
    beforeCreate: function(blogPost, options) {
      if (!blogPost.slug) {
        blogPost.slug = slug(blogPost.title, { lower: true });
      }
    }
  },
  classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.Comment);
      }
    }
  });
  return BlogPost;
};
