import React from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import userImage4 from "../assets/user.svg";
import EmptyState from "./EmptyState";
import CreateCourse from "./CreateCourse";
import CourseCard from "./CourseCard";
import "./css/Course.css";

let localdata = JSON.parse(localStorage.getItem("userDetails"));
let userType = JSON.parse(localStorage.getItem("userType"));
let theme = JSON.parse(localStorage.getItem("theme"));

let user = localdata
  ? localdata
  : {
      fName: "",
      lName: "",
      email: "",
      _id: "404",
    };
let { _id, year, department } = user;

const titleCase = (str) => {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
};

const MyCourses = () => {
  const [courses, setCourses] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState(null);
  const [courseTeachers, setCourseTeachers] = React.useState([]);
  const [studentCount, setStudentCount] = React.useState([]);
  const [ignoredVar, update] = React.useState(0);

  const forceUpdate = React.useCallback(() => update((v) => v + 1), []);

  React.useEffect(() => {
    Axios.get(`/api/${userType}/${_id}`, {
      header: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((res) => {
        if (res.data.success) {
          setUserInfo(res.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    Axios.get(`/api/fetchCourse/${userType}/${_id}`, {
      header: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
        }
      })
      .catch((error) => {});
  }, [ignoredVar]);

  const getTeachers = () => {
    let courseArray = [...courseTeachers];
    courses.map((course, index) => {
      Axios.get(`/api/teacher/${course.teacher_id}`, {
        header: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
        .then((res) => {
          courseArray[index] = res.data.data.fName
            .concat(" ")
            .concat(res.data.data.lName);
          setCourseTeachers(courseArray);
        })
        .catch(() => toast.error("Error"));
    });
  };

  const getStudentCount = () => {
    let courseArray = [...studentCount];
    courses.map((course, index) => {
      Axios.get(`/api/studentCount/${course._id}`, {
        header: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
        .then((res) => {
          courseArray[index] = res.data.data.count;
          setStudentCount(courseArray);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error");
        });
    });
  };

  React.useEffect(() => {
    getStudentCount();
    getTeachers();
  }, [courses]);

  return (
    <div className="course-container">
      <div
        style={{
          width: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginLeft: 15,
        }}
      >
        <div
          className="changeColorBG"
          style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "5rem",
            backgroundColor: "#eeeeee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={userImage4}
            style={{ width: "4.5rem", marginTop: 10 }}
            className="changeColorBG"
          />
        </div>
        <div style={{ marginLeft: "1rem" }}>
          <h2
            className="changeColor"
            style={{
              textAlign: "left",
              fontFamily: "Poppins",
              color: theme === "dark" ? "#eee" : "#232323",
              fontWeight: 600,
              fontSize: 28,
            }}
          >
            {userInfo ? userInfo.fName : null}{" "}
            {userInfo ? userInfo.lName : null}
          </h2>
          <p
            className="sub"
            style={{
              fontFamily: "Poppins",
              fontSize: 17,
              color: "#545454",
              fontWeight: 600,
              margin: 0,
              textAlign: "left",
            }}
          >
            {titleCase(userType)}
          </p>
          <p
            className="sub"
            style={{
              fontFamily: "Poppins",
              fontSize: 16,
              color: "#545454",
              fontWeight: 500,
              margin: 0,
              textAlign: "left",
            }}
          >
            {year} {department}
          </p>
        </div>
      </div>

      <p
        className="sub"
        style={{
          fontSize: 18,
          letterSpacing: 0.4,
          color: "#545454",
          fontFamily: "Poppins",
          fontWeight: 600,
          margin: 0,
          padding: 0,
          marginTop: 35,
          marginBottom: 5,
          marginLeft: 20,
          display: courses.length ? "block" : "none",
        }}
      >
        MY COURSES
      </p>
      <div className="my-courses-box" style={{ paddingLeft: 5 }}>
        {courses
          ? courses.map((course, index) => {
              return (
                <CourseCard
                  userInfo={userInfo}
                  userType={userType}
                  courseID={course._id}
                  key={index}
                  courseTitle={course.name}
                  year={course.year}
                  dept={course.department}
                  teacher={courseTeachers[index]}
                  numberOfStudents={studentCount[index]}
                />
              );
            })
          : null}

        {courses.length ? null : <EmptyState />}
      </div>
      <CreateCourse reload={forceUpdate} />
    </div>
  );
};

export default MyCourses;
