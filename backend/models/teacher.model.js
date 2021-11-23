const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  fName: { type: String, required: true, trim: true },
  lName: { type: String },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    validate(value)
    {
      if( !validator.isEmail(value)){
        throw new Error("Email is invalid");
      }
    }
  },
  password: { type: String, required: true, minlength: 5}
}, {
  timestamps: true,
});

teacherSchema.pre("save", async function (next) {
  const teacher = this;
  if (teacher.isModified("password")) {
    teacher.password = await bcrypt.hash(teacher.password, 8);
  }
  next();
});

teacherSchema.methods.toJSON = function () {
  const teacher = this
  const teacherObject = teacher.toObject()
  delete teacherObject.password
  return teacherObject;
 }

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;