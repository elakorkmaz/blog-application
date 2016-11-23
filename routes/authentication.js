var express = require('express'),
    bcrypt = require('bcrypt'),
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
        res.redirect('/authentication/login');
      }
    });
  }).catch((error) => {
    console.log('error occured');
    console.log(error);
    res.redirect('/authentication/login');
  });
});

router.post('/register', (req, res) => {
  db.User.create(req.body).then((user) => {
    req.session.user = user;
    res.redirect('/');
  }).catch((error) => {
    console.log('error occured');
    console.log(error);
    res.render('users/new', { errors: error.errors });
  });
});

module.exports = router;
