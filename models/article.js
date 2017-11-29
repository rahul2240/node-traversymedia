const mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,  // string in mongo can store a large data(16mb)
    required: true
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
