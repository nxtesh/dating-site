const mongoose = require('mongoose');

const { Schema } = mongoose;

const Message = new Schema({
  sendingUser: String,
  receiver: String,
  text: String,
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', Message);
