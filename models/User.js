const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  //link: { type: Schema.Types.ObjectId, ref: 'Link', required: false },
  username: {
    type: String,
    required: true,
    min: 6,
    max: 30
  },
  name: { 
    type: String,
    required: true,
    max: 255,
    min: 3
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    max: 255,
    min: 6
  },
  password: {
    type: String,
    select: false,
    required: true,
    max: 1024,
    min: 6
  },
  date: {
    type: Date,
    default: Date.now
  }
  // userId: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model('User', UserSchema);
