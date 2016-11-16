'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    content: DataTypes.TEXT,
    BlogPostId: {
      type: DataTypes.INTEGER,
      references: {
        model: "BlogPosts",
        key: "id"
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.BlogPost);
      }
    }
  });
  return Comment;
};
