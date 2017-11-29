const express = require('express');
const path = require('path');


// Initialized app
const app = express();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');


// Routes

app.get('/', function(req, res){
  res.render('index');
});

// Start a node server
app.listen(3000, function(){
  console.log('server started on port 3000');
});
