const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  student_id: { type: String, required: true},
  course_id: { type: String, required: true },
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;