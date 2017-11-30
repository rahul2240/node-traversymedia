const express = require('express');
const router = express.Router();

let Article = require('../models/article.js');


// ADD ARTICLE FORM
router.get('/new', function(req, res){
  res.render('add_article',{
    title: 'New Article'
  });
});

router.post('/new', function(req, res){

  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      errors: errors,
      title: 'New article'
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });
  }


});

// Edit article

router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title: 'Edit:' + article.title,
      article: article
    });
    return;
  });
});

// UPDATE ARTICLE

router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article,function(err){
    if(err){
      console.log(err);
    }
    else{
      req.flash('success','Article updated');
      res.redirect('/');
    }
  });
  return;
});

// Delete article



// SHOW ARTICLE

router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      title: article.title,
      article: article
    });
    return;
  });
});

module.exports = router;
