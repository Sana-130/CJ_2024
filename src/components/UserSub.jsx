import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Details, fetchById } from '../api'; // Update the path accordingly

export const UserSub = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await Details(id);
        setSubmissions(result);
      } catch (error) {
        console.error('Error fetching user submissions:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <h2>User Submissions</h2>
      <ul>
        {submissions.map((submission, index) => (
          <li key={index}>{submission}</li>
        ))}
      </ul>
    </div>
  );
};

