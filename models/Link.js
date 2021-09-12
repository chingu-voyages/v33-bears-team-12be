const mongoose = require('mongoose');

const LinkSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hyperlink: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Links');
