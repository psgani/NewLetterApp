import React from "react";

function LetterList({ letters }) {
  return (
    <div className="mt-4">
      <h3>Your Saved Letters</h3>
      {letters.length === 0 ? (
        <p>No saved letters found.</p>
      ) : (
        <ul className="list-group">
          {letters.map((letter, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <a
                href={`https://docs.google.com/document/d/${letter.fileId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                {letter.title}
              </a>
              <span className="text-muted">{new Date(letter.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LetterList;
