import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    AvailableDevice: [{
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
        },
        deviceName: {
            type: String,
            required: true
        },
        dateOfJoining: {
            type: Date,
            default: Date.now
        },
        active: {
            type: Boolean,
            default: true
        },
        status: {
            type: Boolean,
            default: true
        },
    }],
});

const User = model('User', userSchema);

export default User;
