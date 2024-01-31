import { fetchQues } from "../api";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Question from "./Question";


export const Admin = () => {
    const {user } =useAuth();
    const {data, setData} = useData();
 
    
    const userObj = user.toJSON();
    const isAdmin = userObj.isAdmin;


    const fetchQuestionsData= async() =>{
        let ques = await fetchQues();
        setData(ques);
    }
    useEffect(() => {
        fetchQuestionsData();
      }, []);

  return (
    <>
      {isAdmin ? (
        <div style={{ paddingLeft: "0px" }}>
          <button>
          <Link to="/scores" style={{ textDecoration: "none", color: "inherit",paddingBottom:"300px" }}>
              View ScoreBoard
            </Link>
          </button>
          <h2>Questions</h2>
          {data ? (
            <ul style={{ textAlign: "left" }}>
              {Object.keys(data).map((key) => {
                return (
                  <li key={key}>
                    <div>
                      <Link to={`/submissions/${key}`}>
                        <Question
                          title={data[key].get("title")}
                          complexity={data[key].get("complexity")}
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
      ) : (
        <p>There's nothing to see here: 404!</p>
      )}
    </>
  );
};
