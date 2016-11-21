const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      session = require('express-session'),
      bcrypt = require('bcrypt'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('blog', 'ela', '', { dialect: 'postgres' });

var db = require('./models');

var adminRouter = require('./routes/admin');

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(session({
  name: 'cookie',
  secret: 'our secret key',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.use('/admin', adminRouter);

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

app.post('/login', (request, response) => {
  console.log(request.body.email);
  var userInDB = db.User.findOne({
    where: {
      email: request.body.email
    }
  }).then((userInDB) => {
    console.log(userInDB);
    if (userInDB.password === request.body.password) {
      request.session.user = userInDB;
      response.redirect('/admin/blog-posts');
    } else {
      response.redirect('/login');
    }
  }).catch(() => {
    response.redirect('/login');
  });
});

app.post('/users', (request, response) => {
  db.User.create(request.body).then((user) => {
    response.redirect('/admin/blog-posts');
  }).catch(() => {
    response.redirect('/register');
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
  db.BlogPost.findById(req.params.id).then((blogPost) => {
    var comment = req.body;
    comment.BlogPostId = blogPost.id;

    db.Comment.create(comment).then(() => {
        res.redirect('/' + blogPost.slug);
      });
    });
});

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
