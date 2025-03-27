import React from "react";

function Navbar({ user, onLogout, showLetters, setShowLetters }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white mb-4 px-4 py-3 rounded shadow-sm border">
      <div className="d-flex align-items-center w-100 justify-content-between flex-wrap">
        <div className="text-dark font-weight-bold h5 mb-2 mb-lg-0">
          👋 Welcome, <span className="text-primary">{user?.name || "User"}</span>
        </div>
        <div className="btn-group">
          {/* <button
            className={`btn btn-${showLetters ? "outline-secondary" : "outline-info"}`}
            onClick={() => setShowLetters(!showLetters)}
          >
            {showLetters ? "Hide Letters" : "Show Letters"}
          </button> */}
          <button
            className="btn btn-outline-danger"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
