import React, { useEffect, useState } from "react";
import axios from "axios";
import TextEditor from "./components/TextEditor";
import LetterList from "./components/LetterList";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLetters, setShowLetters] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        fetchLetters();
      })
      .catch((err) => console.error("User fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const fetchLetters = () => {
    axios
      .get("http://localhost:5000/api/letters", { withCredentials: true })
      .then((res) => setLetters(res.data))
      .catch((err) => console.error("Error fetching letters:", err));
  };

  const login = () => window.open("http://localhost:5000/auth/google", "_self");

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light p-0">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <p className="text-muted">Loading...</p>
        </div>
      ) : user ? (
        <>
          <Navbar
            user={user}
            onLogout={handleLogout}
            showLetters={showLetters}
            setShowLetters={setShowLetters}
          />
          <div className="container py-3">
            <div className="row">
              <div className="col-12 col-lg-8 mb-4">
                <TextEditor user={user} refreshLetters={fetchLetters} />
              </div>
              <div className="col-12 col-lg-4">
                {showLetters && <LetterList letters={letters} />}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center bg-white p-5 rounded shadow">
            <h2 className="mb-3 text-dark">Login to Access the Editor</h2>
            <button className="btn btn-success px-4 py-2" onClick={login}>
              Login with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
