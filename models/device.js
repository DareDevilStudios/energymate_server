import mongoose from 'mongoose';
const deviceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  total_units:{
    type: Number
  },
  AllDevices: [{
    device_name: {
      type: String,
      required: true,
    },
    volt: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: 'requested'
    },
    isOn: {
      type: Boolean,
      required: true,
      default: false
    },
    register_date: {
      type: Date
    },
    start_date: {
      type: Date
    },
    bill: {
      type: Number
    },
    units: {
      type: Number
    }
  }
  ]
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;