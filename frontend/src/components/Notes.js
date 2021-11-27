import React from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { X, Plus, RotateCcw } from "react-feather";
import "./css/CreateCourse.css";
import "react-dropdown/style.css";
import "./css/Course.css";

const Notes = ({}) => {
  const [notes, setNotes] = React.useState([]);
  const [note, setNote] = React.useState("");
  const [ignore, setIgnored] = React.useState(0);

  const forceUpdate = React.useCallback(() => setIgnored((v) => v + 1), []);

  let localdata = JSON.parse(localStorage.getItem("userDetails"));
  let user = localdata
    ? localdata
    : {
        fname: "",
        lname: "",
        email: "",
        password: "",
        _id: "404",
      };
  let { _id } = user;

  let userType = JSON.parse(localStorage.getItem("userType"));

  const addNewNote = () => {
    if (!note.length) {
      toast.error("Please write something");
      return;
    }

    Axios.post("/api/notes", {
      user_id: _id,
      user_type: userType,
      content: note,
    })
      .then((res) => {
        if (res.data.success) {
          toast.success("Added a new note");
        } else {
          toast.error(
            "Note cannot be added at the moment. Please try again later!"
          );
        }
        setNote("");
        forceUpdate();
      })
      .catch(() => toast.error("Unable to add note"));
  };

  const deleteNote = (id) => {
    Axios.delete(`/api/notes/${id}`)
      .then((res) => {
        if (res.data.success) {
          toast.success("Note deleted");
        } else {
          toast.error("Unable to delete note");
        }
        setNote("");
        forceUpdate();
      })
      .catch(() => toast.error("Unable to delete note"));
  };

  React.useEffect(() => {
    Axios.get(`/api/notes/${userType}/${_id}`)
      .then((res) => {
        if (res.data.success) {
          setNotes(res.data.data);
        } else {
          toast.error("Could not fetch notes");
        }
      })
      .catch(() => toast.error("Could not fetch notes"));
  }, [ignore, note]);

  const NoteBox = ({ date, content, id, deleteNote }) => {
    let parsedDate = new Date(date).toDateString();
    let parsedTime = new Date(date).toLocaleTimeString();
    return (
      <div className="notes-box">
        <div className="notes-box-up">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <p>
              {parsedDate} {parsedTime}
            </p>
          </div>
          <X
            size={18}
            className={"sub trashcan"}
            onClick={() => deleteNote(id)}
          />
        </div>
        <h6 className="changeColor">{content}</h6>
      </div>
    );
  };

  return (
    <div
      className={"background course-container"}
      style={{ height: window.innerHeight + 60 }}
    >
      <div
        className="settings-icon"
        style={{ position: "absolute", top: 100, right: 15 }}
        onClick={forceUpdate}
      >
        <RotateCcw size={21} color="#6C63FF" className="changeColor" />
      </div>
      <div style={{ height: window.innerHeight + 60, width: "100%" }}>
        <h2 className="course-title" style={{ fontSize: 40, marginTop: 20 }}>
          My Notes
        </h2>
        <p
          className="sub"
          style={{
            fontFamily: "Poppins",
            fontSize: 18,
            color: "#232323",
            fontWeight: 500,
            margin: 0,
            padding: 0,
            textAlign: "left",
            marginTop: 30,
            marginBottom: 0,
          }}
        >
          Add a new note
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            style={{ height: 60, fontSize: 25 }}
            value={note}
            onChange={(t) => {
              setNote(t.target.value);
            }}
            autoFocus
            maxLength={200}
          ></input>
          <button
            style={{
              borderRadius: 100,
              height: 70,
              width: 70,
              marginTop: 0,
              marginBottom: 10,
            }}
            onClick={addNewNote}
          >
            <Plus size={40} color="#fff" />
          </button>
        </div>
        <div
          style={{
            display: "inline-block",
            width: "100%",
            height: 500,
            marginTop: 40,
          }}
        >
          {notes.map((note, index) => {
            return (
              <NoteBox
                date={note.createdAt}
                content={note.content}
                id={note._id}
                key={index}
                deleteNote={(id) => deleteNote(id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notes;
