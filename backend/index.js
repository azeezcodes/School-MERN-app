const express = require("express");
const cors = require("cors");
const path = require('path'); 
const studentRouter = require("./routes/student.routes");
const teacherRouter = require("./routes/teacher.routes");
const courseRouter = require("./routes/course.routes");
const noteRouter = require("./routes/note.routes");
const assignmentRouter = require("./routes/assignment.routes");
const messageRouter = require("./routes/message.routes");
const quizRouter = require("./routes/quiz.routes");
const resetPasswordRouter = require("./routes/resetPassword.routes");

// Importing database config
require("./mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors())
app.use(express.json())

// Importing all routers
app.use("/api", studentRouter)
app.use("/api", teacherRouter)
app.use("/api", courseRouter)
app.use("/api", noteRouter)
app.use("/api", assignmentRouter)
app.use("/api", messageRouter)
app.use("/api", quizRouter)
app.use("/api", resetPasswordRouter)

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Test api
app.get("/api", (req, res) => {
    res.json({
        message: "Hello from server"
    })
})

// Redirect all requests not handled by above routes to frontend
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});