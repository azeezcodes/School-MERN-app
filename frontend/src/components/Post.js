import React from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileText,
  Book,
  HelpCircle,
  ChevronRight,
  Trash2,
} from "react-feather";

const Post = ({
  postType,
  title,
  info,
  assID,
  quizID,
  noOfQues,
  totalMarks,
  isActive,
  courseId,
  studentId,
  forceUpdate,
}) => {
  const icon =
    postType === "assignment" ? (
      <FileText size={25} color="#6C63FF" />
    ) : postType === "quiz" ? (
      <HelpCircle size={25} color="#6C63FF" />
    ) : (
      <Book size={25} color="#6C63FF" />
    );
  let userType = JSON.parse(localStorage.getItem("userType"));
  if (postType === "studymaterial") postType = "study material";
  let type = postType;
  if (!title.length) title = "";
  if (!info.length) info = "";
  const isAssignment = postType === "assignment";
  const isQuiz = postType === "quiz";
  if (isQuiz) type = "QUIZ";

  const deleteAssignment = () => {
    Axios.delete(`/api/assignment/${assID}`)
      .then((res) => {
        if (res.data.success) {
          toast.success("Assignment deleted successfully");
          forceUpdate();
        } else {
        }
      })
      .catch((error) => {
        toast.error("Unable to delete assignment");
      });
  };

  return (
    <React.Fragment>
      <div className="post-container">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <div className="post-image">
            <div className={"post-image-base changeColorBG"}>{icon}</div>
          </div>
          <div className="post-info">
            <h6
              className="sub"
              style={{ fontWeight: 500, fontSize: 14, letterSpacing: 0.6 }}
            >
              {type}
            </h6>
            <h3 style={{ marginTop: 5 }}>{title}</h3>
            {isQuiz ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p
                  className="sub"
                  style={{
                    fontSize: 13,
                    color: "#6C63FF",
                    fontFamily: "Poppins",
                    marginRight: 0,
                    fontWeight: 500,
                    verticalAlign: "middle",
                    marginBottom: 0,
                    marginTop: 0,
                    letterSpacing: 0.3,
                  }}
                >
                  {noOfQues} questions, {totalMarks} marks
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="post-options">
          {isAssignment ? (
            <React.Fragment>
              {userType === "teacher" ? (
                <div className="settings-icon">
                  <Trash2
                    size={22}
                    className="sub"
                    onClick={deleteAssignment}
                    style={{ margin: 0 }}
                  />
                </div>
              ) : null}
              <Link to={`/assignment/${assID}`}>
                <p
                  style={{
                    fontSize: 16,
                    color: "#6C63FF",
                    fontFamily: "Poppins",
                    marginRight: 0,
                    fontWeight: 500,
                    verticalAlign: "middle",
                    marginBottom: 0,
                    letterSpacing: 0.3,
                    marginTop: 5,
                  }}
                >
                  View assignment
                </p>
              </Link>
            </React.Fragment>
          ) : isQuiz ? (
            <React.Fragment>
              <Link to={`/quiz/${quizID}`}>
                <ChevronRight
                  size={30}
                  color="#6C63FF"
                  style={{ marginRight: -5, paddingRight: 0 }}
                />
              </Link>
              <p
                style={{
                  fontSize: 14,
                  color: isActive ? "#6C63FF" : "#7E7E7E",
                  fontFamily: "Poppins",
                  marginRight: isActive ? 15 : 0,
                  fontWeight: 500,
                  verticalAlign: "bottom",
                  marginBottom: 0,
                  marginLeft: 10,
                  backgroundColor: isActive ? "#6C63FF2a" : "",
                  textAlign: "center",
                  padding: "5px 15px",
                  letterSpacing: isActive ? 0.4 : 0.6,
                  borderRadius: 20,
                  marginTop: 5,
                }}
                className="changeColorBGnotimp"
              >
                {isActive ? "active" : "not active"}
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {userType === "teacher" ? (
                <div className="settings-icon" style={{ padding: 0 }}>
                  <Trash2
                    size={22}
                    className="sub"
                    onClick={deleteAssignment}
                    style={{ margin: 0 }}
                  />
                </div>
              ) : null}
              <a href={`/api/assignment/attachment/${assID}`} target="_blank">
                <p
                  style={{
                    fontSize: 16,
                    color: "#6C63FF",
                    fontFamily: "Poppins",
                    marginRight: 0,
                    fontWeight: 500,
                    verticalAlign: "middle",
                    marginBottom: 0,
                    letterSpacing: 0.3,
                    marginTop: 5,
                  }}
                >
                  View study material
                </p>
              </a>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Post;
