import React from "react";
import { getRandomUser } from "./random";

let randomUser = getRandomUser();
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

const Message = ({ name, message, time, userType, userID, prev }) => {
  let time_real = new Date(parseInt(time)).toLocaleString();
  time_real = time_real
    .slice(0, time_real.length - 6)
    .concat(time_real.slice(time_real.length - 3, time_real.length + 1))
    .slice(11, time_real.length + 1);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = new Date(parseInt(time));
  let yesterday = prev ? new Date(parseInt(prev.time_stamp)) : undefined;

  let todayDay =
    days[date.getDay()] +
    ", " +
    date.getDate() +
    " " +
    months[date.getMonth()] +
    " " +
    date.getFullYear() +
    "";
  let yesterdayDay = yesterday
    ? days[yesterday.getDay()] +
      ", " +
      yesterday.getDate() +
      " " +
      months[yesterday.getMonth()] +
      " " +
      yesterday.getFullYear() +
      ""
    : null;

  let prevUser = prev ? prev.user_name : "";
  let prevUserType = prev ? prev.user_type : "";

  let name_real = prevUser === name && prevUserType === userType ? "" : name;

  let isTeacher = user._id === userID;

  return (
    <React.Fragment>
      <p
        style={{
          fontFamily: "Poppins",
          fontSize: 13,
          letterSpacing: 0.3,
          margin: "10px auto",
          padding: 0,
          fontWeight: 500,
          textAlign: "center",
          display: todayDay == yesterdayDay ? "none" : "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
        className={"sub"}
      >
        <div
          className="changeColorBG"
          style={{ padding: "4px 10px", borderRadius: 50, margin: "5px auto" }}
        >
          {todayDay}
        </div>
      </p>
      <div
        style={{
          width: "auto",
          minHeight: 50,
          margin: "0 20px 5px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: isTeacher ? "flex-end" : "flex-start",
        }}
      >
        <p
          style={{
            fontFamily: "Poppins",
            fontSize: 12,
            letterSpacing: 0.3,
            margin: 0,
            padding: 0,
            marginBottom: 0,
            marginLeft: isTeacher ? 0 : 55,
            marginRight: isTeacher ? 55 : 0,
            fontWeight: 500,
            color: isTeacher ? "#6C63FF" : "",
          }}
          className="subnotimp"
        >
          {name_real}
        </p>

        <div
          style={{
            width: "70%",
            minHeight: 40,
            display: "flex",
            flexDirection: isTeacher ? "row-reverse" : "row",
            justifyContent: "flex-start",
            paddingRight:
              prevUser === name &&
              prevUserType === userType &&
              isTeacher &&
              todayDay == yesterdayDay
                ? 40
                : 0,
            paddingLeft:
              prevUser === name &&
              prevUserType === userType &&
              !isTeacher &&
              todayDay == yesterdayDay
                ? 40
                : 0,
          }}
        >
          <div
            className="changeColorBG"
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              backgroundColor: "#eee",
              display:
                prevUser === name &&
                prevUserType === userType &&
                todayDay == yesterdayDay
                  ? "none"
                  : "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexDirection: "row",
              marginLeft: 0,
              marginRight: 0,
              marginTop: 2,
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
              width: "auto",
              padding: "10px 15px",
              display: "flex",
              flexDirection: "column",
              borderRadius: 10,
              marginLeft: isTeacher ? 0 : 8,
              marginRight: isTeacher ? 8 : 0,
              maxWidth: "90%",
              backgroundColor: isTeacher ? "#6C63FF25" : "",
              paddingBottom: 3,
            }}
            className="changeColorBGnotimp"
          >
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 14.5,
                letterSpacing: 0.1,
                margin: 0,
                padding: 0,
                marginBottom: 0,
                marginLeft: 0,
                fontWeight: 500,
                marginTop: 1,
              }}
              className="changeColor"
            >
              {message}
            </p>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 10,
                letterSpacing: 0.6,
                margin: 0,
                padding: 0,
                marginBottom: 0,
                marginLeft: 0,
                fontWeight: 400,
                marginTop: 3,
                textAlign: isTeacher ? "right" : "left",
              }}
              className="sub"
            >
              {time_real}
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Message;
