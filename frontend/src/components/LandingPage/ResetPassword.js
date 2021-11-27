import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import validator from "validator";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import md5 from "md5";
import "../../App.css";
import userImage from "../../assets/user4.png";

let randomUser = userImage;

const encrypt = (password) => {
  const buffer1 = md5(password);
  const buffer2 = md5(buffer1);
  return md5(buffer2);
};

const ResetPassword = ({}) => {
  const [password, setPassword] = React.useState("");

  const onChangePassword = (e) => setPassword(e.target.value);

  const validatePassword = () => {
    return validator.isLength(password, { min: 5 });
  };

  const resetPassword = () => {
    let loc = window.location.href.split("/");
    if (!validatePassword()) {
      return Swal.fire("Error", "Form is invalid");
    }

    Axios.post(
      `/api/resetPassword/${loc[loc.length - 3]}/${loc[loc.length - 2]}/${loc[loc.length - 1]}`,
      {
        password: encrypt(password),
      }
    )
      .then((res) => {
        if (res.data.success) {
          Swal.fire({ text: "Password reset successful", icon: "success" });
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else if (!res.data.success) {
          toast.error("Invalid or expired link");
        } 
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <React.Fragment>
      {
        <div style={{ marginLeft: "18%", marginRight: "18%" }}>
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
                Reset Password
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
                Enter new password
              </p>
            </div>
          </div>

          <Link to={`/`}>
            <div
              style={{
                position: "absolute",
                top: 60,
                right: 250,
                fontFamily: "Poppins",
                fontSize: 16,
                color: "#6C63FF",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => {}}
            >
              Go to Home Page
            </div>
          </Link>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 60,
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
              New Password
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
                type="password"
                placeholder="Password"
                onChange={onChangePassword}
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
            <button onClick={resetPassword}>
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
                Reset
              </p>
            </button>
          </div>

          <br />
        </div>
      }
    </React.Fragment>
  );
};

export default ResetPassword;
