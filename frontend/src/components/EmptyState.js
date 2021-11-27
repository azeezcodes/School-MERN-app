import React from "react";
import emptyImage from "../assets/empty3.svg";

export const EmptyStateSmall = ({ title, d1, d2 }) => {
  if (!title) title = "No courses";
  if (!d1) d1 = "You have not enrolled in any courses yet!";

  return (
    <div
      style={{
        width: "30%",
        alignSelf: "center",
        margin: "5px auto",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 40,
      }}
    >
      <div
        className="changeColorBG"
        style={{
          width: 150,
          height: 150,
          borderRadius: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={emptyImage} style={{ width: 80, height: 80 }} />
      </div>
      <h5
        className="changeColor"
        style={{
          fontFamily: "Poppins",
          fontSize: 20,
          fontWeight: 600,
          margin: "10px auto",
          padding: 0,
          marginTop: 15,
        }}
      >
        {title}
      </h5>
      <p
        className="sub"
        style={{
          fontFamily: "Poppins",
          fontSize: 15,
          fontWeight: 500,
          margin: "10px auto",
          padding: 0,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        {d1}
      </p>
      <p
        className="sub"
        style={{
          fontFamily: "Poppins",
          fontSize: 15,
          fontWeight: 500,
          margin: "10px auto",
          padding: 0,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        {d2}
      </p>
    </div>
  );
};

export const EmptyState = ({ title, d1, d2 }) => {
  if (!title) title = "No courses";
  if (!d1) d1 = "You have not enrolled in any courses yet!";
  if (!d2) d2 = "Click on the plus button to create or join a course";
  return (
    <div
      style={{
        width: "50%",
        alignSelf: "center",
        margin: "10px auto",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 60,
      }}
    >
      <div
        className="changeColorBG"
        style={{
          width: 230,
          height: 230,
          borderRadius: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={emptyImage} style={{ width: 110, height: 110 }} />
      </div>
      <h5
        className="changeColor"
        style={{
          fontFamily: "Poppins",
          fontSize: 25,
          fontWeight: 600,
          margin: "10px auto",
          padding: 0,
          marginTop: 30,
        }}
      >
        {title}
      </h5>
      <p
        className="sub"
        style={{
          fontFamily: "Poppins",
          fontSize: 17,
          fontWeight: 500,
          margin: "10px auto",
          padding: 0,
          marginTop: 20,
        }}
      >
        {d1}
      </p>
      <p
        className="sub"
        style={{
          fontFamily: "Poppins",
          fontSize: 17,
          fontWeight: 500,
          margin: "10px auto",
          padding: 0,
        }}
      >
        {d2}
      </p>
    </div>
  );
};

export default EmptyState;
