import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { allScores } from '../api';// Update the path accordingly

const ScoreBoard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await allScores();
        setScores(result);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  return (
    <div>
      <h2>Scoreboard</h2>
      <table style={{border:'white'}}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
            <th>Submissions</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.username}</td>
              <td>{score.score}</td>
              <td>
                <Link to={`/submissions/user/${score.user_id}`}>View Submissions</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreBoard;
