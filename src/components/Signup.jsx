import React, { useState } from 'react';
import Parse from 'parse/dist/parse.min.js';

import { Button, Divider, Input } from 'antd';
import '../App.css';

const doUserRegistration = async function (username, password, name) {
    
    const Person = new Parse.Object('_User');
    Person.set('name', name);
    Person.set('username', username);
    Person.set('password', password);
    try {
      await Person.save();
      alert(
        `Success! User was successfully created!`
      );
      return true;
    } catch (error) {
      alert(`Error! ${error}`);
      return false;
    }
  };
  

export const SignUp = () => {
  // State variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <div>
      <div className="setup">
      <div className="header">
        <h1>CODE JAM </h1>
      </div>
      <div className="container">
        <h2 className="heading">{'User Registration'}</h2>
        <Divider />
        <div className="form_wrapper">
        <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="name"
            size="large"
            type="text"
            className="form_input"
          />
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Reg No"
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
            onClick={() => doUserRegistration(username, password, name)}
            type="primary"
            className="form_button"
            color={'#208AEC'}
            size="large"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};