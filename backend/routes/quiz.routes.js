const express = require("express");
const Quiz = require("../models/quiz.model");
const QuizQuestion = require("../models/quizQuestion.model");
const QuizResponse = require("../models/quizResponse.model");

const router = new express.Router();

// Create quiz
router.post("/quiz", async (req, res) => {
  const quiz = new Quiz(req.body);
  try {
    await quiz.save();
    res.send({ data: quiz, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Create new question
router.post("/quizQuestion", async (req, res) => {
    const quizQuestion = new QuizQuestion(req.body);
    try {
      await quizQuestion.save();
      res.send({ data: quizQuestion, success: true });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
});

// Submit quiz response
router.post("/submitQuiz", async (req, res) => {
  const quizResponse = new QuizResponse(req.body);
  try {
    const student = await QuizResponse.find({quiz_id: req.body.quiz_id, student_id: req.body.student_id})

    if(student.length > 0)
    {
      return res.send({success: false, data: "Submission exists"})
    } else {
      await quizResponse.save();
      res.send({ data: quizResponse, success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Fetch a quiz by ID
router.get("/quiz/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const quiz = await Quiz.findById({ _id });
    if (!quiz)
      return res.status(404).send({ success: false, data: "No quiz found" });

    res.send({ success: true, data: quiz });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

// Get all questions in a quiz with quizID
router.get("/questions/:id", async (req, res) => {
  const quiz_id = req.params.id;
  try {
    const questions = await QuizQuestion.find({ quiz_id });
    if (!questions || questions.length == 0)
      return res.status(404).send({ success: false, data: "No questions found" });

    res.send({ success: true, data: questions });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

router.get("/quizResult/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const quizResult = await QuizResponse.find({ quiz_id: _id });
    if (!quizResult || quizResult.length == 0)
      return res.status(404).send({ success: false, data: "No response found" });

    res.send({ success: true, data: quizResult });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

router.post("/startQuiz/:id", async (req, res) => {
  const _id = req.params.id;
  try {
      const quiz = await Quiz.findByIdAndUpdate(_id, {
          is_active: true
      }, {new: true, runValidators: true});
      res.send({data: quiz, success: true});
  } catch (error) {
      console.log(error)
      res.status(400).send(error);
  }
})

router.post("/endQuiz/:id", async (req, res) => {
  const _id = req.params.id;
  try {
      const quiz = await Quiz.findByIdAndUpdate(_id, {
          is_active: false
      }, {new: true, runValidators: true});
      res.send({data: quiz, success: true});
  } catch (error) {
      console.log(error)
      res.status(400).send(error);
  }
})

router.get("/quiz/course/:id", async (req, res) => {
  const course_id = req.params.id;
  try {
    const quizzes = await Quiz.find({ course_id });
    if (!quizzes || quizzes.length == 0)
      return res.status(404).send({ success: false, data: "No response found" });

    res.send({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

router.get("/quiz/hasSubmitted/:quizId/:studentId", async (req, res) => {
  const quiz_id = req.params.quizId;
  const student_id = req.params.studentId;
  try {
    const response = await QuizResponse.findOne({ quiz_id, student_id });
    if (!response)
      return res.send({ success: false, data: false });

    res.send({ success: true, data: true });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

router.post("/deleteQuiz/:id", async (req, res) => {
  const _id = req.params.id;
  try {
      const quiz = await Quiz.findByIdAndDelete(_id);
      if(quiz)
          res.send({success: true, data: quiz});
      else
          res.send({success: false});
  } catch(error) {
      console.log(error);
      res.status(400).send({error});
  }
})

router.post("/deleteQuestion/:id", async (req, res) => {
  const quiz_id = req.params.id;
  try {
      const count = await QuizQuestion.deleteMany({quiz_id})
      res.send({success: true});
  } catch(error) {
      console.log(error);
      res.status(400).send({error});
  }
})

router.post("/deleteSubmission/:id", async (req, res) => {
  const quiz_id = req.params.id;
  try {
      const count = await QuizResponse.deleteMany({quiz_id});
      res.send({success: true});
  } catch(error) {
      console.log(error);
      res.status(400).send({error});
  }
})


router.post("/quiz/changeName/:id", async (req, res) => {
  try {
      const quiz = await Quiz.findOneAndUpdate({_id: req.params.id}, {
          quiz_title: req.body.quiz_name
      }, {new: true, runValidators: true});
      res.send({data: quiz, success: true});
  } catch (error) {
      console.log(error)
      res.status(400).send(error);
  }
})

module.exports = router;
