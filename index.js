const express = require('express'),
      morgan = require('morgan'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      Sequelize = require('sequelize');

var app = express();
    sequelize = new Sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });


var blogPost = sequelize.define('blogPost', {
  title: Sequelize.STRING,
  slug: Sequelize.STRING,
  body: Sequelize.TEXT
});

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/', (request, response) => {
  blogPost.findAll({ order: 'id ASC' }).then((blogPosts) => {
    response.render('blog-posts/index', { blogPosts: blogPosts });
  });
});

app.get('/new', (request, response) => {
  response.render('blog-posts/new');
});

app.post('/blog-posts', (request, response) => {
  console.log('blog posted');
  if (request.body.title) {
    Blogpost.create(request.body).then(() => {
      response.redirect('/blog-posts');
    });
  } else {
    response.redirect('/blog-posts/new');
  }
});

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
  });
});
