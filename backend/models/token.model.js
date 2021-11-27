const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  user_id: { type: String, required: true},
  user_type: { type: String, required: true },
  expires_in:{ type: Date, default: Date.now(), expires: 3600}
}, {
  timestamps: true,
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;