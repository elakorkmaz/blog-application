const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      Sequelize = require('sequelize');

var app = express();
    sequelize = new Sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var db = require('./models');

var blogPost = sequelize.define('blogPost', {
  title: Sequelize.STRING,
  slug: Sequelize.STRING,
  body: Sequelize.TEXT
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
  blogPost.findAll({ order: 'id DESC' }).then((blogPosts) => {
    response.render('blog-posts/index', { blogPosts: blogPosts });
  });
});

app.get('/new', (request, response) => {
  response.render('blog-posts/new');
});

app.get('/admin/blog-posts', (request, response) => {
  response.render('/blog-posts/index');
});

app.get('admin/blog-posts/new', (request, response) => {
  response.render('blog-posts/new');
});

app.get('/show', (request, response) => {
  response.render('blog-posts/show');
});

app.post('/blog-posts', (request, response) => {
  console.log(request.body);
    db.blogPost.create(request.body).then((blogPost) => {
      response.redirect('/' + blogPost.slug);
    }).catch((error) => {
      throw error;
    });
});

app.put('/blog-posts/:id', (request, response) => {
  db.blogPost.update(request.body).then((blogPost) => {
    res.redirect('/' + post.slug);
  });
});

app.delete('/blog-posts/:id', (request, response) => {
  db.BlogPost.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/blog-posts');
  });
});

/* app.get('/:slug', (request, response) => {
  db.BlogPost.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((post) => {
    res.render('blog-posts/show', { blogPost: blogPost });
  }).catch((error) => {
    res.status(404);
  });
}); */

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
  });
});
