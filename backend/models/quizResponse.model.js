const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizResponseSchema = new Schema({
  quiz_id: { type: String, required: true},
  student_id: {type: String, required: true},
  student_name: { type: String },
  no_of_questions: {type: Number},
  questions_attempted: {type: Number},
  total_marks: {type: Number},
  marks_obtained: {type: Number}
});

const QuizResponse = mongoose.model('QuizResponse', quizResponseSchema);

module.exports = QuizResponse;
