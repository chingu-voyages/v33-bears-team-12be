const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const Userchema = new Schema({
  //link: { type: Schema.Types.ObjectId, ref: 'Link', required: false },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  // userId: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model('User', UserSchema);
