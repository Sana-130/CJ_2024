import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchQues } from "../api";
import Question from "./Question";
import { useData } from "../context/DataContext";


export const Home = () =>{
    const { user } = useAuth();
    const { data, setData , submission} = useData();

    const userObj = user.toJSON();
    //const [questions, setQuestions] = useState([]);

    const fetchQuestionsData = async () => {
        try {
          const questionsData = await fetchQues();
          //setQuestions(questionsData);
          setData(questionsData);
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };
    
      useEffect(() => {
        fetchQuestionsData();
      }, []);
     
    return (
      <>
      <h1>hello {userObj.name}</h1>
      <Link to="/dashboard">Go to Dashboard</Link>
      <Link to="/admin">Admin</Link>
      <div>
        <h2>Questions</h2>
        {data ? (
          <ul>
            {Object.keys(data).map((key) => {
              return (
               
                <li key={key}>
                  <div
                  style={{
                    border: submission[key] ? '2px solid green' : '2px solid red',
                    padding: '10px',
                    margin: '10px',
                  }}>
                     <Link to={`/question/${key}`}>
                    <Question
                      title={data[key].get('title')}
                      complexity={data[key].get('complexity')}
                    />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </>
    );
}