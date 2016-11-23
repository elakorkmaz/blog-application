const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      session = require('express-session'),
      Sequelize = require('sequelize');

var db = require('./models');

var app = express(),
    sequelize = new Sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

const adminRouter = require('./routes/admin'),
      authenticationRouter = require('./routes/authentication'),
      changePasswordRouter = require('./routes/change-password');

app.set('view engine', 'pug');

// app.use(express.static('public'));

app.use(morgan('dev'));

app.use(session({
  name: 'cookie',
  secret: 'our secret key',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.use('/admin', adminRouter);
app.use('/authentication', authenticationRouter);
app.use('/change-password', changePasswordRouter);

app.post('/blog-posts/:id/comments', (req, res) => {
  db.BlogPost.findById(req.params.id).then((blogPost) => {
    var comment = req.body;
    comment.BlogPostId = blogPost.id;

    db.Comment.create(comment).then(() => {
        res.redirect('/' + blogPost.slug);
      });
    });
});

app.get('/', (req, res) => {
  console.log(req.session);
  db.BlogPost.findAll({ order: [['createdAt', 'DESC']] }).then((blogPosts) => {
    res.render('index', { blogPosts: blogPosts, user: req.session.user });
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

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
