const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('blog', 'ela', '', { dialect: 'postgres' });

var db = require('./models');

var BlogPost = sequelize.define('BlogPost', {
  title: Sequelize.STRING,
  slug: Sequelize.STRING,
  content: Sequelize.TEXT
});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.get('/', (request, response) => {
  db.BlogPost.findAll({ order: [['createdAt', 'DESC']] }).then((blogPosts) => {
    response.render('blog-posts/index', { blogPosts: blogPosts });
  });
});

app.get('/new', (request, response) => {
  response.render('blog-posts/new');
});

app.get('/show', (request, response) => {
  response.render('blog-posts/show');
});

app.get('/blog-posts/admin', (request, response) => {
  db.BlogPost.findAll().then((blogPosts) => {
    response.render('blog-posts/admin', { blogPosts: blogPosts });
  }).catch((error) => {
    throw error;
  });
});

app.post('/blog-posts', (request, response) => {
  console.log(request.body);
    db.BlogPost.create(request.body).then((blogPost) => {
      response.redirect('/' + blogPost.slug);
    }).catch((error) => {
      throw error;
    });
});

app.put('/blog-posts/:id', (request, response) => {
  db.BlogPost.update(request.body, {
    where: {
      id: request.params.id
    }
  }).then(() => {
    res.redirect('/' + post.slug);
  });
});

app.delete('/blog-posts/:id', (request, response) => {
  db.BlogPost.destroy({
    where: {
      id: request.params.id
    }
  }).then(() => {
    res.redirect('/admin/blog-posts');
  });
});

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
