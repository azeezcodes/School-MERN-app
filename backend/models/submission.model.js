const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  assignment_id: { type: String, required: true},
  student_id: { type: String, required: true },
  marks_obtained: { type: Number },
  file: {type: Buffer}
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;