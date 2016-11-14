const express = require('express'),
      morgan = require('morgan'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      Sequelize = require('sequelize');

var app = express();
    sequelize = new Sequelize('bulletinboard', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });


app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.redirect('blogposts/index');
});

app.get('/new', (request, response) => {
  response.render('blogposts/new');
});

app.get('/blogposts', (request, response) => {
  response.render('/index');
});

app.post('/blogposts', (request, response) => {
  console.log('blog posted');
  if (request.params.id) {
    Blogpost.create(request.params.id).then(() => {
      response.redirect('/');
    });
  } else {
    response.redirect('/new');
  }
});

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
  });
});
