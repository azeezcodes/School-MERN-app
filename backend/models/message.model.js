const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user_id: { type: String, required: true},
  user_type: { type: String, required: true },
  user_name: { type: String, required: true },
  message_content: {type: String, required: true},
  course_id: {type: String, required: true},
  time_stamp: {type: String, required: true}
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;