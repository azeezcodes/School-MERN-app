const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/student.model");

const router = new express.Router();

router.post("/students", async (req, res) => {
    const student = new Student(req.body);

    try {
        await student.save();
        res.send({data: student, success: true});
    } catch(error) {
        console.log(error)
        if(error.code === 11000)
            res.send({success: false, reason: "Email already exists"});
        res.status(400).send({success: false, error});
    }
})

router.post("/students/login", async (req, res) => {
    try {
        const student = await Student.findOne({email : req.body.email})
        const isMatch = await bcrypt.compare(req.body.password, student.password)
        const token = jwt.sign({_id:student._id}, 'thisismykey');
        if(isMatch)
            res.send({success: true, data: student, token})
        // if(student.password === req.body.password)
        //     res.send({student});
    } catch(error) {
        console.log(error);
        res.status(400).send({success: false, error});
    }
})

router.get("/students", async (req, res) => {

    try {
        const students = await Student.find({});
        res.send({success: true, data: students});
    } catch (error) {
        res.status(400).send({success: false, error});
    }
})

router.get("/student/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const student = await Student.findById(_id);

        if(!student)
            return res.status(404).send("Student not found");

        res.send({success: true, data: student});
    } catch (error) {
        res.status(500).send({success: false, error});
    }
})

router.post("/update/student", async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate({email: req.body.email}, {
            fName: req.body.fName,
            lName: req.body.lName
        }, {new: true, runValidators: true});
        res.send({data: student, success: true});
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

module.exports = router