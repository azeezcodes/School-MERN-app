const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  year: { type: String, required: true },
  department: {type: String, required: true},
  teacher_id: {type: String, required: true},
  course_code: {type: String, required: true, unique: true}
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;