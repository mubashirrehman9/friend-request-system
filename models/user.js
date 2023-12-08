const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  online: { type: Boolean, default: false },
  friends: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'accepted', 'blocked'], default: 'pending' },

    },
  ]
});

module.exports = mongoose.model('User', userSchema);
