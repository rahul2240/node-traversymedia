const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

// set public folder
app.use(express.static(path.join(__dirname,'public')));

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
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/');
    }
  });
  return;
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
      res.redirect('/');
    }
  });
  return;
});




// Start a node server
app.listen(3000, function(){
  console.log('Server started on port 3000');
});
