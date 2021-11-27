import React, { useState } from "react";
import { X, Download, Upload, Edit3 } from "react-feather";
import { getRandomUser } from "./random";
import { toast } from "react-toastify";
import Axios from "axios";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { customStyles } from "./CustomModalStyles";
import "./css/Course.css";
import { Error } from "mongoose";

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

const AssignmentDetails = () => {
  const [submission, setSubmission] = useState(null);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [modalIsOpen, setModal] = React.useState(false);
  const [marks, setmarks] = React.useState("");
  const [maxMarks, setMaxMarks] = React.useState(null);
  const [ignored, setIgnored] = React.useState(0);
  const [assignment, setAssignment] = useState({});
  const [studentCount, setStudentCount] = useState(0);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [notSubmitted, setNotSubmitted] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [currentStudent, setCurrentStudent] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  let arr = window.location.href.split("/");
  let assignmentID = arr[arr.length - 1];
  const forceUpdate = React.useCallback(() => setIgnored((v) => v + 1), []);
  const onChangemarks = (e) => setmarks(e.target.value);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const validateMarks = () => {
    let isValid = true;
    if (!marks.length) {
      isValid = false;
    }
    if (marks > maxMarks) {
      isValid = false;
    }
    return isValid;
  };

  React.useEffect(() => {
    Axios.get(`/api/assignment/${assignmentID}`)
      .then((res) => {
        let a = res.data.data;
        const course_id = a.course_id;

        Axios.get(`/api/${course_id}`)
          .then((res) => {
            let a = res.data.data[0].count;
            setStudentCount(a);
          })
          .catch(() => {
			//   console.log("error")
		  });
        setCourseId(a.course_id);
        setAssignment(a);
        setMaxMarks(a.max_marks);
      })
      .catch(() => {
		//   console.log("error")
	  });
  }, [ignored]);

  React.useEffect(() => {
    checkAttachment();
    if (userType === "student") checkHasSubmitted();
    Axios.get(`/api/marks/${assignmentID}`)
      .then((res) => {
        let a = res.data;
        console.log("courseId", courseId);
        Axios.get(`/api/assignment/students/${assignmentID}`)
          .then((res) => {
            let students = res.data.data;
            let unsubmitted = students.filter((student) => {
              let include = true;
              if (a.submitted && a.submitted.length) {
                a.submitted.map((s) => {
                  if (s.student_id == student._id) include = false;
                });
              }
              return include;
            });
            setStudentSubmissions(a.submitted);
            setNotSubmitted(unsubmitted);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(() => console.log("error"));
  }, [ignored, hasAttachment, submission, modalIsOpen]);

  const sendMarks = () => {
    if (!validateMarks()) {
      toast.error("Invalid marks");
      return;
    }

    Axios.post(
      `/api/submission/grade/${assignmentID}/${currentStudent.student_id}`,
      {
        marks: marks,
      }
    )
      .then((res) => {
        if (res.data) {
          toast.success("Successfully saved the grades!");
        } else {
          toast.error("Unable to grade the submission!");
        }
        setModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to grade the submission!");
      });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmission = (event) => {
    if (event) {
      setSubmission(event.target.files[0]);
    } else {
      setSubmission(null);
    }
  };

  const submitAssignment = () => {
    var formData = new FormData();
    formData.append("file", submission);
    let diff = new Date(assignment.due_date).getTime() - new Date().getTime();
    if (diff < 0) {
      return toast.error("Submission is not allowed past due date");
    }
    if (submission.type !== "application/pdf") {
      return toast.error("Only PDF files are allowed");
    }
    Axios.post(`/api/submission`, {
      assignment_id: assignmentID,
      student_id: user._id,
    })
      .then((res) => {
        Axios.post(
          `/api/submission/attachment/${res.data.data._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data;",
            },
          }
        )
          .then((res2) => {
            if (res2.status === 200)
              toast.success("File submitted successfully");
            setSubmission(null);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error");
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkAttachment = () => {
    Axios.get(`/api/hasAttachment/${assignmentID}`)
      .then((res) => {
        if (res.data.success) {
          setHasAttachment(res.data.file_exists);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkHasSubmitted = () => {
    Axios.get(`/api/hasSubmitted/${assignmentID}/${user._id}`)
      .then((res) => {
        if (res.data.success) setHasSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="course-container">
      <div
        className="course-heading-block"
        style={{ flexDirection: "row", paddingRight: 0 }}
      >
        <div
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            marginRight: "5%",
          }}
        >
          {/* <ArrowLeft size={27} className="sub" style={{marginBottom: 25, cursor: "pointer"}} onClick={() => window.location.href = `/course/${courseId}`}/> */}
          <h2 className="course-title">{assignment.title}</h2>
          <p
            className="heading"
            style={{
              fontSize: 17,
              color: "#232323",
              fontFamily: "Poppins",
              fontWeight: 600,
              margin: 0,
              padding: 0,
              marginTop: 25,
            }}
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
            }}
          >
            {assignment.description}
          </p>
          <br />
          <p
            style={{
              cursor: "pointer",
              fontSize: 16,
              color: "#6C63FF",
              fontFamily: "Poppins",
              fontWeight: 600,
              margin: 0,
              padding: 0,
              marginTop: 5,
            }}
          >
            Due {formatDate(assignment.due_date)}
          </p>
          <br />
          {userType === "teacher" ? (
            <reactFragment>
              <Link
                to={{
                  pathname: `/assessmentreport/${assignmentID}`,
                  state: {
                    courseId,
                  },
                }}
              >
                <button
                  style={{
                    padding: "8px 15px",
                    marginLeft: 0,
                    marginTop: 0,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 15,
                      color: "white",
                      margin: 0,
                      padding: 0,
                      letterSpacing: 0.4,
                    }}
                  >
                    Assessment Report
                  </p>
                </button>
              </Link>
            </reactFragment>
          ) : null}

          <br></br>
          {hasAttachment === true ? (
            <reactFragment>
              <br />
              <a
                href={`/api/assignment/attachment/${assignmentID}`}
                target="_blank"
              >
                <button
                  style={{
                    padding: "8px 15px",
                    marginLeft: 0,
                    marginTop: 0,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 15,
                      color: "white",
                      margin: 0,
                      padding: 0,
                      letterSpacing: 0.4,
                    }}
                  >
                    Download Attachment
                  </p>
                </button>
              </a>
            </reactFragment>
          ) : null}
        </div>

        <div className="assignment-upload">
          <h5 className="heading">
            {userType === "student" ? (
              hasSubmitted ? (
                <h6
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#6C63FF",
                    fontFamily: "Poppins",
                    textAlign: "center",
                  }}
                >
                  Work submitted successfully
                </h6>
              ) : (
                "My Submission"
              )
            ) : (
              <span>Student Submissions</span>
            )}
          </h5>
          {userType === "student" ? (
            <React.Fragment>
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
                <input type="file" onChange={handleSubmission} />
                <Upload
                  size={18}
                  className="changeColor"
                  style={{ marginRight: 10 }}
                />
                <p
                  className="changeColor"
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#6C63FF",
                    margin: 0,
                    fontFamily: "Poppins",
                  }}
                >
                  Upload PDF
                </p>
              </button>
              {submission ? (
                <div className="uploaded-file">
                  <h6>{submission.name}</h6>
                  <X
                    size={22}
                    color="#878787"
                    style={{ width: "10%" }}
                    onClick={() => handleSubmission(null)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ) : null}

              <button
                style={{
                  padding: "9px 10px",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 20,
                }}
                onClick={submitAssignment}
                disabled={hasSubmitted}
              >
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "white",
                    margin: 0,
                    fontFamily: "Poppins",
                  }}
                >
                  Submit
                </p>
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <br />
              {studentCount != null ? (
                <React.Fragment>
                  {studentSubmissions.map((item, index) => {
                    let name = item.fName.concat(" ").concat(item.lName);
                    return (
                      <div
                        className="student-box"
                        key={index}
                        style={{ justifyContent: "space-between" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            className={"student-box-photo changeColorBG"}
                            style={{ width: 35, height: 35 }}
                          >
                            <img
                              className="changeColorBG"
                              src={getRandomUser()}
                              style={{ width: 30, height: 30, marginTop: 3 }}
                            />
                          </div>
                          <h5 style={{ fontSize: 15 }} className="heading">
                            {name}
                          </h5>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <a
                            href={`/api/submission/getAttachment/${assignmentID}/${item.student_id}`}
                            target="_blank"
                          >
                            <Download
                              size={20}
                              className="sub"
                              style={{ cursor: "pointer" }}
                            />
                          </a>
                          {item.marks_obtained ? (
                            <div
                              style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: "#6C63FF",
                                marginLeft: 20,
                                marginRight: 5,
                              }}
                            >
                              {item.marks_obtained}
                            </div>
                          ) : (
                            <button
                              style={{
                                padding: "8px 15px",
                                marginLeft: 20,
                                marginTop: 0,
                              }}
                              onClick={() => {
                                openModal();
                                setCurrentStudent(item);
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: 15,
                                  color: "white",
                                  margin: 0,
                                  padding: 0,
                                  letterSpacing: 0.4,
                                }}
                              >
                                Grade
                              </p>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ) : null}
            </React.Fragment>
          )}
          {userType === "student" ? null : <br />}
          <h5
            className="heading"
            style={{ marginBottom: userType === "student" ? 0 : 10 }}
          >
            {userType === "student" ? null : <span>Pending submissions</span>}
          </h5>
          {userType === "student" ? null : (
            <React.Fragment>
              <br />

              {studentCount != null ? (
                <React.Fragment>
                  {notSubmitted.map((item, index) => {
                    let name = item.fName.concat(" ").concat(item.lName);
                    return (
                      <div
                        className="student-box"
                        key={index}
                        style={{ justifyContent: "space-between" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            className={"student-box-photo changeColorBG"}
                            style={{ width: 35, height: 35 }}
                          >
                            <img
                              className="changeColorBG"
                              src={getRandomUser()}
                              style={{ width: 30, height: 30, marginTop: 3 }}
                            />
                          </div>
                          <h5 style={{ fontSize: 15 }} className="heading">
                            {name}
                          </h5>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ) : null}
            </React.Fragment>
          )}
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
              width: "2rem",
              height: "2rem",
              borderRadius: "5rem",
              backgroundColor: "#eeeeee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Edit3 size={18} color="#6C63FF" />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <h2
              className="changeColor"
              style={{
                textAlign: "left",
                fontFamily: "Poppins",
                color: "#232323",
                fontWeight: 500,
                fontSize: 20,
                padding: 0,
                marginBottom: 0,
              }}
            >
              Grade Assignment
            </h2>
          </div>
        </div>

        <div
          className="file-box"
          style={{
            height: "auto",
            alignItems: "center",
            borderWidth: 0,
            padding: "10px 0",
          }}
        >
          <div className="file-box-info">
            <h5 className="changeColor" style={{ fontSize: 16 }}>
              {assignment.title}
            </h5>
          </div>
          <div
            className="instructor-box"
            style={{ marginTop: 0, flexDirection: "row-reverse" }}
          >
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
                src={getRandomUser()}
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
                className="sub"
                style={{
                  fontSize: 13,
                  color: "#878787",
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                }}
              >
                SUBMITTED BY
              </p>
              <h6
                className="changeColor"
                style={{
                  fontSize: 17,
                  color: "#232323",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  margin: 0,
                  padding: 0,
                }}
              >
                {currentStudent.fName} {currentStudent.lName}
              </h6>
            </div>
          </div>
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
            marginTop: 20,
            marginBottom: 0,
          }}
        >
          Marks out of {assignment.max_marks}
        </p>
        <input
          type="text"
          style={{ height: 40, width: "50%" }}
          autoFocus
          onChange={onChangemarks}
        ></input>

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
          <button>
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "white",
                margin: 0,
                fontFamily: "Poppins",
                letterSpacing: 0.8,
              }}
              onClick={sendMarks}
            >
              Save marks
            </p>
          </button>
          <button
            style={{ backgroundColor: "transparent", boxShadow: "none" }}
            onClick={closeModal}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
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

export default AssignmentDetails;
