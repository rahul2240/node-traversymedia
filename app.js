const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
mongoose.connect('mongodb://localhost/restapi');

let db = mongoose.connection;

db.on('error', function(err){
  console.log(err);
});

db.once('open', function(){
  console.log('started');
});


let Article = require('./models/article.js');
// Initialized app
const app = express();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extender: false }))

app.use(bodyParser.json())

// Use validator
app.use(expressValidator());

// set public folder
app.use(express.static(path.join(__dirname,'public')));

//Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Routes

app.get('/', function(req, res){

  Article.find({}, function(err,articles) {

      if(err)
      {
        console.log(err);
      }
      else
      {
          res.render('index', {
          title: 'Sample App',
          articles: articles
                              }
          );
      }
  });
});

app.get('/articles/add', function(req, res){
  res.render('add_article',{
    title: 'New Article'
  });
});

app.post('/articles/add', function(req, res){

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

app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      title: article.title,
      article: article
    });
    return;
  });
});

// Edit article
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title: 'Edit:' + article.title,
      article: article
    });
    return;
  });
});

app.post('/article/edit/:id', function(req, res){
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
app.delete('/article/:id', function (req, res) {
  let query = {_id:req.params.id}
    Article.remove(query, function(err) {
        if (err) return res.status(500).send("There was a problem deleting the article.");
        res.status(200).send("Article was deleted.");
    });
});

// Start a node server
app.listen(3000, function(){
  console.log('Server started on port 3000');
});
