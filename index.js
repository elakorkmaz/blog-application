const express = require('express'),
      morgan = require('morgan'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      Sequelize = require('sequelize');

var app = express();
    sequelize = new Sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });


var Blogpost = sequelize.define('blogpost', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT
});

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/', (request, response) => {
  Blogpost.findAll({ order: 'id ASC' }).then((blogposts) => {
    response.render('blogposts/index', { blogposts: blogposts });
  });
});

app.get('/:id', (request, response) => {
  Blogpost.findById(request.params.id).then((blogpost) => {
    response.render('blogposts/show', { blogpost: blogpost });
  });
});

app.get('/new', (request, response) => {
  response.render('blogposts/new');
});

app.get('/blogposts', (request, response) => {
  response.render('/index');
});


sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
  });
});
