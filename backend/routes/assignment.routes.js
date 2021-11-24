const express = require("express");
const multer = require("multer");
const Assignment = require("../models/assignment.model");
const Course = require("../models/course.model");
const Student = require("../models/student.model");
const Submission = require("../models/submission.model");
const Record = require("../models/record.model")

const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|docx|doc|jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid file type"));
    }
    cb(undefined, true);
  },
});

router.post("/assignment", async (req, res) => {
  const assignment = new Assignment(req.body);
  try {
    await assignment.save();
    res.send({ data: assignment, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/course/assignment/:id", async (req, res) => {
  const course_id = req.params.id;

  try {
    const assignments = await Assignment.find({ course_id });
    if (!assignments)
      return res
        .status(404)
        .send({ success: false, data: "No assignments found" });

    res.send({ success: true, data: assignments });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

router.get("/assignment/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const assignment = await Assignment.findById({ _id });
    if (!assignment)
      return res.status(404).send({ success: false, data: "No assignment found" });

    res.send({ success: true, data: assignment });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

router.post("/assignment/attachment/:id", upload.single("file"), async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    assignment.file = req.file.buffer;
    await assignment.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/assignment/attachment/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment || !assignment.file) {
      throw new Error();
    }
    res.set("Content-Type", "application/pdf");
    res.send(assignment.file);
  } catch (e) {
    res.status(404).send();
  }
});

router.delete("/assignment/:id", async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if(assignment)
            res.send({success: true, data: assignment});
        else
            res.send({success: false});
    } catch(error) {
        console.log(error);
        res.status(400).send({error});
    }
})

router.post("/submission", async (req, res) => {
  const submission = new Submission(req.body);
  try {
    await submission.save();
    res.send({ data: submission, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/submission/attachment/:id", upload.single("file"), async (req, res) => {
    const submission = await Submission.findById(req.params.id);
    submission.file = req.file.buffer;
    await submission.save();
    res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

router.get("/hasAttachment/:id", async (req, res) => {
  try{
    const assignment = await Assignment.findById(req.params.id);
    if(assignment && assignment.file)
    {
      res.send({success: true, file_exists: true});
    }
    res.send({success: false, file_exists: false});
  } catch (error) {
    res.status(400).send(error);
  }
})

router.get("/marks/:id", async (req, res) => {
  try{
    const submitted = [];

    const submissions = await Submission.find({assignment_id: req.params.id});
    for(const submission of submissions)
    {
      const student = await Student.findById(submission.student_id)
      const obj = {
        student_id: submission.student_id,
        fName: student.fName,
        lName: student.lName,
        marks_obtained: submission.marks_obtained ? submission.marks_obtained : 0
      }
      submitted.push(obj);
    }
    res.send({success: true, submitted: submitted});
  } catch(error) {
    res.status(400).send(error);
  }
})

router.post("/submission/grade/:assignmentId/:studentId", async (req, res) => {
  try{
    const student_id = req.params.studentId;
    const assignment_id = req.params.assignmentId;
    const submission = await Submission.findOne({student_id, assignment_id });
    submission.marks_obtained = req.body.marks;
    await submission.save();
    res.send({success: true});
  } catch(error) {
    console.log(error);
    res.status(400).send(error);
  }
})

router.get("/submission/getAttachment/:assignmentId/:studentId", async (req, res) => {
  try {
    const submission = await Submission.findOne({
      assignment_id: req.params.assignmentId,
      student_id: req.params.studentId
    });

    if (!submission || !submission.file) {
      throw new Error();
    }
    res.set("Content-Type", "application/pdf");
    res.send(submission.file);
  } catch (e) {
    res.status(404).send();
  }
});

router.get("/hasSubmitted/:assignmentId/:studentId", async (req, res) => {
  try{
    const submission = await Submission.find({
      assignment_id: req.params.assignmentId,
      student_id: req.params.studentId
    })

    if(submission.length > 0)
      res.send({success: true})
    else
      res.send({success: false})
  }
  catch(error) {
    res.status(400).send(error);
  }
})

router.get("/studentCount/assignment/:id", async (req, res) => {
  const _id = req.params.id;

  try {
      const assignment = await Assignment.findById(_id);
      const count = await Record.where({ course_id: assignment.course_id}).countDocuments();
      res.send({success: true, data: {count}});
  } catch(error) {
    console.log(error)
      res.status(500).send({success: false, error});
  }
})

module.exports = router;
