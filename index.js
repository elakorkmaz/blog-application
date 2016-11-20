const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      session = require('express-session'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('blog', 'ela', '', { dialect: 'postgres' });

var db = require('./models');

var adminRouter = require('./routes/admin');

app.use(morgan('dev'));

app.use(session({
  name: 'cookie',
  secret: 'our secret key',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.static('public'));

app.use('/admin', adminRouter);

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.get('/', (req, res) => {
  console.log(req.session);
  db.BlogPost.findAll({ order: [['createdAt', 'DESC']] }).then((blogPosts) => {
    res.render('index', { blogPosts: blogPosts, user: req.session.user });
  });
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin/blog-posts');
  }
  res.render('users/new');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  console.log(req.body);
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((userInDB) => {
    if (userInDB.password === req.body.password) {
      req.session.user = userInDB;
      res.redirect('/admin/blog-posts');
    } else {
      res.redirect('/login');
    }
  }).catch(() => {
    res.redirect('/login');
  });
});

app.post('/users', (req, res) => {
  db.User.create(req.body).then((user) => {
    res.redirect('/');
  }).catch(() => {
    res.redirect('register');
  });
});

app.get('/:slug', (req, res) => {
  db.BlogPost.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((blogPost) => {
    return blogPost.getComments().then((comments) => {
    res.render('blog-posts/show', { blogPost: blogPost, comments: comments, user: req.session.user });
    });
  }).catch((error) => {
    res.status(404).end();
  });
});

app.post('/blog-posts/:id/comments', (req, res) => {
  db.BlogPost.findById(req.params.id).then((post) => {
    var comment = req.body;
    comment.BlogPostId = blogPost.id;

    db.Comment.create(comment).then(() => {
        res.redirect('/' + blogPost.slug);
      });
    });
});

app.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
