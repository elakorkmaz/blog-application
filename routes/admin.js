var express = require('express'),
    db = require('../models'),
    router = express.Router();

router.get('/blog-posts', (req, res) => {
  db.BlogPost.findAll({ order: [['createdAt', 'DESC']] }).then((blogPosts) => {
    res.render('blog-posts/index', { blogPosts: blogPosts });
  }).catch((error) => {
    throw error;
  });
});

router.get('/blog-posts/new', (req, res) => {
  res.render('blog-posts/new');
});

router.get('/blog-posts/:id/edit', (req, res) => {
  db.BlogPost.findOne({
    where: {
      id: req.params.id
    }
  }).then((blogPost) => {
    res.render('blog-posts/edit', { blogPost: blogPost });
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


module.exports = router;
