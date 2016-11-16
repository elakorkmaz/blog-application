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

console.log(db.Comment);

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

app.post('/comments', (req, res) => {
  console.log(req.body);

  db.Comment.create(req.body).then((comment) => {
    console.log('comment created');
    comment.getBlogPost().then((blogPost) => {
      res.redirect('/' + blogPost.slug);
    });
  });
});

app.get('/', (req, res) => {
  db.BlogPost.findAll({ order: [['createdAt', 'DESC']] }).then((blogPosts) => {
    res.render('index', { blogPosts: blogPosts });
  });
});

app.get('/:slug', (req, res) => {
  db.BlogPost.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((blogPost) => {
    return blogPost.getComments().then((comments) => {
    res.render('blog-posts/show', { blogPost: blogPost, comments: comments });
    });
  }).catch((error) => {
    res.status(404).end();
  });
});

app.get('/admin/blog-posts', (req, res) => {
  db.BlogPost.findAll().then((blogPosts) => {
    res.render('blog-posts/index', { blogPosts: blogPosts });
  }).catch((error) => {
    throw error;
  });
});

app.get('/admin/blog-posts/new', (req, res) => {
  res.render('blog-posts/new');
});

app.get('/admin/blog-posts/:id/edit', (req, res) => {
  db.BlogPost.findOne({
    where: {
      id: req.params.id
    }
  }).then((blogPost) => {
    res.render('blog-posts/edit', { blogPost: blogPost });
  });
});

app.post('/blog-posts', (req, res) => {
  console.log(req.body);
    db.BlogPost.create(req.body).then((blogPost) => {
      res.redirect('/' + blogPost.slug);
    }).catch((error) => {
      throw error;
    });
});

app.put('/blog-posts/:id', (req, res) => {
  db.BlogPost.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/' + blogPost.slug);
  });
});

app.delete('/blog-posts/:id', (req, res) => {
  db.BlogPost.destroy({
    where: {
      id: req.params.id
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
