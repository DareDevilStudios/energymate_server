import mongoose from 'mongoose';
const deviceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  total_units:{
    type: Number
  },
  total_bill: {
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
      default: 'available'
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
      type: Number,
      default: 0
    },
    units: {
      type: Number,
      default: 0
    },
    today_unit: [{
      type: Number
    }],
    monthly_unit: [{
      type: Number
    }],
  }
  ]
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;