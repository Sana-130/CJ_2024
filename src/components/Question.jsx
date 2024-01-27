// Question.jsx
import React from 'react';

const Question = ({ title, complexity, score }) => {
  return (
    
      <div className="question-box">
        <h3>{title}</h3>
        <p>Complexity: {complexity}</p>
        <p>Score: {score}</p>
        {/* Add more details as needed */}
      </div>
  );
};

export default Question;
