import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SwipeableViews from "react-swipeable-views";
import { withStyles } from "@material-ui/core/styles";
import DayPickerInput from "react-day-picker/DayPickerInput";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  FileText,
  Edit3,
  Book,
  Download,
  Copy,
  Plus,
  X,
  UserX,
  ArrowLeft,
  HelpCircle,
  Trash2,
  LogOut,
  Send,
} from "react-feather";
import { customStyles3 } from "./CustomModalStyles";
import { EmptyStateSmall } from "./EmptyState";
import Post from "./Post";
import Message from "./Message";
import userImage from "../assets/user.png";
import userImage3 from "../assets/user3.png";
import userImage4 from "../assets/user4.png";
import { getRandomUser } from "./random";
import "react-day-picker/lib/style.css";
import "./css/Course.css";

let randomUser = getRandomUser();
let theme = JSON.parse(localStorage.getItem("theme"));
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

let userType = JSON.parse(localStorage.getItem("userType"));

export const styles = {
  tabs: {
    background: theme === "dark" ? "#1B1B1B" : "#fff",
  },
  slide: {
    padding: 15,
    minHeight: 100,
    color: "#232323",
    paddingBottom: 100,
  },
};

export const AntTabs = withStyles({
  root: {
    height: 50,
  },
  indicator: {
    backgroundColor: "#6C63FF",
    height: 4,
    borderRadius: 10,
    marginTop: 0,
  },
  overrides: {
    MuiTab: {
      wrapper: {
        flexDirection: "row",
      },
    },
  },
})(Tabs);

export const AntTab = withStyles(() => ({
  wrapper: {
    flexDirection: "row",
  },
  root: {
    textTransform: "none",
    color: "#878787",
    minWidth: 72,
    fontWeight: 500,
    fontSize: 17,
    paddingRight: 20,
    paddingLeft: 20,
    boxShadow: "none",
    marginLeft: 15,
    letterSpacing: 0.3,
    height: 50,
    opacity: 1,
    fontFamily: ["Poppins"].join(","),
    "&:hover": {
      opacity: 1,
      fontWeight: 500,
      fontSize: 17,
    },
    "&$selected": {
      color: "#6C63FF",
      fontWeight: 500,
      fontSize: 17,
    },
    "&:focus": {
      color: "#6C63FF",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const Course = () => {
  const [index, setIndex] = React.useState(0);
  const handleChange = (event, value) => setIndex(value);
  const handleChangeIndex = (index) => setIndex(index);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [isAssignment, setIsAssignment] = React.useState(false);
  const [isQuiz, setIsQuiz] = React.useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [maxMarks, setMaxMarks] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [attachment, setAttachment] = React.useState(null);
  const [courseInfo, setCourseInfo] = useState({});
  const [courseTeacher, setCourseTeacher] = useState({});
  const [courseStudents, setCourseStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = React.useState([]);
  const [courseNameModalIsOpen, setCourseNameModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [ignore, setIgnored] = React.useState(0);
  const [newCourseName, setNewCourseName] = useState("");

  let arr = window.location.href.split("/");
  let courseID = arr[arr.length - 1];

  const forceUpdate = React.useCallback(() => setIgnored((v) => v + 1), []);

  React.useEffect(() => {
    let arr = window.location.href.split("/");
    let courseID = arr[arr.length - 1];
    let courseInfo = null;
    Axios.get(`/api/course/${courseID}`)
      .then((res) => {
        if (res.data.success) {
          courseInfo = res.data.data;
          setCourseInfo(courseInfo);
        } else {
          console.log("error");
        }
      })
      .catch(() => console.log("error"));
  }, [ignore, courseNameModalIsOpen]);

  React.useEffect(() => {
    Axios.get(`/api/quiz/course/${courseID}`)
      .then((res) => {
        if (res.data.success) {
          setQuizzes(res.data.data.reverse());
        }
      })
      .catch((e) => console.log(e));
  }, [courseInfo, modalIsOpen]);

  React.useEffect(() => {
    let teacher_id = courseInfo.teacher_id;
    Axios.get(`/api/teacher/${teacher_id}`)
      .then((res) => {
        if (res.data.success) {
          let teacher = res.data.data;
          setCourseTeacher(teacher);
        } else {
        }
      })
      .catch(() => {});
  }, [courseInfo]);

  React.useEffect(() => {
    Axios.get(`/api/course/students/${courseID}`)
      .then((res) => {
        if (res.data.success) {
          let courseStudents = res.data.data;
          setCourseStudents(courseStudents);
        } else {
        }
      })
      .catch(() => {});
  }, [courseInfo]);

  React.useEffect(() => {
    Axios.get(`/api/course/assignment/${courseID}`)
      .then((res) => {
        if (res.data.success) {
          setPosts(res.data.data.reverse());
        } else {
          console.log("error");
        }
      })
      .catch(() => console.log("error"));
  }, [courseInfo, modalIsOpen]);

  React.useEffect(() => {
    let loc = window.location.href.split("/");
    Axios.get(`/api/messages/${loc[loc.length - 1]}`).then((res) => {
      if (res.data.success) {
        setMessages(res.data.data);
      }
    });
  }, []);

  const openCourseNameModal = () => setCourseNameModal(true);
  const closeCourseNameModal = () => setCourseNameModal(false);
  const openModal = () => setIsOpen(true);
  const afterOpenModal = () => {};
  const closeModal = () => setIsOpen(false);

  const validateTitle = () => (title ? (title.length ? true : false) : false);
  const validateDescription = () =>
    description ? (description.length ? true : false) : false;
  const validateMarks = () =>
    maxMarks ? (maxMarks.length ? true : false) : false;

  const handleDueDateChange = (day) => {
    setDueDate(day);
    var q = new Date();
    var m = q.getMonth();
    var d = q.getDate();
    var y = q.getFullYear();
    var today = new Date(y, m, d);
    let ourDate = new Date(day);
    if (ourDate < today) {
      toast.error("Invalid date");
      setDueDate(null);
    }
  };

  const generatePDF = (tickets) => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Year", "Department", "Email"];

    const tableRows = [];

    tickets.forEach((ticket) => {
      const ticketData = [
        ticket.fName.concat(" ").concat(ticket.lName),
        ticket.year,
        ticket.department,
        ticket.email,
      ];

      tableRows.push(ticketData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 90 });

    doc.addFont("Helvetica", "Helvetica", "");
    doc.setFontSize(22);
    doc.setFont("Helvetica", "bold");
    doc.text("Course Students Report", 15, 20);
    doc.save(`report.pdf`);
  };

  const postMaterial = () => {
    if (isAssignment) {
      if (
        !(
          validateDescription() &&
          validateMarks() &&
          validateTitle() &&
          dueDate !== null
        )
      ) {
        toast.error("Form is invalid");
        return;
      }
    } else if (isQuiz) {
    } else {
      if (!(validateTitle() && validateDescription() && attachment)) {
        toast.error("Form is invalid");
        return;
      }
    }

    let materialData = {
      course_id: courseID,
      title: title,
      description: description,
      due_date: dueDate,
      max_marks: maxMarks,
      is_assignment: isAssignment,
    };

    Axios.post("/api/assignment", materialData)
      .then((res) => {
        var formData = new FormData();
        formData.append("file", attachment);
        Axios.post(
          `/api/assignment/attachment/${res.data.data._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data;",
            },
          }
        )
          .then((res1) => {
            if (isAssignment === true) {
              toast.success("New assignment successfully created");
            } else if (isAssignment === false) {
              toast.success("New study material successfully created");
            }
          })
          .catch((err) => {
            if (isAssignment === false) {
              toast.error("Attachment error");
              Axios.delete(`/api/assignment/${res.data.data._id}`)
                .then(() => {
                  console.log("Assignment with invalid attachment deleted");
                })
                .catch(() => {});
            }
          });
        setAttachment(null);
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error creating new material");
        setIsOpen(false);
      });
  };

  const removeStudent = (student_id, course_id) => {
    Axios.post("/api/removeStudent", {
      student_id: student_id,
      course_id: course_id,
    })
      .then((res) => {
        if (res.data.success) {
          toast.success("Removed successfully");
        } else {
          toast.error("Error");
        }
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Error removing student");
      });
  };

  const deleteCourse = (course_code, course_id) => {
    Axios.delete(`/api/course/${course_id}`)
      .then((res) => {
        if (res.data.success) {
          toast.success("Course deleted successfully");
          window.location.href = "/home";
        } else {
          toast.error("Error removing course");
        }
      })
      .catch(() => {
        toast.error("Error removing course");
      });
  };

  const handleFileUpload = (event) => {
    if (event) {
      setAttachment(event.target.files[0]);
    } else {
      setAttachment(null);
    }
  };

  const changeCourseName = () => {
    if (!newCourseName.length) {
      return toast.error("New Course Name cannot be empty");
    }

    const url = `/api/course/changeName/${courseID}`;
    Axios.post(url, {
      name: newCourseName,
    })
      .then((res) => {
        if (res.data.success) {
          toast.success("Course Name updated");
          setNewCourseName("");
          closeCourseNameModal();
        } else {
          return toast.error("Error in updating course name");
        }
      })
      .catch(() => toast.error("Error in updating course name"));
  };

  const changeCourseNameStyles = {
    content: {
      position: "absolute",
      top: "35%",
      left: "30%",
      right: "30%",
      bottom: "35%",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "10px",
      outline: "none",
      padding: "25px",
      alignSelf: "center",
      height: "40%",
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

  const sendMessage = () => {
    if (!message.length) return;

    let loc = window.location.href.split("/");
    setMessage("");
    const obj = {
      user_id: user._id,
      user_name: user.fName.concat(" ").concat(user.lName),
      user_type: userType,
      message_content: message.trim(),
      time_stamp: new Date().getTime().toString(),
      course_id: loc[loc.length - 1],
    };
    Axios.post(`/api/message`, obj).then((res) => {
      if (res.data.success) {
      }
      Axios.get(`/api/messages/${loc[loc.length - 1]}`).then((res) => {
        if (res.data.success) {
          setMessages(res.data.data);
        }
      });
    });
  };

  return (
    <React.Fragment>
      {index === 1 ? (
        <div
          className={"background boxshadowtop"}
          style={{
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            width: "80%",
            height: 75,
            position: "fixed",
            bottom: 0,
            margin: "0 auto",
            zIndex: 999,
            display: "flex",
            flexDirection: "row",
            marginLeft: "20%",
            padding: "5px 10px",
            paddingTop: 15,
          }}
        >
          <input
            style={{
              width: "96%",
              marginRight: 5,
              marginTop: 0,
              paddingLeft: 10,
            }}
            placeholder="Type a message..."
            autofocus={index == 1}
            value={message}
            onChange={(t) => setMessage(t.target.value)}
            onKeyDown={(e) => {
              if (["Enter"].includes(e.key)) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            style={{
              width: 45,
              height: 45,
              borderRadius: 25,
              marginTop: 0,
              marginLeft: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="background"
            onClick={sendMessage}
          >
            <Send
              size={23}
              color={message.length ? "#6C63FF" : "#ababab"}
              style={{
                transform: "rotate(45deg)",
                marginRight: 5,
                transition: "0.2s ease",
              }}
            />
          </button>
        </div>
      ) : null}

      <div className="course-container">
        {userType === "teacher" ? (
          <React.Fragment>
            <div
              className="new-post"
              style={{
                position: "absolute",
                zIndex: 999,
                top: 100,
                borderRadius: 5,
                right: 20,
                display: "flex",
                flexDirection: "row",
                padding: "5px 15px",
                width: "auto",
                height: 45,
                alignItems: "center",
                boxShadow: "none",
                paddingLeft: 10,
              }}
              onClick={openModal}
            >
              <Plus className="tab" size={22} />
              <p
                className="tab"
                style={{
                  fontFamily: "Poppins",
                  color: "white",
                  fontWeight: 600,
                  letterSpacing: 0.6,
                  fontSize: 16,
                  margin: 0,
                  padding: 0,
                  marginLeft: 5,
                  marginRight: 5,
                }}
              >
                Post
              </p>
            </div>
          </React.Fragment>
        ) : null}
        <div
          style={{
            position: "absolute",
            top: 105,
            right: 20,
            display: "flex",
            flexDirection: "row",
            marginRight: userType === "teacher" ? 100 : 0,
          }}
        >
          {userType === "student" ? (
            <Link to={`/home`}>
              <div
                onClick={() => {
                  removeStudent(user._id, courseID);
                }}
                className="settings-icon"
              >
                <LogOut size={25} color="#6C63FF" style={{}} />
              </div>
            </Link>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
              }}
            >
              <Link to={`/home`}>
                <div className="settings-icon">
                  <Trash2
                    size={20}
                    color="#6C63FF"
                    style={{}}
                    onClick={() => {
                      deleteCourse(courseInfo.course_code, courseID);
                    }}
                  />
                </div>
              </Link>
              <div className="settings-icon" style={{ marginRight: 0 }}>
                <Edit3
                  size={21}
                  color="#6C63FF"
                  style={{ cursor: "pointer" }}
                  className="changeColor"
                  onClick={openCourseNameModal}
                />
              </div>
            </div>
          )}
        </div>

        <div className="course-heading-block">
          <div
            style={{
              width: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 0,
            }}
          >
            <div>
              <h2 className="course-title">{courseInfo.name}</h2>
            </div>
          </div>

          <h4
            style={{
              color: "#434343",
              fontFamily: "Poppins",
              fontWeight: 500,
              margin: 0,
              padding: 0,
              marginTop: 5,
              fontSize: 20,
            }}
            className="heading"
          >
            {courseInfo.year} {courseInfo.department}
          </h4>
          <div className="instructor-box">
            <div
              className="changeColorBG"
              style={{
                width: 40,
                height: 40,
                borderRadius: 25,
                backgroundColor: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexDirection: "row",
              }}
            >
              <img
                className="changeColorBG"
                src={randomUser}
                style={{ width: 35, height: 35, marginRight: 0, marginTop: 5 }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "#878787",
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                }}
              >
                INSTRUCTOR
              </p>
              <h6
                style={{
                  fontSize: 17,
                  color: "#232323",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  margin: 0,
                  padding: 0,
                }}
                className="heading"
              >
                {courseTeacher.fName} {courseTeacher.lName}
              </h6>
            </div>
          </div>

          <p
            style={{
              fontSize: 17,
              color: "#232323",
              fontFamily: "Poppins",
              fontWeight: 600,
              margin: 0,
              padding: 0,
              marginTop: 20,
            }}
            className="heading"
          >
            Description
          </p>
          <p
            style={{
              fontSize: 16,
              color: "#878787",
              fontFamily: "Mulish",
              fontWeight: 500,
              margin: 0,
              padding: 0,
              marginTop: 5,
              textAlign: "left",
            }}
            className="sub"
          >
            {courseInfo.description}
          </p>
          <div
            className="students-box"
            style={{ marginBottom: 0, paddingBottom: 0, marginTop: 10 }}
          >
            <div
              className="students-box-circle"
              style={{ marginLeft: 0, background: "#6C63FF" }}
            >
              <img src={userImage} />
            </div>
            <div
              className="students-box-circle"
              style={{
                marginLeft: 17,
                background: "#0F98D9",
                transform: "scale(1.02)",
              }}
            >
              <img src={userImage3} />
            </div>
            <div
              className="students-box-circle"
              style={{
                marginLeft: 34,
                background: "#545454",
                transform: "scale(1.05)",
              }}
            >
              <img src={userImage4} />
            </div>
            <p
              className="sub"
              style={{
                marginLeft: 70,
                fontFamily: "Poppins",
                fontSize: 13.5,
                color: "#434343",
                fontWeight: 500,
                marginTop: 30,
                letterSpacing: 0.3,
              }}
            >
              {courseStudents.length ? courseStudents.length : 0} student(s)
              enrolled
            </p>
          </div>
        </div>

        <div style={{ width: "100%", marginTop: 0 }}>
          <AntTabs
            value={index}
            fullWidth
            onChange={handleChange}
            variant="scrollable"
          >
            <AntTab label={<div> Stream </div>} />
            <AntTab label={<div> Discuss </div>} />
            <AntTab label={<div> Assignments </div>} />
            <AntTab label={<div> Study Material </div>} />
            <AntTab label={<div> Quiz </div>} />
            <AntTab label={<div> People </div>} />
          </AntTabs>
          <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
            <div style={Object.assign({}, styles.slide, styles.slide1)}>
              {posts.length
                ? posts.map((item, index) => {
                    return (
                      <Post
                        postType={
                          item.is_assignment ? "assignment" : "studymaterial"
                        }
                        title={item.title}
                        info={item.description}
                        assID={item._id}
                        forceUpdate={forceUpdate}
                      />
                    );
                  })
                : null}
              {!posts.length ? (
                <EmptyStateSmall
                  title="No Posts"
                  d1="Teacher has not posted anything in this course yet"
                />
              ) : null}
            </div>

            <div style={Object.assign({}, styles.slide)}>
              {messages.map((m, index) => {
                return (
                  <Message
                    name={m.user_name}
                    message={m.message_content}
                    time={m.time_stamp}
                    userType={m.user_type}
                    userID={m.user_id}
                    prev={index > 0 ? messages[index - 1] : null}
                  />
                );
              })}
            </div>

            <div style={Object.assign({}, styles.slide)}>
              {posts.filter((p) => p.is_assignment === true).length ? (
                posts
                  .filter((p) => p.is_assignment === true)
                  .map((item, index) => {
                    return (
                      <Post
                        postType={
                          item.is_assignment ? "assignment" : "studymaterial"
                        }
                        title={item.title}
                        info={item.description}
                        assID={item._id}
                      />
                    );
                  })
              ) : (
                <EmptyStateSmall
                  title="No Assignments"
                  d1="Teacher has not posted any assignments in this course yet"
                />
              )}
            </div>

            <div style={Object.assign({}, styles.slide)}>
              {posts.filter((p) => p.is_assignment === false).length ? (
                posts
                  .filter((p) => p.is_assignment === false)
                  .map((item, index) => {
                    return (
                      <Post
                        postType={
                          item.is_assignment ? "assignment" : "studymaterial"
                        }
                        title={item.title}
                        info={item.description}
                        assID={item._id}
                      />
                    );
                  })
              ) : (
                <EmptyStateSmall
                  title="No Study Material"
                  d1="Teacher has not posted any study material in this course yet"
                />
              )}
            </div>

            <div style={Object.assign({}, styles.slide, styles.slide2)}>
              {quizzes.length ? (
                quizzes.map((item, index) => {
                  return (
                    <Post
                      postType={"quiz"}
                      title={item.quiz_title}
                      info=""
                      quizID={item._id}
                      isActive={item.is_active}
                      noOfQues={item.number_of_questions}
                      totalMarks={item.total_marks}
                    />
                  );
                })
              ) : (
                <EmptyStateSmall
                  title="No Quiz"
                  d1="Teacher has not posted any quizzes in this course yet"
                />
              )}
            </div>

            <div style={Object.assign({}, styles.slide, styles.slide3)}>
              {userType === "teacher" ? (
                <React.Fragment>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      fontFamily: "Poppins",
                      height: "40px",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <p
                      className="sub"
                      style={{
                        fontSize: 16,
                        color: "#232323",
                        fontWeight: 600,
                        textAlign: "left",
                        paddingTop: 20,
                        marginBottom: 15,
                        marginRight: 5,
                      }}
                    >
                      Download Course Students' Report{" "}
                    </p>
                    <button
                      onClick={() => generatePDF(courseStudents)}
                      className={"settings-icon changeColorBG"}
                      style={{ padding: 0 }}
                    >
                      <Download size={18} color="#6C63FF" />
                    </button>
                  </div>
                  <p
                    className="changeColor"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      color: "#232323",
                      fontWeight: 600,
                      margin: 0,
                      padding: 0,
                      textAlign: "left",
                      marginTop: 10,
                      marginBottom: 15,
                    }}
                  >
                    Add more students
                  </p>
                  <div
                    className="changeColorBG"
                    style={{
                      width: 200,
                      height: 40,
                      borderRadius: 5,
                      display: "flex",
                      flexDirection: "row-reverse",
                      alignItems: "center",
                      marginTop: 10,
                      overflow: "hidden",
                      paddingLeft: 10,
                      justifyContent: "space-between",
                      marginBottom: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        borderRadius: 0,
                        height: 40,
                        backgroundColor: "#ddd",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Copy
                        size={22}
                        color="#434343"
                        onClick={() => {
                          navigator.clipboard.writeText(courseInfo.course_code);
                          toast.info("Course code copied to clipboard");
                        }}
                      />
                    </div>
                    <p
                      className="sub"
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 17,
                        color: "#434343",
                        fontWeight: 600,
                        verticalAlign: "middle",
                        margin: 0,
                        padding: 0,
                        letterSpacing: 0.3,
                      }}
                    >
                      {courseInfo.course_code ? courseInfo.course_code : ""}
                    </p>
                  </div>

                  <p
                    style={{
                      fontFamily: "Mulish",
                      fontSize: 16,
                      color: "#878787",
                      fontWeight: 600,
                      verticalAlign: "middle",
                      margin: 0,
                      padding: 0,
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                  >
                    Copy this code and share with the students. They can use
                    this code to join this course.
                  </p>
                </React.Fragment>
              ) : null}

              <p
                className="changeColor"
                style={{
                  fontFamily: "Poppins",
                  fontSize: 16,
                  color: "#232323",
                  fontWeight: 600,
                  margin: 0,
                  padding: 0,
                  textAlign: "left",
                  marginTop: 20,
                  marginBottom: 15,
                }}
              >
                Students enrolled in Course
              </p>

              {courseStudents.length ? (
                courseStudents.map((student, index) => {
                  let name = student.fName + " " + student.lName;
                  return (
                    <div className="student-box" key={index}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div className={"student-box-photo changeColorBG"}>
                          <img
                            src={getRandomUser()}
                            style={{ width: 35, height: 35, marginTop: 4 }}
                          />
                        </div>
                        <h5 className="changeColor">{name}</h5>
                      </div>
                      {userType === "teacher" ? (
                        <React.Fragment>
                          <UserX
                            onClick={() => {
                              removeStudent(student._id, courseID);
                            }}
                            size={22}
                            style={{ cursor: "pointer" }}
                            className="remove-user-icon"
                          />
                        </React.Fragment>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <EmptyStateSmall
                  title="No students"
                  d1="There are no students enrolled in this course"
                  d2="Share the course code with students so that they can join"
                />
              )}
            </div>
          </SwipeableViews>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles3}
          contentLabel="Modal"
          closeTimeoutMS={200}
          className="background"
        >
          <div
            style={{
              width: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              className="changeColorBG"
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "5rem",
                backgroundColor: "#eeeeee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <FileText size={25} color="#6C63FF" />
            </div>
            <div style={{ marginLeft: "1rem" }}>
              <h2
                className="changeColor"
                style={{
                  textAlign: "left",
                  fontFamily: "Poppins",
                  color: "#232323",
                  fontWeight: 600,
                  fontSize: 22,
                  padding: 0,
                  marginBottom: 0,
                }}
              >
                Post New Material
              </h2>
              <p
                className="grey"
                style={{
                  fontFamily: "Mulish",
                  fontSize: 16,
                  color: "#878787",
                  fontWeight: 600,
                  margin: 0,
                  padding: 0,
                  marginTop: 5,
                }}
              >
                Create new study material, assignment or quiz
              </p>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <label
                class={"checkbox-container sub"}
                style={{
                  borderColor: !isAssignment && !isQuiz ? "#6C63FF" : "",
                }}
              >
                <Book size={22} style={{ marginRight: 15 }} className="sub" />
                Study Material
                <input
                  type="checkbox"
                  onClick={() => {
                    setIsAssignment(false);
                    setIsQuiz(false);
                  }}
                  checked={!isAssignment && !isQuiz}
                />
                <span class="checkmark" style={{ right: 0, left: 180 }}></span>
              </label>
              <label
                class={"checkbox-container sub"}
                style={{
                  borderColor: isAssignment && !isQuiz ? "#6C63FF" : "",
                }}
              >
                <FileText
                  size={22}
                  style={{ marginRight: 15 }}
                  className="sub"
                />
                Assignment
                <input
                  type="checkbox"
                  onClick={() => {
                    setIsAssignment(true);
                    setIsQuiz(false);
                  }}
                  checked={isAssignment && !isQuiz}
                />
                <span class="checkmark" style={{ right: 0, left: 160 }}></span>
              </label>
              <label
                class={"checkbox-container sub"}
                style={{ borderColor: isQuiz ? "#6C63FF" : "" }}
              >
                <HelpCircle
                  size={22}
                  style={{ marginRight: 15 }}
                  className="sub"
                />
                Quiz
                <input
                  type="checkbox"
                  onClick={() => {
                    setIsQuiz(!isQuiz);
                  }}
                  checked={isQuiz}
                />
                <span class="checkmark" style={{ right: 0, left: 100 }}></span>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            {!isQuiz ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "60%",
                  marginRight: 25,
                }}
              >
                <p
                  className="changeColor"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 16,
                    color: "#232323",
                    fontWeight: 600,
                    margin: 0,
                    padding: 0,
                    textAlign: "left",
                    marginTop: 20,
                    marginBottom: 0,
                  }}
                >
                  Title
                </p>
                <input
                  type="text"
                  style={{ height: 40, width: "100%" }}
                  onChange={(t) => setTitle(t.target.value)}
                ></input>
              </div>
            ) : null}

            {isAssignment && !isQuiz ? (
              <React.Fragment>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "25%",
                    marginRight: 25,
                  }}
                >
                  <p
                    className="changeColor"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      color: "#232323",
                      fontWeight: 600,
                      margin: 0,
                      padding: 0,
                      textAlign: "left",
                      marginTop: 20,
                      marginBottom: 0,
                    }}
                  >
                    Due date of assignment
                  </p>
                  <DayPickerInput
                    onDayChange={handleDueDateChange}
                    style={{ fontFamily: "Poppins", fontSize: 14 }}
                    navbarElement={<ArrowLeft size={15} />}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "15%",
                  }}
                >
                  <p
                    className="changeColor"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      color: "#232323",
                      fontWeight: 600,
                      margin: 0,
                      padding: 0,
                      textAlign: "left",
                      marginTop: 20,
                      marginBottom: 0,
                    }}
                  >
                    Max marks
                  </p>
                  <input
                    type="text"
                    style={{ height: 40, width: "100%" }}
                    onChange={(t) => setMaxMarks(t.target.value)}
                    onBlur={() =>
                      validateMarks()
                        ? null
                        : toast.error("Marks cannot be empty")
                    }
                  ></input>
                </div>
              </React.Fragment>
            ) : null}
          </div>

          {!isQuiz ? (
            <React.Fragment>
              <p
                className="changeColor"
                style={{
                  fontFamily: "Poppins",
                  fontSize: 16,
                  color: "#232323",
                  fontWeight: 600,
                  margin: 0,
                  padding: 0,
                  textAlign: "left",
                  marginTop: 20,
                  marginBottom: 0,
                }}
              >
                Description
              </p>
              <input
                type="text"
                style={{ height: 40 }}
                onChange={(t) => setDescription(t.target.value)}
              ></input>
            </React.Fragment>
          ) : null}

          <p
            className="changeColor"
            style={{
              fontFamily: "Poppins",
              fontSize: 16,
              color: "#232323",
              fontWeight: 600,
              margin: 0,
              padding: 0,
              textAlign: "left",
              marginTop: 35,
              marginBottom: 0,
              display: isQuiz ? "none" : "block",
            }}
          >
            Add attachment{" "}
            <span style={{ fontSize: 14, fontWeight: 400, color: "#232323" }}>
              (Supported Type : PDF, Max Size : 10 MB)
            </span>
          </p>

          {isQuiz ? null : attachment ? null : (
            <button
              className="changeColorBG"
              style={{
                backgroundColor: "transparent",
                border: "0px solid #eee",
                boxShadow: "none",
                padding: "5px 10px",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                overflow: "hidden",
                height: 40,
              }}
            >
              <input
                type="file"
                onChange={handleFileUpload}
                className="file-upload"
              />
              <Plus
                size={18}
                className="changeColor"
                style={{ marginRight: 10 }}
              />
              <p
                className="changeColor"
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#6C63FF",
                  margin: 0,
                  fontFamily: "Mulish",
                }}
              >
                Upload file
              </p>
            </button>
          )}

          {attachment && !isQuiz ? (
            <div
              className="uploaded-file"
              style={{ width: "40%", marginTop: 10 }}
            >
              <h6>{attachment.name}</h6>
              <X
                size={22}
                color="#878787"
                style={{ width: "10%", cursor: "pointer" }}
                onClick={() => handleFileUpload(null)}
              />
            </div>
          ) : null}

          {isQuiz ? (
            <ul style={{ margin: 0, padding: 0, marginLeft: 0, marginTop: 30 }}>
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
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  Quiz can be started at any time post creation
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
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  Quiz can have two types of questions, multiple choice
                  questions (MCQ) or textual questions
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
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  For textual or theoretical questions, provide some keywords
                  based upon which the student responses will be autograded
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
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  Each MCQ carries one mark while the marks for textual
                  questions have to be specified
                </p>
              </li>
            </ul>
          ) : null}

          <div
            style={{
              bottom: 10,
              right: 10,
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => {
                if (isQuiz) window.location.href = `/createQuiz/${courseID}`;
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
                onClick={postMaterial}
              >
                Create
              </p>
            </button>
            <button
              style={{ boxShadow: "none", backgroundColor: "transparent" }}
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
        </Modal>
        <Modal
          isOpen={courseNameModalIsOpen}
          onRequestClose={closeCourseNameModal}
          style={changeCourseNameStyles}
          contentLabel="Modal"
          closeTimeoutMS={200}
          className="background"
        >
          <div>
            <p
              className="sub"
              style={{
                fontFamily: "Poppins",
                fontSize: 15,
                fontWeight: 500,
                margin: 0,
                padding: 0,
                textAlign: "left",
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              Change Course Name
            </p>
            <input
              type="text"
              placeholder="Enter new course name.."
              style={{ height: 40, marginTop: 30 }}
              value={newCourseName}
              onChange={(t) => setNewCourseName(t.target.value)}
            ></input>

            <div
              style={{
                bottom: 25,
                right: 25,
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
              }}
            >
              <button onClick={changeCourseName}>
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
                  Save
                </p>
              </button>
              <button
                style={{ backgroundColor: "transparent", boxShadow: "none" }}
                onClick={closeCourseNameModal}
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
          <X
            size={25}
            color="#ababab"
            style={{
              position: "absolute",
              top: 25,
              right: 25,
              cursor: "pointer",
            }}
            onClick={closeCourseNameModal}
          />
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default Course;
