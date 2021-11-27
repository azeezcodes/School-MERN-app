import React from "react";
import { BookOpen } from "react-feather";
import GetStarted from "./GetStarted";
import RegistrationDetails from "./RegistrationDetails";
import Login from "./Login";
import registerPic from "../../assets/register.png";
import "../../App.css";

const LandingPage = () => {
  const [showForm, setShowForm] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);
  const [userType, setUserType] = React.useState("student");

  const [studentDetails, setStudentDetails] = React.useState({
    department: "",
    year: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
    _id: "",
  });

  const [teacherDetails, setTeacherDetails] = React.useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    _id: "",
  });

  return (
    <div
      style={{
        width: "100%",
        height: window.innerHeight,
        display: "flex",
        flexDirection: "row",
        overflow: "visible",
      }}
    >
      {/* Left side */}
      <div
        style={{
          width: "50%",
          height: "100%",
          overflow: "visible",
          zIndex: 999,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "1rem",
            alignItems: "center",
            alignSelf: "center",
            marginTop: "15%",
            justifyContent: "center",
          }}
        >
          <BookOpen size={35} color="#6C63FF" />
          <div style={{ alignItems: "flex-start", display: "flex" }}>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 30,
                color: "#232323",
                fontWeight: 600,
                paddingLeft: 10,
                margin: 0,
              }}
            >
              Engage
            </p>
          </div>
        </div>
        <img
          src={registerPic}
          style={{ width: "100%", alignSelf: "center", zIndex: 999 }}
        />
      </div>

      {/* Right main side */}
      <div
        style={{
          width: "50%",
          height: "100%",
          backgroundColor: "white",
          display: "flex",
          padding: "2rem",
          flexDirection: "column",
          justifyContent: "flex-start",
          zIndex: 998,
          paddingLeft: "3rem",
        }}
      >
        {showForm ? (
          isLogin ? (
            <Login
              userType={userType}
              setUserType={setUserType}
              setStudentDetails={setStudentDetails}
              studentDetails={studentDetails}
              setTeacherDetails={setTeacherDetails}
              teacherDetails={teacherDetails}
              goBack={() => setShowForm(false)}
              setLogin={() => setIsLogin(false)}
            />
          ) : (
            <RegistrationDetails
              userType={userType}
              setUserType={setUserType}
              setStudentDetails={setStudentDetails}
              goBack={() => setShowForm(false)}
              setLogin={() => setIsLogin(true)}
            />
          )
        ) : (
          <GetStarted goNext={() => setShowForm(true)} />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
