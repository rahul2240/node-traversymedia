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

// Start a node server
app.listen(3000, function(){
  console.log('Server started on port 3000');
});
