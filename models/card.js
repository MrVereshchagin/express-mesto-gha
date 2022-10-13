const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => { isURL(v); },
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    ref: 'user',
    type: mongoose.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', userSchema);