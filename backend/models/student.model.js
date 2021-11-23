const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    fName: { type: String, required: true, trim: true },
    lName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: { type: String, required: true, minlength: 5 },
    year: { type: String, required: true },
    department: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

studentSchema.pre("save", async function (next) {
  const student = this;
  if (student.isModified("password")) {
    student.password = await bcrypt.hash(student.password, 8);
  }
  next();
});

studentSchema.methods.toJSON = function () {
  const student = this
  const studentObject = student.toObject()
  delete studentObject.password
  return studentObject;
 }

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
