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
  requestedDevices: [{
    deviceId: {
      type: String,
      required: true
    },
    volt: {
      type: Number,
      required: true
    },
    numberOfDevices: {
      type: Number,
      required: true
    }
  }],
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
  }
});

const User = model('User', userSchema);

export default User;
