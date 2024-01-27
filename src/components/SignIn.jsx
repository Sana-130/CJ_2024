import React, { useState } from 'react';
import Parse from 'parse/dist/parse.min.js';
import '../App.css';
import { Button, Divider, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignIn = () => {
  // State variables
  let navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);


  // Function that will return current user and also update current username
  const doUserLogIn = async function (){
    try {
        const loggedInUser = await Parse.User.logIn(username, password);
        
        // logIn returns the corresponding ParseUser object
        alert(
          `Success! User ${loggedInUser.get(
            'username'
          )} has successfully signed in!`
        );
       
        const currentUser = await Parse.User.current();
        //setUser(currentUser.toJSON());
        setUser(currentUser); 
        //console.log(loggedInUser === currentUser);
        // Clear input fields
        setUsername('');
        setPassword('');
        // Update state variable holding current user
        getCurrentUser();
    
        if(currentUser.toJSON().isAdmin == true){
          navigate('/dashboard');
        }else{
          navigate('/home');
        }
        
        return true;
    }catch(err){
        alert(`Error! ${err.message}`);
        return false;
    }
  }

  const getCurrentUser = async function () {
    const currentUser = await Parse.User.current();
    // Update state variable holding current user
    setCurrentUser(currentUser);
    return currentUser;
  };

  return (
    <div>
      <div className="header">
        <h1>CODE JAM</h1>
        <p className="header_text_bold">{'Login'}</p>
      </div>
      <div className="container">
        <h2 className="heading">{'User Login'}</h2>
        <Divider />
        <div className="form_wrapper">
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            size="large"
            className="form_input"
          />
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            size="large"
            type="password"
            className="form_input"
          />
        </div>
        <div className="form_buttons">
          <Button
            onClick={() => doUserLogIn(username, password)}
            type="primary"
            className="form_button"
            color={'#208AEC'}
            size="large"
            block
          >
            Log In
          </Button>
        </div>
        <Divider />
      </div>
    </div>
  );
};