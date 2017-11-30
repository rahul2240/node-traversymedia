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

app.delete('/articles/:id', function (req, res) {
  let query = {_id:req.params.id}
    Article.remove(query, function(err) {
        if (err) return res.status(500).send("There was a problem deleting the article.");
        res.status(200).send("Article was deleted.");
    });
});

// route file
let articles = require('./routes/articles');
app.use('/articles', articles);
// Start a node server
app.listen(3000, function(){
  console.log('Server started on port 3000');
});
