import { Schema, model } from 'mongoose';

// Define the schema
const studentSchema = new Schema({
  student_id: {
    type: Number,
    required: true
  },
  scores: [{
    score: Number,
    type: String
  }],
  class_id: {
    type: Number,
    required: true
  }
});

// Create the model
const Student = model('Student', studentSchema);

// Export the model
export default Student;
