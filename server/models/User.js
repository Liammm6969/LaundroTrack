const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  middleName: String,
  userName: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);