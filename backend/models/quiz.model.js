const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  course_id: { type: String, required: true},
  teacher_id: { type: String, required: true },
  quiz_title: { type: String },
  is_active: {type: Boolean},
  total_marks: {type: Number},
  no_of_questions: {type: Number}
},
{
  timestamps: true
}
);

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;