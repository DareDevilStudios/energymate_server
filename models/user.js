import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String
  },
  profilePhotoSrc: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
});

const User = model('User', userSchema);

export default User;
