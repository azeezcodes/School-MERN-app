import React, { useState } from "react";
import Axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Toggle from "react-toggle";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { Scrollbars } from "react-custom-scrollbars";
import {
  X,
  BookOpen,
  Info,
  Settings,
  LogOut,
  Sun,
  Moon,
  Edit3,
  Layout,
  Search,
  RotateCcw,
} from "react-feather";
import { getRandomUser } from "./random";
import { customStyles, customStyles2 } from "./CustomModalStyles";
import "react-toggle/style.css";
import "./css/Sidebar.css";

let width = window.innerWidth * 0.2;
let height = window.innerHeight * 2;
let randomUser = getRandomUser();

const Sidebar = () => {
  localStorage.setItem(
    "theme",
    JSON.stringify(document.documentElement.style.getPropertyValue("--theme"))
  );
  let theme = JSON.parse(localStorage.getItem("theme"));
  const a = localStorage.getItem("userDetails");
  const b = localStorage.getItem("userType");
  const userType = b ? JSON.parse(b) : "student";

  const [user, setUser] = useState(
    a
      ? JSON.parse(a)
      : {
          department: "",
          year: "",
          fName: "",
          lName: "",
          email: "",
          _id: "",
        }
  );
  const [sidebar, setSidebar] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [modalIsOpen, setModal] = useState(false);
  const [modalIsOpenProfile, setModalProfile] = useState(false);
  const [courses, setCourses] = React.useState([]);

  const showSidebar = () => setSidebar(!sidebar);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const openModalProfile = () => setModalProfile(true);
  const closeModalProfile = () => setModalProfile(false);

  function GetCurrentPath() {
    return useLocation().pathname;
  }

  React.useEffect(() => {
    Axios.get(`/api/${userType}/${user._id}`, {
      header: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          return toast.error("Error getting info");
        }
      })
      .catch(() => toast.error("Could not fetch your info. Please try again"));
  }, [modalIsOpen]);

  React.useEffect(() => {
    if (userType === "teacher") return;
    Axios.get(`/api/fetchCourse/student/${user._id}`, {
      header: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          console.log("Error fetching courses");
        }
      })
      .catch(() => {
        console.log("Could not fetch your courses. Please try again");
      });
  }, [modalIsOpen]);

  React.useEffect(() => {
    if (userType === "student") return;
    Axios.get(`/api/fetchCourse/teacher/${user._id}`, {
      header: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          console.log("Error fetching courses");
        }
      })
      .catch(() => {
        console.log("Could not fetch your courses. Please try again");
      });
  }, [modalIsOpen]);

  const handleThemeChange = (e) => {
    setIsLightTheme(e.target.checked);
    isLightTheme
      ? document.documentElement.style.setProperty("--filterPercent", "100%")
      : document.documentElement.style.setProperty("--filterPercent", "0%");
    isLightTheme
      ? document.documentElement.style.setProperty("--theme", "dark")
      : document.documentElement.style.setProperty("--theme", "light");
    localStorage.setItem(
      "theme",
      JSON.stringify(document.documentElement.style.getPropertyValue("--theme"))
    );
    let t = document.documentElement.style.getPropertyValue("--theme");
    t === "light"
      ? document.documentElement.style.setProperty("--textColor", "#232323")
      : document.documentElement.style.setProperty("--textColor", "#d3d3d3");
    t === "light"
      ? document.documentElement.style.setProperty("--background", "#fff")
      : document.documentElement.style.setProperty("--background", "#1B1B1B");
    t === "light"
      ? document.documentElement.style.setProperty("--grey", "#efefef")
      : document.documentElement.style.setProperty("--grey", "#2a2a2a");
    t === "light"
      ? document.documentElement.style.setProperty("--sub", "#545454")
      : document.documentElement.style.setProperty("--sub", "#d3d3d3");
  };

  const menuOptions = [
    {
      title: "Dashboard",
      icon: (
        <Layout
          size={22}
          color={
            GetCurrentPath() === "/home"
              ? "#6C63FF"
              : theme === "dark"
              ? "#BABABA"
              : "#232323"
          }
        />
      ),
      path: "/home",
    },
    {
      title: "My Notes",
      icon: (
        <Edit3
          size={20}
          color={
            GetCurrentPath() === "/notes"
              ? "#6C63FF"
              : theme === "dark"
              ? "#BABABA"
              : "#232323"
          }
          style={{ marginRight: 22 }}
        />
      ),
      path: "/notes",
    },
  ];

  if (userType === "teacher") {
    menuOptions.push({
      title: "Search",
      icon: (
        <Search
          size={22}
          color={
            GetCurrentPath() === "/search"
              ? "#6C63FF"
              : theme === "dark"
              ? "#BABABA"
              : "#232323"
          }
        />
      ),
      path: "/search",
    });
  }

  const [newFName, setNewFName] = useState(user.fName);
  const [newLName, setNewLName] = useState(user.lName);

  const changeName = () => {
    if (!newFName.length || !newLName) {
      return toast.error("Name fields cannot be empty");
    }

    const url = `/api/update/${userType}`;
    Axios.post(url, {
      fName: newFName,
      lName: newLName,
      email: user.email,
    })
      .then((res) => {
        if (res.data.success) {
          toast.success("Name updated");
        } else {
          return toast.error("Error updating name");
        }
      })
      .catch(() => toast.error("Could not update your name. Please try again"));
    closeModal();
    reloadPage();
  };

  const sidebarData = courses.length ? courses : [];

  const reloadPage = () => {
    window.location.reload();
  };

  const logout = () => {
    window.localStorage.clear();
  };

  return (
    <div>
      <div
        className="sidebar"
        style={{
          backgroundColor: theme === "dark" ? "#1B1B1B" : "white",
          paddingBottom: 0,
          borderBottomColor: theme === "dark" ? "#434343" : "#eee",
        }}
      >
        <div className="settings-icon">
          <Settings
            size={21}
            color={theme === "dark" ? "#eee" : "#232323"}
            className="seticon"
            onClick={openModal}
          />
        </div>

        <div className="my-profile-box">
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
              cursor: "pointer",
            }}
            onClick={openModalProfile}
          >
            <img
              className="changeColorBG"
              src={randomUser}
              style={{ width: 35, height: 35, marginLeft: 0, marginTop: 5 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <h6
              style={{
                fontSize: 15,
                color: theme === "dark" ? "#eee" : "#232323",
                fontFamily: "Poppins",
                fontWeight: 600,
                margin: 0,
                padding: 0,
                marginTop: 5,
              }}
            >
              {user.fName} {user.lName}
            </h6>
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
              {userType[0].toUpperCase() + userType.slice(1, userType.length)}
            </p>
          </div>
        </div>
      </div>

      <nav
        className={"nav-menu active"}
        style={{ backgroundColor: theme === "dark" ? "#212121" : "#f8f8f8" }}
      >
        <Scrollbars
          style={{ width, height }}
          autoHide
          autoHideDuration={1000}
          autoHideTimeout={800}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              className="subBG"
              style={{
                ...style,
                opacity: 0.4,
                borderRadius: 10,
                width: 8,
                paddingRight: 20,
                marginRight: 20,
              }}
            />
          )}
        >
          <div
            onClick={showSidebar}
            className="nav-menu-items justify-content-center justify-items-center"
          >
            <Link to="/">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  height: 80,
                  paddingRight: 30,
                }}
              >
                <BookOpen size={30} color="#6C63FF" />
                <div
                  style={{
                    alignItems: "flex-start",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 25,
                      color: theme === "dark" ? "#eee" : "#232323",
                      fontWeight: 600,
                      paddingLeft: 10,
                      margin: 0,
                      letterSpacing: 0.25,
                    }}
                  >
                    Engage
                  </p>
                </div>
              </div>
            </Link>

            <br
              style={{
                display: GetCurrentPath() === "/home" ? "block" : "none",
              }}
            />

            <div
              style={{
                width: "86%",
                height: "auto",
                borderRadius: 10,
                margin: "20px 7% 30px 7%",
                padding: 0,
                display: GetCurrentPath() === "/home" ? "none" : "block",
              }}
              className=""
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  className="changeColorBG"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexDirection: "row",
                    cursor: "pointer",
                  }}
                  onClick={openModalProfile}
                >
                  <img
                    className="changeColorBG"
                    src={randomUser}
                    style={{
                      width: 40,
                      height: 40,
                      marginLeft: 0,
                      marginTop: 5,
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p
                    className="changeColor"
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      color: !isLightTheme ? "#878787" : "#434343",
                      fontSize: 14,
                      textAlign: "left",
                      letterSpacing: 0.3,
                      margin: 0,
                      padding: 0,
                      marginLeft: 10,
                    }}
                  >
                    Hey,
                  </p>
                  <p
                    className="changeColor"
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      color: !isLightTheme ? "#878787" : "#434343",
                      fontSize: 18,
                      textAlign: "left",
                      letterSpacing: 0.3,
                      margin: 0,
                      padding: 0,
                      marginLeft: 10,
                      marginTop: 3,
                    }}
                  >
                    {user.fName} {user.lName}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div className="profile-option" onClick={openModal}>
                  <Edit3 size={15} />
                  <p
                    className="sub"
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      color: !isLightTheme ? "#878787" : "#434343",
                      fontSize: 13,
                      textAlign: "left",
                      letterSpacing: 0.3,
                      margin: 0,
                      padding: 0,
                      marginLeft: 10,
                    }}
                  >
                    Edit profile
                  </p>
                </div>
                <Link to="/">
                  <div className="profile-option" onClick={logout}>
                    <LogOut size={15} className="changeColor" />
                    <p
                      className="sub"
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 500,
                        color: !isLightTheme ? "#878787" : "#434343",
                        fontSize: 13,
                        textAlign: "left",
                        letterSpacing: 0.3,
                        margin: 0,
                        padding: 0,
                        marginLeft: 10,
                      }}
                    >
                      Logout
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {menuOptions.map((item, index) => {
              return (
                <Link to={item.path}>
                  <div
                    key={index}
                    className="nav-text"
                    style={{
                      fontFamily: "Poppins",
                      paddingLeft: 2,
                      paddingBottom: 5,
                      paddingTop: 5,
                      borderColor:
                        GetCurrentPath() === item.path
                          ? "#6C63FFaa"
                          : "transparent",
                    }}
                  >
                    <span
                      className="row"
                      style={{
                        color:
                          GetCurrentPath() === item.path
                            ? "#6C63FF"
                            : theme === "dark"
                            ? "#BABABA"
                            : "#232323",
                        fontSize: 17,
                        letterSpacing: 0.4,
                        fontWeight: 500,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="row"
                      style={{
                        color:
                          GetCurrentPath() === item.path
                            ? "#6C63FF"
                            : theme === "dark"
                            ? "#BABABA"
                            : "#232323",
                        fontSize: 17,
                        letterSpacing: 0.4,
                        fontWeight: 500,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                </Link>
              );
            })}

            <div
              style={{
                width: "13em",
                height: 85,
                borderRadius: 10,
                backgroundColor: "#6C63FF2a",
                margin: "20px 7%",
                padding: "15px 15px",
              }}
              className=""
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  className="changeColor"
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    color: !isLightTheme ? "#878787" : "#434343",
                    fontSize: 15,
                    textAlign: "left",
                    letterSpacing: 0.3,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {isLightTheme ? "Light theme" : "Dark theme"}
                </p>
                <Toggle
                  defaultChecked={isLightTheme}
                  icons={{
                    checked: (
                      <Moon
                        size={17}
                        color="#232323"
                        style={{ position: "absolute", top: -3 }}
                      />
                    ),
                    unchecked: (
                      <Sun
                        size={14}
                        color="#fff"
                        style={{ position: "absolute", top: -2 }}
                      />
                    ),
                  }}
                  className="toggle"
                  onChange={handleThemeChange}
                />
              </div>
              <p
                className="sub"
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  color: theme === "dark" ? "#878787" : "#434343",
                  fontSize: 13,
                  textAlign: "left",
                  letterSpacing: 0.3,
                  margin: 0,
                  padding: 0,
                  marginTop: 10,
                }}
              >
                Switch to {isLightTheme ? "dark" : "light"} theme now
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                paddingLeft: 30,
                paddingRight: 20,
                justifyContent: "space-between",
              }}
            >
              <p
                className="sub"
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  color: theme === "dark" ? "#878787" : "#434343",
                  fontSize: 15,
                  textAlign: "left",
                  letterSpacing: 0.3,
                  margin: "10px 0",
                  marginTop: 18,
                  padding: 0,
                }}
              >
                MY COURSES
              </p>
            </div>

            {sidebarData.map((item, index) => {
              return (
                <Link to={`/course/${item._id}`}>
                  <div
                    key={index}
                    className="nav-text"
                    style={{ paddingLeft: 15, fontFamily: "Poppins" }}
                  >
                    <span
                      className="row"
                      style={{
                        color:
                          GetCurrentPath() === `/course/${item._id}`
                            ? "#6C63FF"
                            : theme === "dark"
                            ? "#BABABA"
                            : "#232323",
                        fontWeight: 500,
                        letterSpacing: 0.3,
                        fontSize: 16,
                      }}
                    >
                      {" "}
                      {item.name}{" "}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Scrollbars>
      </nav>

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
            fontWeight: 500,
            fontSize: 25,
            padding: 0,
            marginBottom: 0,
          }}
        >
          Settings
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 25,
          }}
        >
          <p
            className="sub"
            style={{
              fontFamily: "Poppins",
              fontSize: 15,
              fontWeight: 500,
              margin: 0,
              padding: 0,
            }}
          >
            Color theme : {isLightTheme ? "Light" : "Dark"}
          </p>
          <Toggle
            defaultChecked={isLightTheme}
            icons={{
              checked: (
                <Moon
                  size={17}
                  color="#232323"
                  style={{ position: "absolute", top: -3 }}
                />
              ),
              unchecked: (
                <Sun
                  size={14}
                  color="#fff"
                  style={{ position: "absolute", top: -2 }}
                />
              ),
            }}
            className="toggle"
            onChange={handleThemeChange}
          />
        </div>

        <p
          style={{
            fontFamily: "Poppins",
            fontSize: 15,
            color: "#ababab",
            fontWeight: 500,
            margin: 0,
            padding: 0,
            textAlign: "left",
            marginTop: 20,
            marginBottom: 0,
          }}
        >
          Change First Name
        </p>
        <input
          type="text"
          style={{ height: 40 }}
          value={newFName}
          onChange={(t) => setNewFName(t.target.value)}
        ></input>

        <p
          style={{
            fontFamily: "Poppins",
            fontSize: 15,
            color: "#ababab",
            fontWeight: 500,
            margin: 0,
            padding: 0,
            textAlign: "left",
            marginTop: 20,
            marginBottom: 0,
          }}
        >
          Change Last Name
        </p>
        <input
          type="text"
          style={{ height: 40 }}
          value={newLName}
          onChange={(t) => setNewLName(t.target.value)}
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
          <button onClick={changeName}>
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

      <Modal
        isOpen={modalIsOpenProfile}
        onRequestClose={closeModalProfile}
        style={customStyles2}
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
          onClick={closeModalProfile}
        />

        <div
          className="changeColorBG"
          style={{
            width: 120,
            height: 120,
            overflow: "hidden",
            borderRadius: 60,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            className="changeColorBG"
            src={randomUser}
            style={{ width: 100, height: 100, marginTop: 20 }}
          />
        </div>

        <p
          className="changeColor"
          style={{
            fontFamily: "Poppins",
            fontSize: 28,
            color: "#ababab",
            fontWeight: 500,
            margin: "0 auto",
            padding: 0,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {user.fName.concat(" ").concat(user.lName)}
        </p>
        <p
          className="sub"
          style={{
            fontFamily: "Poppins",
            fontSize: 15,
            color: "#ababab",
            fontWeight: 500,
            margin: "0 auto",
            padding: 0,
            textAlign: "center",
            marginTop: 5,
            letterSpacing: 0.6,
          }}
        >
          {userType.toUpperCase()}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Poppins",
              fontSize: 14,
              fontWeight: 500,
              margin: 0,
              padding: 0,
              marginRight: 10,
              letterSpacing: 0.7,
              verticalAlign: "middle",
              marginTop: 5,
              color: "#6C63FF",
            }}
          >
            EMAIL
          </p>
          <p
            className="changeColor"
            style={{
              fontFamily: "Poppins",
              fontSize: 18,
              fontWeight: 500,
              margin: 0,
              padding: 0,
            }}
          >
            {user.email}{" "}
          </p>
        </div>

        {userType === "student" ? (
          <React.Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                  marginRight: 10,
                  letterSpacing: 0.7,
                  verticalAlign: "middle",
                  marginTop: 5,
                  color: "#6C63FF",
                }}
              >
                YEAR
              </p>
              <p
                className="changeColor"
                style={{
                  fontFamily: "Poppins",
                  fontSize: 18,
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                }}
              >
                {user.year}{" "}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                  marginRight: 10,
                  letterSpacing: 0.7,
                  verticalAlign: "middle",
                  marginTop: 5,
                  color: "#6C63FF",
                }}
              >
                DEPARTMENT
              </p>
              <p
                className="changeColor"
                style={{
                  fontFamily: "Poppins",
                  fontSize: 18,
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                }}
              >
                {user.department}{" "}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                  marginRight: 10,
                  letterSpacing: 0.7,
                  verticalAlign: "middle",
                  marginTop: 5,
                  color: "#6C63FF",
                }}
              >
                COURSES ENROLLED
              </p>
              <p
                className="changeColor"
                style={{
                  fontFamily: "Poppins",
                  fontSize: 18,
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                }}
              >
                {courses.length} courses{" "}
              </p>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                  marginRight: 10,
                  letterSpacing: 0.7,
                  verticalAlign: "middle",
                  marginTop: 5,
                  color: "#6C63FF",
                }}
              >
                COURSES TEACHING
              </p>
              <p
                className="changeColor"
                style={{
                  fontFamily: "Poppins",
                  fontSize: 18,
                  fontWeight: 500,
                  margin: 0,
                  padding: 0,
                }}
              >
                {courses.length} courses{" "}
              </p>
            </div>
          </React.Fragment>
        )}
        <Link to="/">
          <p
            style={{
              fontSize: 16,
              color: "#6C63FF",
              fontFamily: "Poppins",
              fontWeight: 500,
              margin: 0,
              padding: 0,
              letterSpacing: 0.4,
              marginTop: 50,
              textAlign: "center",
            }}
            onClick={logout}
          >
            Log out
          </p>
        </Link>
      </Modal>
    </div>
  );
};

export default Sidebar;
