import React from "react";
import Axios from "axios";
import Toggle from "react-toggle";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { EmptyStateSmall } from "./EmptyState";
import { Trash, List, Type, X } from "react-feather";
import "./css/Course.css";
import "./css/CreateCourse.css";

let localdata = JSON.parse(localStorage.getItem("userDetails"));
let user = localdata
  ? localdata
  : {
      fName: "",
      lName: "",
      email: "",
      password: "",
      _id: "404",
    };

export const RenderQuestion = ({
  question,
  option1,
  option2,
  option3,
  option4,
  correctOption,
  QID,
  onDelete,
  canDelete = true,
}) => {
  return (
    <div
      style={{
        width: "80%",
        height: "auto",
        margin: "0 0 25px 0",
        zIndex: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      {canDelete ? (
        <div
          style={{
            width: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
            borderRadius: 10,
          }}
          className=""
        >
          <Trash
            size={20}
            className="sub"
            style={{ cursor: "pointer" }}
            onClick={() => onDelete(QID)}
          />
        </div>
      ) : null}
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <p
            className="changeColor"
            style={{
              fontSize: 17,
              fontWeight: 600,
              margin: "5px 0",
              fontFamily: "Poppins",
              letterSpacing: 0.4,
              padding: 0,
            }}
          >
            {question}
          </p>
          <p
            className="sub"
            style={{
              fontSize: 14,
              fontWeight: 500,
              margin: "5px 0",
              fontFamily: "Poppins",
              letterSpacing: 0.4,
              padding: 0,
              marginLeft: 10,
            }}
          >
            1 mark
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 10,
              margin: "2px 10px 2px 0",
            }}
            className="changeColorBG"
          ></div>
          <p
            className="sub"
            style={{
              fontSize: 15,
              fontWeight: 500,
              margin: "2px 0",
              fontFamily: "Poppins",
              letterSpacing: 0.4,
              padding: 0,
            }}
          >
            {option1}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 10,
              margin: "2px 10px 2px 0",
            }}
            className="changeColorBG"
          ></div>
          <p
            className="sub"
            style={{
              fontSize: 15,
              fontWeight: 500,
              margin: "2px 0",
              fontFamily: "Poppins",
              letterSpacing: 0.4,
              padding: 0,
            }}
          >
            {option2}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 10,
              margin: "2px 10px 2px 0",
            }}
            className="changeColorBG"
          ></div>
          <p
            className="sub"
            style={{
              fontSize: 15,
              fontWeight: 500,
              margin: "2px 0",
              fontFamily: "Poppins",
              letterSpacing: 0.4,
              padding: 0,
            }}
          >
            {option3}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 10,
              margin: "2px 10px 2px 0",
            }}
            className="changeColorBG"
          ></div>
          <p
            className="sub"
            style={{
              fontSize: 15,
              fontWeight: 500,
              margin: "2px 0",
              fontFamily: "Poppins",
              letterSpacing: 0.4,
              padding: 0,
            }}
          >
            {option4}
          </p>
        </div>
      </div>
    </div>
  );
};

export const RenderQuestionTextual = ({
  question,
  keywords,
  QID,
  onDelete,
  canDelete = true,
  textualQuesMarks,
}) => {
  if (!keywords) keywords = [];

  return (
    <div
      style={{
        width: "80%",
        height: "auto",
        margin: "0 0 25px 0",
        zIndex: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      {canDelete ? (
        <div
          style={{
            width: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
            borderRadius: 10,
          }}
          className=""
        >
          <Trash
            size={20}
            className="sub"
            style={{ cursor: "pointer" }}
            onClick={() => onDelete(QID)}
          />
        </div>
      ) : null}
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <p
            className="changeColor"
            style={{
              fontSize: 17,
              fontWeight: 600,
              margin: "5px 0",
              fontFamily: "Poppins",
              letterSpacing: 0.4,
              padding: 0,
            }}
          >
            {question}
          </p>
          <p
            className="sub"
            style={{
              fontSize: 14,
              fontWeight: 500,
              margin: "5px 0",
              fontFamily: "Poppins",
              letterSpacing: 0.4,
              padding: 0,
              marginLeft: 10,
            }}
          >
            {textualQuesMarks ? textualQuesMarks : 1} marks
          </p>
        </div>

        {keywords.map((k) => {
          return (
            <div
              key={k}
              style={{
                display: "inline-flex",
                flexDirection: "row",
                padding: "2px 8px",
                borderRadius: 50,
                height: 30,
                alignItems: "center",
                margin: "3px 4px 3px 0",
              }}
              className="changeColorBG"
            >
              <p
                className="sub"
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  color: "#232323",
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                  textAlign: "left",
                  margin: "0 5px 0 5px",
                  letterSpacing: 0.3,
                }}
              >
                {k}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuizQuestion = ({ history }) => {
  const [questions, setQuestions] = React.useState([]);
  const [questionID, setQID] = React.useState(0);

  const [quizName, setQuizName] = React.useState("");
  const [questionTitle, setQuestionTitle] = React.useState("");
  const [option1, setO1] = React.useState("");
  const [option2, setO2] = React.useState("");
  const [option3, setO3] = React.useState("");
  const [option4, setO4] = React.useState("");
  const [correctOption, setCorrectOption] = React.useState(1);

  const [textualQuestionTitle, setTextualQuestionTitle] = React.useState("");
  const [minChar, setMinChar] = React.useState(null);
  const [textualQuesMarks, setTQM] = React.useState(undefined);
  const [keywords, setKeywords] = React.useState([]);
  const [keywordInput, setKeywordInput] = React.useState("");

  const [questionType, setQuestionType] = React.useState("mcq");

  const [modalIsOpen, setModal] = React.useState(false);

  const addNewQuestion = () => {
    if (
      !questionTitle.length ||
      !option1.length ||
      !option2.length ||
      !option3 ||
      !option4.length ||
      correctOption <= 0 ||
      correctOption >= 5
    ) {
      toast.error("Invalid question");
      return;
    }

    let obj = {
      question_title: questionTitle,
      option_1: option1,
      option_2: option2,
      option_3: option3,
      option_4: option4,
      correct_option: correctOption,
      question_type: "mcq",
      question_id: questionID,
      textual_ques_marks: null,
      min_char: null,
      keywords: null,
    };

    setQuestions((questions) => [...questions, obj]);
    setQID(questionID + 1);
    setQuestionTitle("");
    setO1("");
    setO2("");
    setO3("");
    setO4("");
    setCorrectOption(1);
    toast.success("Added a new question");
  };

  const addNewQuestionTextual = () => {
    if (
      !keywords.length ||
      !textualQuestionTitle ||
      !minChar ||
      !textualQuesMarks
    ) {
      toast.error("Invalid question");
      return;
    }

    let minCharInt = parseInt(minChar);
    let textualQuesMarksInt = parseInt(textualQuesMarks);
    let obj = {
      quiz_id: "",
      question_title: textualQuestionTitle,
      keywords,
      textual_ques_marks: textualQuesMarksInt,
      min_char: minCharInt,
      question_type: "text",
      question_id: questionID,
      option_1: null,
      option_2: null,
      option_3: null,
      option_4: null,
      correct_option: null,
    };

    setQuestions((questions) => [...questions, obj]);
    setQID(questionID + 1);
    setKeywords([]);
    setMinChar(null);
    setTQM(null);
    setTextualQuestionTitle("");
    toast.success("Added a new question");
  };

  const onDeleteQuestion = (id) => {
    setQuestions((questions) => questions.filter((q) => q.question_id !== id));
  };

  const handleKeywordDelete = (toDelete) =>
    setKeywords(keywords.filter((k) => k !== toDelete));

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const createQuiz = () => {
    let textualMarks = [];
    questions
      .filter((q) => q.question_type === "text")
      .forEach((q) => textualMarks.push(q.textual_ques_marks));
    let totalMarks =
      questions.filter((q) => q.question_type === "mcq").length +
      textualMarks.reduce((a, b) => a + b, 0);
    let loc = window.location.href.split("/");

    let quiz = {
      questions,
      no_of_questions: questions.length,
      total_marks: totalMarks,
      is_active: false,
      teacher_id: user._id,
      course_id: loc[loc.length - 1],
      quiz_title: quizName,
    };

    let _id = null;
    var QID = 1;

    Axios.post("/api/quiz", quiz)
      .then((res) => {
        if (res.data.success) {
          _id = res.data.data._id;

          if (_id) {
            toast.success("Quiz created");
            Promise.all(
              questions.map((ques) => {
                ques.quiz_id = _id;
                Axios.post("/api/quizQuestion", ques)
                  .then((res) => {})
                  .catch((e) => console.log(e));
              })
            );
          }
        } else {
        }
      })
      .catch((e) => console.log("error", e));
    setTimeout(() => {
      window.location.href = `/course/${loc[loc.length - 1]}`;
    }, 3000);
  };

  return (
    <div className={"background course-container"} style={{}}>
      {/* Question Input */}
      <div
        style={{
          height: 250,
          display: "flex",
          zIndex: 0,
          flexDirection: "row",
          boxShadow: "-4px -4px 10px #eee",
          padding: "30px 10px",
          position: "fixed",
          bottom: 0,
          width: "80%",
          alignSelf: "center",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingBottom: 10,
        }}
        className={"background borderrad boxshadowtop"}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            padding: "0 10px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 30,
              right: 30,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p
              className="sub"
              style={{
                fontSize: 14.5,
                fontWeight: 500,
                margin: 0,
                fontFamily: "Poppins",
                letterSpacing: 0.4,
                padding: 0,
                marginRight: 10,
              }}
            >
              {questionType === "mcq"
                ? "Multiple Choice Question"
                : "Textual Question"}
            </p>
            <Toggle
              defaultChecked={questionType === "mcq"}
              icons={{
                checked: (
                  <List
                    size={17}
                    color="#fff"
                    style={{ position: "absolute", top: -2.5, left: -1 }}
                  />
                ),
                unchecked: (
                  <Type
                    size={14}
                    color="#fff"
                    style={{ position: "absolute", top: -2 }}
                  />
                ),
              }}
              style={{}}
              className="chartToggle"
              onChange={() =>
                questionType === "mcq"
                  ? setQuestionType("text")
                  : setQuestionType("mcq")
              }
            />
          </div>
          <p
            className="changeColor"
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              margin: 0,
              fontFamily: "Poppins",
              letterSpacing: 0.3,
              padding: 0,
              position: "absolute",
              top: 20,
              left: 20,
            }}
          >
            ADD NEW QUESTION
          </p>

          {questionType === "mcq" ? (
            <React.Fragment>
              <input
                type="text"
                style={{
                  height: 40,
                  fontSize: 18,
                  width: "100%",
                  marginTop: 30,
                  marginBottom: 15,
                }}
                placeholder="Enter question"
                value={questionTitle}
                onChange={(t) => setQuestionTitle(t.target.value)}
              ></input>

              <p
                className="sub"
                style={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  margin: 0,
                  fontFamily: "Poppins",
                  letterSpacing: 0.4,
                  padding: 0,
                }}
              >
                Select the correct option with the checkmark
              </p>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    paddingRight: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        height: 55,
                        width: "48%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <label
                        class="checkbox-container"
                        style={{
                          padding: "40px 10px 10px 10px",
                          borderWidth: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          onClick={() => {
                            setCorrectOption(1);
                          }}
                          checked={correctOption === 1}
                        />
                        <span
                          class="checkmarkquiz"
                          style={{ borderRadius: 15, left: 2 }}
                        ></span>
                      </label>
                      <input
                        type="text"
                        style={{
                          fontSize: 16,
                          flexGrow: 1,
                          marginBottom: 0,
                          marginRight: 0,
                          marginLeft: 10,
                        }}
                        placeholder="Option One"
                        value={option1}
                        onChange={(t) => setO1(t.target.value)}
                      ></input>
                    </div>
                    <div
                      style={{
                        height: 55,
                        width: "48%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <label
                        class="checkbox-container"
                        style={{
                          padding: "40px 10px 10px 10px",
                          borderWidth: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          onClick={() => {
                            setCorrectOption(2);
                          }}
                          checked={correctOption === 2}
                        />
                        <span
                          class="checkmarkquiz"
                          style={{ borderRadius: 15, left: 2 }}
                        ></span>
                      </label>
                      <input
                        type="text"
                        style={{
                          fontSize: 16,
                          flexGrow: 1,
                          marginBottom: 0,
                          marginRight: 0,
                          marginLeft: 10,
                        }}
                        placeholder="Option Two"
                        value={option2}
                        onChange={(t) => setO2(t.target.value)}
                      ></input>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        height: 55,
                        width: "48%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <label
                        class="checkbox-container"
                        style={{
                          padding: "40px 10px 10px 10px",
                          borderWidth: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          onClick={() => {
                            setCorrectOption(3);
                          }}
                          checked={correctOption === 3}
                        />
                        <span
                          class="checkmarkquiz"
                          style={{ borderRadius: 15, left: 2 }}
                        ></span>
                      </label>
                      <input
                        type="text"
                        style={{
                          fontSize: 16,
                          flexGrow: 1,
                          marginBottom: 0,
                          marginRight: 0,
                          marginLeft: 10,
                        }}
                        placeholder="Option Three"
                        value={option3}
                        onChange={(t) => setO3(t.target.value)}
                      ></input>
                    </div>
                    <div
                      style={{
                        height: 55,
                        width: "48%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <label
                        class="checkbox-container"
                        style={{
                          padding: "40px 10px 10px 10px",
                          borderWidth: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          onClick={() => {
                            setCorrectOption(4);
                          }}
                          checked={correctOption === 4}
                        />
                        <span
                          class="checkmarkquiz"
                          style={{ borderRadius: 15, left: 2 }}
                        ></span>
                      </label>
                      <input
                        type="text"
                        style={{
                          fontSize: 16,
                          flexGrow: 1,
                          marginBottom: 0,
                          marginRight: 0,
                          marginLeft: 10,
                        }}
                        placeholder="Option Four"
                        value={option4}
                        onChange={(t) => setO4(t.target.value)}
                      ></input>
                    </div>
                  </div>
                </div>
                <button
                  onClick={addNewQuestion}
                  style={{ height: 50, marginTop: 50 }}
                >
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "white",
                      margin: 0,
                      fontFamily: "Poppins",
                      letterSpacing: 0.8,
                    }}
                  >
                    Add Question
                  </p>
                </button>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <input
                type="text"
                style={{
                  height: 40,
                  fontSize: 18,
                  width: "100%",
                  marginTop: 30,
                  marginBottom: 15,
                }}
                placeholder="Enter question"
                value={textualQuestionTitle}
                onChange={(t) => setTextualQuestionTitle(t.target.value)}
              ></input>

              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    paddingRight: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "50%",
                      }}
                    >
                      <p
                        className="sub"
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          margin: 0,
                          fontFamily: "Poppins",
                          letterSpacing: 0.4,
                          padding: 0,
                        }}
                      >
                        Enter the keywords for the answer with space between
                        each word
                      </p>
                      <input
                        type="text"
                        style={{
                          height: 40,
                          fontSize: 18,
                          width: "100%",
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                        placeholder="Enter keywords"
                        value={keywordInput}
                        onChange={(t) => setKeywordInput(t.target.value)}
                        onKeyDown={(e) => {
                          if ([",", " ", "Enter"].includes(e.key)) {
                            e.preventDefault();
                            var keyword = keywordInput.trim();
                            if (keyword) {
                              setKeywords((keywords) => [...keywords, keyword]);
                              setKeywordInput("");
                            }
                          }
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "25%",
                        marginLeft: 20,
                      }}
                    >
                      <p
                        className="sub"
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          margin: 0,
                          fontFamily: "Poppins",
                          letterSpacing: 0.4,
                          padding: 0,
                        }}
                      >
                        Minimum Characters required
                      </p>
                      <input
                        type="number"
                        style={{
                          height: 40,
                          fontSize: 18,
                          width: "100%",
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                        placeholder="Enter min characters"
                        value={minChar}
                        onChange={(t) => setMinChar(t.target.value)}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "25%",
                        marginLeft: 20,
                      }}
                    >
                      <p
                        className="sub"
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          margin: 0,
                          fontFamily: "Poppins",
                          letterSpacing: 0.4,
                          padding: 0,
                        }}
                      >
                        Maximum Marks
                      </p>
                      <input
                        type="number"
                        style={{
                          height: 40,
                          fontSize: 18,
                          width: "100%",
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                        placeholder="Enter max marks"
                        value={textualQuesMarks}
                        onChange={(t) => setTQM(t.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    {keywords.map((k) => {
                      return (
                        <div
                          key={k}
                          style={{
                            display: "inline-flex",
                            flexDirection: "row",
                            padding: "2px 8px",
                            borderRadius: 50,
                            height: 30,
                            alignItems: "center",
                            margin: "3px 4px",
                          }}
                          className="changeColorBG"
                        >
                          <p
                            className="sub"
                            style={{
                              fontFamily: "Poppins",
                              fontSize: 14,
                              color: "#232323",
                              fontWeight: 500,
                              margin: 0,
                              padding: 0,
                              textAlign: "left",
                              margin: "0 10px 0 5px",
                              letterSpacing: 0.3,
                            }}
                          >
                            {k}
                          </p>
                          <X
                            size={15}
                            className="changeColor"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleKeywordDelete(k)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={addNewQuestionTextual}
                  style={{ height: 50, marginTop: 50 }}
                >
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "white",
                      margin: 0,
                      fontFamily: "Poppins",
                      letterSpacing: 0.8,
                    }}
                  >
                    Add Question
                  </p>
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>

      {/* ////////////////////////////////////////////////////////////////////////////////////// */}

      <div style={{ width: "100%", paddingBottom: 400 }}>
        <h2
          className="course-title"
          style={{ fontSize: 30, marginTop: 20, marginBottom: 20 }}
        >
          Create New Quiz
        </h2>

        {questions.length ? (
          <React.Fragment>
            <p
              className="sub"
              style={{
                fontFamily: "Poppins",
                fontSize: 15,
                color: "#232323",
                fontWeight: 600,
                margin: 0,
                padding: 0,
                textAlign: "left",
                marginTop: 35,
                marginBottom: 15,
                marginLeft: 0,
                letterSpacing: 0.4,
              }}
            >
              {questions.length} QUESTIONS ADDED
            </p>
            {questions.map((q, index) => {
              return q.questionType === "mcq" ? (
                <RenderQuestion
                  question={q.question_title}
                  option1={q.option_1}
                  option2={q.option_2}
                  option3={q.option_3}
                  option4={q.option_4}
                  correctOption={q.correct_option}
                  QID={q.question_id}
                  onDelete={onDeleteQuestion}
                />
              ) : (
                <RenderQuestionTextual
                  question={q.question_title}
                  keywords={q.keywords}
                  QID={q.question_id}
                  onDelete={onDeleteQuestion}
                  textualQuesMarks={q.textual_ques_marks}
                />
              );
            })}
          </React.Fragment>
        ) : (
          <EmptyStateSmall
            title="No Questions Added"
            d1="There are no questions in this quiz. Enter info in the bottom panel to add a question"
          />
        )}

        <div
          style={{
            position: "fixed",
            top: 90,
            right: 25,
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => {
              if (!questions.length) {
                toast.error("No questions in quiz");
                return;
              }
              openModal();
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "white",
                margin: 0,
                fontFamily: "Poppins",
                letterSpacing: 0.8,
              }}
            >
              Proceed
            </p>
          </button>
          <button
            style={{ boxShadow: "none", backgroundColor: "transparent" }}
            onClick={() => {
              let loc = window.location.href.split("/");
              setTimeout(() => {
                window.location.href = `/course/${loc[loc.length - 1]}`;
              }, 1000);
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#6C63FF",
                margin: 0,
                fontFamily: "Poppins",
                letterSpacing: 0.8,
              }}
            >
              Cancel
            </p>
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Modal"
        closeTimeoutMS={200}
        className="background"
      >
        <X
          size={25}
          color="#ababab"
          style={{
            position: "absolute",
            top: 25,
            right: 25,
            cursor: "pointer",
          }}
          onClick={closeModal}
        />

        <h2
          className="changeColor"
          style={{
            textAlign: "left",
            fontFamily: "Poppins",
            color: "#232323",
            fontWeight: 600,
            fontSize: 25,
            padding: 0,
            marginBottom: 0,
          }}
        >
          Create Quiz
        </h2>

        <p
          style={{
            fontFamily: "Poppins",
            fontSize: 17,
            color: "#ababab",
            fontWeight: 500,
            margin: 0,
            padding: 0,
            textAlign: "left",
            marginTop: 20,
            marginBottom: 0,
          }}
          className="sub"
        >
          Name of Quiz
        </p>
        <input
          type="text"
          style={{ height: 40 }}
          value={quizName}
          onChange={(t) => setQuizName(t.target.value)}
        ></input>

        <ul style={{ margin: 0, padding: 0, marginLeft: 20 }}>
          <li>
            <p
              className="sub"
              style={{
                fontFamily: "Poppins",
                fontSize: 14,
                color: "#545454",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                textAlign: "left",
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              Quiz can be started at any time post creation.
            </p>
          </li>
          <li>
            <p
              className="sub"
              style={{
                fontFamily: "Poppins",
                fontSize: 14,
                color: "#545454",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                textAlign: "left",
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              Student responses will be collected until the quiz is closed.
            </p>
          </li>
        </ul>

        <div
          style={{
            position: "absolute",
            bottom: 25,
            right: 25,
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => {
              createQuiz();
              closeModal();
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#fff",
                margin: 0,
                fontFamily: "Poppins",
                letterSpacing: 0.8,
              }}
            >
              Create
            </p>
          </button>
          <button
            style={{ backgroundColor: "transparent", boxShadow: "none" }}
            onClick={closeModal}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#6C63FF",
                margin: 0,
                fontFamily: "Poppins",
                letterSpacing: 0.8,
              }}
            >
              Cancel
            </p>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default QuizQuestion;

export const customStyles = {
  content: {
    position: "absolute",
    top: "25%",
    left: "30%",
    right: "30%",
    bottom: "25%",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "10px",
    outline: "none",
    padding: "25px",
    alignSelf: "center",
    height: "60%",
    paddingTop: "30px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000ba",
    zIndex: 9999,
  },
};
