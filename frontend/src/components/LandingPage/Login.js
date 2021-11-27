import React from "react";
import Axios from "axios";
import validator from "validator";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import md5 from "md5";
import "../../App.css";
import { ArrowLeft, Eye, EyeOff, Briefcase, Dribbble } from "react-feather";
import userImage from "../../assets/user4.png";

let randomUser = userImage;

const encrypt = (password) => {
  const buffer1 = md5(password);
  const buffer2 = md5(buffer1);
  return md5(buffer2);
};

const Login = ({
  goBack,
  setLogin,
  userType,
  setUserType,
  studentDetails,
  setStudentDetails,
  teacherDetails,
  setTeacherDetails,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [viewPassword, setViewPassword] = React.useState(true);
  const [isStudent, setIsStudent] = React.useState(true);
  const [forgotPassword, setForgotPassword] = React.useState(false);

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const validatePassword = () => {
    return validator.isLength(password, { min: 5 });
  };

  const validateEmail = () => {
    return validator.isEmail(email);
  };

  const loginStudent = () => {
    if (!validateEmail() || !validatePassword()) {
      return Swal.fire("Error", "Form is invalid");
    }

    Axios.post("/api/students/login", {
      email: email,
      password: encrypt(password),
    })
      .then((res) => {
        if (res.data.data) {
          const details = res.data.data;
          setStudentDetails(details);
          Swal.fire({ text: "Logging in", icon: "success" });
          setTimeout(() => {
            localStorage.setItem("userDetails", JSON.stringify(details));
            localStorage.setItem("userType", JSON.stringify("student"));
            window.location.href = "/home";
          }, 1000);
        } else if (!res.data.data) {
          Swal.fire({ text: "Email or password is incorrect", icon: "error" });
        } else {
          Swal.fire("Error", "Email or password is incorrect");
        }
      })
      .catch((error) => {
        Swal.fire({ text: "Email or password is incorrect", icon: "error" });
      });
  };

  const forgotPasswordLink = () => {
    if (!validateEmail()) {
      return Swal.fire("Error", "Form is invalid");
    }

    Axios.post("/api/getResetLink", {
      email: email,
      user_type: isStudent ? "student" : "teacher",
    })
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            text: "Please check your email for reset link",
            icon: "success",
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else if (!res.data.data) {
          Swal.fire("Error", "Oops! Something went wrong");
        } 
      })
      .catch((error) => {
      });
  };

  const loginTeacher = () => {
    if (!validateEmail() || !validatePassword()) {
      return Swal.fire("Error", "Form is invalid");
    }

    Axios.post("/api/teachers/login", {
      email: email,
      password: encrypt(password),
    })
      .then((res) => {
        if (res.data.data) {
          const details = res.data.data;
          setTeacherDetails(details);
          Swal.fire({ text: "Logging in", icon: "success" });
          setTimeout(() => {
            localStorage.setItem("userDetails", JSON.stringify(details));
            localStorage.setItem("userType", JSON.stringify("teacher"));
            window.location.href = "/home";
          }, 1000);
        } else if (!res.data.data) {
          Swal.fire({ text: "Email or password is incorrect", icon: "error" });
        } else
          Swal.fire({ text: "Email or password is incorrect", icon: "error" });
      })
      .catch(() => {
        Swal.fire({ text: "Email or password is incorrect", icon: "error" });
      });
  };

  return (
    <React.Fragment>
      {forgotPassword ? (
        <div>
          <ArrowLeft
            size={25}
            color="#545454"
            onClick={() => goBack()}
            style={{ cursor: "pointer", position: "absolute" }}
          />

          <div
            style={{
              width: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingTop: "5%",
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "5rem",
                backgroundColor: "#eeeeee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={randomUser}
                style={{ width: "3.5rem", marginTop: 10 }}
              />
            </div>
            <div style={{ marginLeft: "1rem" }}>
              <h2
                style={{
                  textAlign: "left",
                  fontFamily: "Poppins",
                  color: "#545454",
                  fontWeight: 600,
                  fontSize: 26,
                }}
              >
                Forgot password?
              </h2>
              <p
                style={{
                  fontFamily: "Mulish",
                  fontSize: 17,
                  color: "#ababab",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Enter registered email id to get password reset link
              </p>
            </div>
          </div>
          <p
            style={{
              fontFamily: "Poppins",
              fontSize: 16,
              color: "#545454",
              fontWeight: 600,
              margin: 0,
              textAlign: "left",
              marginBottom: "0.5rem",
              marginTop: 30,
            }}
          >
            Are you a student or teacher/instructor?
          </p>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
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
                class="checkbox-container"
                style={{ borderColor: isStudent ? "#6C63FF" : "#eee" }}
              >
                <Dribbble
                  size={22}
                  style={{ marginRight: 15 }}
                  color="#545454"
                />
                Student
                <input
                  type="checkbox"
                  onClick={() => {
                    setIsStudent(true);
                    setUserType("student");
                  }}
                  checked={isStudent}
                />
                <span class="checkmark"></span>
              </label>
              <label
                class="checkbox-container"
                style={{ borderColor: !isStudent ? "#6C63FF" : "#eee" }}
              >
                <Briefcase
                  size={22}
                  style={{ marginRight: 15 }}
                  color="#545454"
                />
                Teacher
                <input
                  type="checkbox"
                  onClick={() => {
                    setIsStudent(false);
                    setUserType("teacher");
                  }}
                  checked={!isStudent}
                />
                <span class="checkmark"></span>
              </label>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 40,
            }}
          >
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 16,
                color: "#545454",
                fontWeight: 600,
                textAlign: "right",
              }}
            >
              Enter Email
            </p>
            <div
              style={{
                width: "70%",
                alignItems: "flex-start",
                paddingLeft: "30%",
                display: "flex",
              }}
            >
              <input
                type="email"
                placeholder="Email ID"
                onChange={onChangeEmail}
                onBlur={() =>
                  validateEmail()
                    ? null || true
                    : toast.error("Invalid Email ID")
                }
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              alignItems: "flex-end",
              display: "flex",
              flexDirection: "column",
              marginRight: 10,
            }}
          >
            <button onClick={forgotPasswordLink}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                  margin: 0,
                  fontFamily: "Poppins",
                  letterSpacing: 0.4,
                }}
              >
                Send Email
              </p>
            </button>
          </div>

          <br />
        </div>
      ) : (
        <div>
          <ArrowLeft
            size={25}
            color="#545454"
            onClick={() => goBack()}
            style={{ cursor: "pointer", position: "absolute" }}
          />
          <div
            style={{
              position: "absolute",
              right: 30,
              fontFamily: "Poppins",
              fontSize: 16,
              color: "#6C63FF",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => setLogin()}
          >
            New here ? Register now
          </div>

          <div
            style={{
              width: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingTop: "5%",
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "5rem",
                backgroundColor: "#eeeeee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={randomUser}
                style={{ width: "3.5rem", marginTop: 10 }}
              />
            </div>
            <div style={{ marginLeft: "1rem" }}>
              <h2
                style={{
                  textAlign: "left",
                  fontFamily: "Poppins",
                  color: "#545454",
                  fontWeight: 600,
                  fontSize: 26,
                }}
              >
                Welcome Back
              </h2>
              <p
                style={{
                  fontFamily: "Mulish",
                  fontSize: 17,
                  color: "#ababab",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Enter your login credentials to access your classroom
              </p>
            </div>
          </div>

          <p
            style={{
              fontFamily: "Poppins",
              fontSize: 16,
              color: "#545454",
              fontWeight: 600,
              margin: 0,
              textAlign: "left",
              marginBottom: "0.5rem",
              marginTop: 30,
            }}
          >
            Log in as a student or a teacher/instructor ?
          </p>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
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
                class="checkbox-container"
                style={{ borderColor: isStudent ? "#6C63FF" : "#eee" }}
              >
                <Dribbble
                  size={22}
                  style={{ marginRight: 15 }}
                  color="#545454"
                />
                Student
                <input
                  type="checkbox"
                  onClick={() => {
                    setIsStudent(true);
                    setUserType("student");
                  }}
                  checked={isStudent}
                />
                <span class="checkmark"></span>
              </label>
              <label
                class="checkbox-container"
                style={{ borderColor: !isStudent ? "#6C63FF" : "#eee" }}
              >
                <Briefcase
                  size={22}
                  style={{ marginRight: 15 }}
                  color="#545454"
                />
                Teacher
                <input
                  type="checkbox"
                  onClick={() => {
                    setIsStudent(false);
                    setUserType("teacher");
                  }}
                  checked={!isStudent}
                />
                <span class="checkmark"></span>
              </label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 16,
                color: "#545454",
                fontWeight: 600,
                margin: 0,
                textAlign: "left",
              }}
            >
              Email and Password
            </p>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: "50%",
                alignItems: "flex-start",
                display: "flex",
              }}
            >
              <input
                type="email"
                placeholder="Email ID"
                onChange={onChangeEmail}
                onBlur={() =>
                  validateEmail()
                    ? null || true
                    : toast.error("Invalid Email ID")
                }
              />
            </div>
            <div style={{ width: "50%" }}>
              <div
                style={{
                  display: "inline-flex",
                  position: "relative",
                  width: "100%",
                }}
              >
                <input
                  type={viewPassword ? "password" : "text"}
                  placeholder="Password"
                  onChange={onChangePassword}
                  style={{ marginRight: 0 }}
                />
                {viewPassword ? (
                  <Eye
                    size={22}
                    color="#ababab"
                    style={{
                      position: "absolute",
                      left: "85%",
                      zIndex: 12,
                      marginTop: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => setViewPassword(!viewPassword)}
                  />
                ) : (
                  <EyeOff
                    size={22}
                    color="#ababab"
                    style={{
                      position: "absolute",
                      left: "85%",
                      zIndex: 12,
                      marginTop: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => setViewPassword(!viewPassword)}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              right: 30,
              fontFamily: "Poppins",
              fontSize: 15,
              color: "#6C63FF",
              fontWeight: 400,
              cursor: "pointer",
            }}
            onClick={() => {
              setForgotPassword(true);
            }}
          >
            Forgot password?
          </div>
          <div
            style={{
              marginTop: 20,
              alignItems: "flex-end",
              display: "flex",
              flexDirection: "column",
              marginRight: 10,
            }}
          >
            <button
              onClick={userType === "student" ? loginStudent : loginTeacher}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                  margin: 0,
                  fontFamily: "Poppins",
                  letterSpacing: 0.4,
                }}
              >
                Login
              </p>
            </button>
          </div>

          <br />
        </div>
      )}
    </React.Fragment>
  );
};

export default Login;
