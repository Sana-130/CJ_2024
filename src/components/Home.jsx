import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchQues } from "../api";
import Question from "./Question";
import Logo from '../assets/logo.png'
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

      // style={{
       // border: submission[key] ? '2px solid #4CAF50' : '2px solid #E74C3C',
      //}}
     
    return (
      <>
      
       <div className="header">
        <h1>CODE JAM </h1> <img src={Logo} alt="Code Jam Image" width="80px" height="95px" /><h2>hello {userObj.name}</h2>
        <ul style={{listStyle:'none'}}><li><b>Score Board</b></li><li>Easy   -  200 </li><li>Medium - 400</li><li>Hard - 800</li></ul>
        </div>
     
        {data ? (
          <data className="grid-container">
            {Object.keys(data).map((key) => {
              return (
                  <div
                  key={key}
                  className="box"
                 >
                     <Link to={`/question/${key}`}>
                    <Question
                      title={data[key].get('title')}
                      complexity={data[key].get('complexity')}
                      done={ submission[key] }
                    />
                    </Link>
                  </div>
              );
            })}
         </data>
        ) : (
          <p>No data available</p>
        )}
      
    </>
    );
}