const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  address: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: {
      values: ['CUSTOMER', 'CAR_OWNER', 'ADMIN'],
      message: 'Role must be CUSTOMER, CAR_OWNER, or ADMIN'
    },
    default: 'CUSTOMER'
  },
  status: {
    type: String,
    enum: {
      values: ['ACTIVE', 'SUSPENDED'],
      message: 'Status must be ACTIVE or SUSPENDED'
    },
    default: 'ACTIVE'
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', UserSchema);
