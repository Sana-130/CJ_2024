import React, { useState, useEffect } from 'react';
import { Button, Select, Switch,  Input } from 'antd';
import CodeEditorWindow from './editor';
import { useParams , Link } from 'react-router-dom';
import { submitCode} from '../api';
import { useAuth } from '../context/AuthContext';
import { useData } from  '../context/DataContext';
import CodeBlock from './CodeBlock';
import axios from 'axios';
import qs from 'qs'
 // Import your CodeEditorWindow component

const { Option } = Select;

const javascriptDefault = `// some comment`;

export const Landing = () => {
  const {user} = useAuth();
  const { data , submission , setSubmission} = useData();
  
  const [selectedLanguage, setSelectedLanguage] = useState('c');
  const [code, setCode] = useState(javascriptDefault);
  const [output, setOutput] = useState('');
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [theme, setTheme] = useState('vs-dark');

  const toggleTheme = () => {
    const newTheme = theme === 'vs-dark' ? 'light' : 'vs-dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    const fetchData = async () => {
      /*try {
        const details = await FetchById(id);
        //console.log(details)
        setQuestion(details);
      } catch (error) {
        console.error('Error fetching question details:', error.message);
      }*/
      console.log(data);
      if(data[id]){
        setQuestion(data[id]);
      }
    };

    fetchData();
  }, [id]);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const checkStatus = (data) =>{
    try{
      if(data.status == 200){
        if(data.error!=''){
          setOutput(data.error);
        }else{
          setOutput(data.output);
        }
      }
    }catch(Err){
      console.log(Err);
    }
    
  }


  const onSubmit =() =>{
    //console.log(question);
    submitCode(code, selectedLanguage, user, question)
    .then((success) => {
      if (success) {
        setSubmission({...submission, 
          [question.id]:true})
      }
    })
    .catch((error) => {
      console.error('Error submitting code:', error);
    });
  }
  const mapLang = {
    c:'c',
    cpp:'cpp',
    java:'java',
    python : 'py',
    csharp: 'cs',
    javascript: 'js'
  }
  const onRun = () => {
    //console.log(code);
    let lang = mapLang[selectedLanguage];
    console.log(lang);
    var data = qs.stringify({
        'code':  code,//'print("hello")',
        'language': lang
    });
    console.log(data);
    var config = {
        method: 'post',
        url: 'https://codex-api.fly.dev/',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };

    axios(config)
    .then(function (response) {
        //console.log(JSON.stringify(response.data));
        checkStatus(response.data);
        
    })
    .catch(function (error) {
        console.log(error);
    });
  };
  const codeExample = `
    function greet() {
      console.log('Hello, World!');
    }
  `;

  return (
    <>
    <Link to="/home">Go to home</Link>
    {question?(<div>
      <h1>{question.get('title')}</h1>
      <p>{question.get('description')}</p>
      <p>{question.get('complexity')}</p>
    
    <p>sample input:</p>
    <CodeBlock code={`5`} id={`input`}/>
    <p>sample output: </p>
    <CodeBlock code={`5 is odd \n 8 is odd \n 7 is odd \n 9 odd \n 5 is odd \n 8 is odd \n 7 is odd \n 9 odd `} id={`output`}/>
    </div>):
    (<p>oops not valid id </p>
    )}
    <div>
      
      <label>
        Select Language:
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          style={{ width: 120 }}
        >
          <Option value="c">C</Option>
          <Option value="cpp">C++</Option>
          <Option value="python">Python</Option>
          <Option value="javascript">JavaScript</Option>
          <Option value="java">Java</Option>
          <Option value="csharp">C#</Option>
        </Select>
      </label>
      <Button onClick={onRun}>Run</Button>
      <Button onClick={onSubmit}>Submit</Button>
      {/* Render the CodeEditorWindow component with the dynamic theme */}
      <Switch checked={theme === 'vs-dark'} onChange={toggleTheme} />
      <CodeEditorWindow
        code={code}
        onChange={onChange}
        language={selectedLanguage}
        theme={theme}
      />
      
      <div>
        <label>Output:</label>
        <Input.TextArea
          value={output}
          autoSize={{ minRows: 3, maxRows: 10}}
          readOnly
          style={{ height: '150px', overflowY: 'scroll' }}
        />
      </div>
      {/* Rest of your component content */}
    </div>
    </>
  );
};
