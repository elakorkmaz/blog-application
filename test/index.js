process.env.NODE_ENV = 'test';

const assert = require('assert'),
      db = require('../models');

describe('MODEL: BLOGPOST', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  it('creates a blog post', (done) => {
    db.BlogPost.create({
      title: 'New blog article',
      slug: 'our test slug',
      content: '<h1>Bla bla bla</h1>'
    }).then((blogPost) => {
      assert.equal(blogPost.isNewRecord, false);
      assert.equal(blogPost.title, 'New blog article');
      assert.equal(blogPost.slug, 'our test slug');
      assert.equal(blogPost.content, '<h1>Bla bla bla</h1>');
      done();
    });
  });

  it('cannot create a post if title is missing', (done) => {
    db.BlogPost.create({
      slug: 'our test slug',
      content: '<h1>Bla bla bla</h1>'
    }).catch((error) => {
      assert.equal(error.errors[0].message, 'title cannot be null');
      assert.equal(error.errors.length, 1);
      done();
    });
  });

  it('cannot create a post if content is missing', (done) => {
    db.BlogPost.create({
      title: 'New blog article',
      slug: 'our test slug'
    }).catch((error) => {
      assert.equal(error.errors[0].message, 'content cannot be null');
      assert.equal(error.errors.length, 1);
      done();
    });
  });

  it('generates a slug during post creation if post has no slug', (done) => {
    db.BlogPost.create({
      title: 'This should get sluggified',
      content: '<h1>Bla bla bla</h1>'
    }).then((blogPost) => {
      assert.equal(blogPost.slug, 'this-should-get-sluggified');
      done();
    });
  });

  it('updates a blog post', (done) => {
    db.BlogPost.update({
      title: 'Updated new title',
      content: '<h5>New Content</h5>',
      slug: 'our-new-slug'
    }, {
      where: {
        title: 'New blog article'
      },
      returning: true
    }).then((updateData) => {
      var blogPost = updateData[1][0];
      assert.equal(blogPost.title, 'Updated new title');
      assert.equal(blogPost.content, '<h5>New Content</h5>');
      assert.equal(blogPost.slug, 'our-new-slug');
      done();
    });
  });

  it('deletes a blog post', (done) => {
    db.BlogPost.destroy({
      where: {
        title: 'This should get sluggified'
      }
    }).then((destroyRecordCount) => {
      assert.equal(destroyRecordCount, 1);
      done();
    });
  });
});
