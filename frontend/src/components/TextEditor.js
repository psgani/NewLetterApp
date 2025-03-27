import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

function TextEditor({ user, refreshLetters }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const saveToGoogleDrive = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/save`,
        { content, title, googleId: user.googleId },
        { withCredentials: true }
      );

      console.log("File saved:", response.data);
      alert("Saved to Google Drive!");
      setContent(""); 
      setTitle("");   
      refreshLetters(); 
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save.");
    }
  };

  return (
    <div className="p-4 w-100">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="border rounded shadow-sm p-3 bg-white" style={{ height: "200px" }}>
        <ReactQuill value={content} onChange={setContent} style={{ height: "130px" }} />
      </div>
      <button className="btn btn-primary w-100 mt-3" onClick={saveToGoogleDrive}>
        Save to Google Drive
      </button>
    </div>
  );
}

export default TextEditor;
