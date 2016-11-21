var express = require('express'),
    db = require('../models'),
    router = express.Router();

var requireUser = (req, res, next) => {
  if (req.path === '/admin') {
    return next();
  }
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.use(requireUser);

router.get('/', (req, res) => {
  res.redirect('/blog-posts');
});

router.get('/blog-posts', (req, res) => {
  db.BlogPost.findAll({ order: [['createdAt', 'DESC']] }).then((blogPosts) => {
    res.render('blog-posts/index', { blogPosts: blogPosts, user: req.session.user });
  }).catch((error) => {
    throw error;
  });
});

router.get('/blog-posts/new', (req, res) => {
  res.render('blog-posts/new', { user: req.session.user });
});

router.get('/blog-posts/:id/edit', (req, res) => {
  db.BlogPost.findOne({
    where: {
      id: req.params.id
    }
  }).then((blogPost) => {
    res.render('blog-posts/edit', { blogPost: blogPost, user: req.session.user });
  });
});

router.post('/blog-posts', (req, res) => {
  db.BlogPost.create(req.body).then((blogPost) => {
    res.redirect('/' + blogPost.slug);
  });
});

router.put('/blog-posts/:id', (req, res) => {
  db.BlogPost.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/blog-posts');
  });
});

router.delete('/blog-posts/:id', (req, res) => {
  db.BlogPost.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/blog-posts');
  });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

module.exports = router;
