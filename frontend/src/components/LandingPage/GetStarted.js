import React from "react";
import {
  FileText,
  Monitor,
  PenTool,
  ArrowRight,
  Codesandbox,
} from "react-feather";
import "../../App.css";

// Right section of Landing page
const Features = () => {
  const featuresInfo = [
    {
      img: <Monitor color="#6C63FF" size={22} />,
      text: "Manage all your courses at one place",
    },
    {
      img: <PenTool color="#6C63FF" size={22} />,
      text: "View and download study material",
    },
    {
      img: <FileText color="#6C63FF" size={22} />,
      text: "Share and submit assignments",
    },
    {
      img: <Codesandbox color="#6C63FF" size={22} />,
      text: "Take auto-grading enabled quizzes",
    },
  ];

  return featuresInfo.map((feature) => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          marginBottom: "15px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "2.1rem",
            height: "2.1rem",
            backgroundColor: "#6C63FF1a",
            borderRadius: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {feature.img}
        </div>
        <div style={{ flexGrow: 1, alignItems: "flex-start", display: "flex" }}>
          <p
            style={{
              fontFamily: "Poppins",
              fontSize: 17,
              color: "#878787",
              fontWeight: 500,
              paddingLeft: 20,
              margin: 0,
            }}
          >
            {feature.text}
          </p>
        </div>
      </div>
    );
  });
};

const GetStarted = ({ goNext }) => {
  return (
    <React.Fragment>
      <h2
        style={{
          marginTop: "10%",
          marginBottom: "10%",
          width: "auto",
          textAlign: "left",
          fontFamily: "Poppins",
          color: "#545454",
          fontWeight: 600,
          fontSize: 22,
          paddingRight: "10%",
        }}
      >
        Discover a new way of learning!
        <br />
        <br />
        Engage is your one-stop-solution for all classroom needs
      </h2>

      <Features />

      <div style={{ marginTop: "10%" }}>
        <button onClick={() => goNext()}>
          <p
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "white",
              margin: 0,
              fontFamily: "Poppins",
              letterSpacing: 0.4,
            }}
          >
            Get Started
          </p>
          <ArrowRight
            size={25}
            color="white"
            style={{ marginLeft: "0.5rem" }}
          />
        </button>
      </div>
    </React.Fragment>
  );
};

export default GetStarted;
