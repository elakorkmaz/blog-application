var express = require('express'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    base64url = require('base64url'),
    db = require('../models'),
    router = express.Router();

router.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin/blog-posts');
  }
  res.render('users/new');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  console.log(req.body);

  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((userInDB) => {
    bcrypt.compare(req.body.password, userInDB.password, (error, result) => {
      if (result) {
        req.session.user = userInDB;
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    });
  }).catch(() => {
    res.redirect('/login');
  });
});

router.post('/users', (request, response) => {
  db.User.create(request.body).then((user) => {
    response.redirect('/admin/blog-posts');
  }).catch(() => {
    response.redirect('/register');
  });
});

module.exports = router;
