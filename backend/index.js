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

require("./mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors())
app.use(express.json())

app.use(studentRouter)
app.use(teacherRouter)
app.use(courseRouter)
app.use(noteRouter)
app.use(assignmentRouter)
app.use(messageRouter)
app.use(quizRouter)

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

app.get("/api", (req, res) => {
    res.json({
        message: "Hello from server"
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});