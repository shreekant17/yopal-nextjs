const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,

  },
  country: {
    type: String,
    required: true,
  },
  terms: {
    type: Boolean,
    required: true,
  },
})

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
