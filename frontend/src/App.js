import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainerCustom } from "./components/Toast";
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from "./components/LandingPage/LandingPage";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Notes from "./components/Notes";
import Search from "./components/Search";
import Course from "./components/Course";
import Quiz from "./components/Quiz";
import AssignmentDetails from "./components/AssignmentDetails";
import AssessmentReport from "./components/AssessmentReport";
import QuizQuestion from "./components/QuizQuestion";
import ResetPassword from "./components/LandingPage/ResetPassword";

function App() {
  let width = window.innerWidth 
  let height = window.innerHeight 
  return (
    <Scrollbars
      style={{ width, height, backgroundColor: "transparent" }}
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
            paddingRight: 10,
            marginRight: 10,
          }}
        />
      )}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-password/*" element={<ResetPassword />} />
        <Route path="/home" element={<><Home /><Sidebar /></>} exact/>
        <Route path="/notes" element={<><Notes /><Sidebar /></>}exact/>
        <Route path="/search" element={<><Search /><Sidebar /></>}exact/>
        <Route path="/course/*" element={<><Course /><Sidebar /></>}exact/>
        <Route path="/assignment/*" element={<><AssignmentDetails /><Sidebar /></>}exact/>
        <Route path="/assessmentReport/*" element={<><AssessmentReport /><Sidebar /></>}exact/>
        <Route path="/quiz/*" element={<><Quiz /><Sidebar /></>}exact/>
        <Route path="/createQuiz/*" element={<><QuizQuestion /><Sidebar /></>}exact/>
      </Routes>
      <ToastContainerCustom />
    </Scrollbars>
  );
}

export default App;
