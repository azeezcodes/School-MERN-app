const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  course_id: { type: String, required: true},
  title: { type: String, required: true },
  description: { type: String, required: true},
  due_date: {type: String},
  max_marks: {type: Number},
  is_assignment: {type: Boolean, required: true},
  file: {type: Buffer}
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;