const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  secret: String,
  gender: String,
  date: Date,
  city: String,
  liked: [String],
  likedBy: [String],
  disliked: [String],
  photos: [String],
});

module.exports = mongoose.model('User', User);
