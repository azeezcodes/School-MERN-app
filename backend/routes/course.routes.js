const express = require("express");
const Course = require("../models/course.model");
const Record = require("../models/record.model");
const Student = require("../models/student.model");

const router = new express.Router();

router.post("/course", async (req, res) => {
    const course = new Course(req.body);
    try {
        await course.save();
        res.send({data: course, success: true});
    } catch (error) {
        console.log(error)
        if(error.code === 11000)
            res.send({success: false, reason: "Code already exists"});
        res.status(400).send(error);
    }
})

router.get("/course/:id", async(req, res) => {
    const _id = req.params.id;

    try {
        const course = await Course.findById(_id);
        if(!course)
            return res.status(404).send({success: false, data: "No courses found"});
        
        res.send({success: true, data: course});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

router.get("/fetchCourse/teacher/:id", async(req, res) => {
    const _id = req.params.id;

    try {
        const courses = await Course.find({ teacher_id : _id});
        if(!courses)
            return res.status(404).send({success: false, data: "No courses found"});
        
        res.send({success: true, data: courses});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

router.post("/enrollStudent", async (req, res) => {
    const record = new Record(req.body);
    try {
        await record.save();
        res.send({data: record, success: true});
    } catch (error) {
        console.log(error)
        res.status(400).send({success: false, error});
    }
})

router.get("/fetchCourse/student/:id", async(req, res) => {
    const _id = req.params.id;
    const courses = [];
    try {
        const records = await Record.find({ student_id : _id});
        for (const record of records) {
            const course = await Course.findById(record.course_id);
            courses.push(course);
        }
        res.send({success: true, data: courses});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

router.get("/studentCount/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const count = await Record.where({ course_id: _id}).countDocuments();
        res.send({success: true, data: {count}});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

router.get("/course/students/:id", async (req, res) => {
    const _id = req.params.id;
    const students = [];
    try {
        const records = await Record.find({course_id: _id});
        for (const record of records) {
            const student = await Student.findById(record.student_id);
            students.push(student);
        }
        res.send({success: true, data: students});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

router.post("/checkCourse", async (req, res) => {
    const course = await Course.findOne({course_code: req.body.course_code});
    try {
        if(course)
            res.send({data: course, success: true});
        else
            res.send({success: false, data: "Invalid course code"});
    } catch (error) {
        console.log(error)
        res.status(400).send({success: false, error});
    }
})

router.post("/records", async (req, res) => {
    const record = new Record(req.body);
    try {
        await record.save();
        res.send({data: record, success: true});
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

router.get("/search/:id/:fName/:lName", async(req, res) => {
    const _id = req.params.id;
    const fName = req.params.fName;
    const lName = req.params.lName;
    const students = [];
    try {
        const records = await Record.find({ course_id : _id});
        console.log(records);
        for (const record of records) {
            const student = await Student.findById(record.student_id);
            if(student.fName.toLowerCase() == fName.toLowerCase() && student.lName.toLowerCase() == lName.toLowerCase())
                students.push(student);
        }
        res.send({success: true, data: students});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

router.post("/removeStudent", async (req, res) => {
    const course_id = req.body.course_id;
    const student_id = req.body.student_id;

    try {
        const record = await Record.findOneAndDelete({course_id, student_id});
        if(record)
            res.send({success: true, data: record});
        else
            res.send({success: false});
    } catch(error) {
        console.log(error);
        res.status(400).send({error});
    }
})

router.delete("/course/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const course = await Course.findByIdAndDelete(_id);
        if(course)
            res.send({success: true, data: course});
        else
            res.send({success: false});
    } catch(error) {
        console.log(error);
        res.status(400).send({error});
    }
})

router.post("/course/changeName/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const course = await Course.findById({_id})
        course.name = req.body.name;
        await course.save();
        res.send({data: course, success: true});
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

module.exports = router