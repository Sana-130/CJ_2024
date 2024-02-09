import React, { useState, useEffect } from 'react';
import { Button, Select, Switch,  Input, Alert } from 'antd';
import CodeEditorWindow from './editor';
import { useParams , Link } from 'react-router-dom';
import { submitCode} from '../api';
import { useAuth } from '../context/AuthContext';
import { useData } from  '../context/DataContext';
import CodeBlock from './CodeBlock';
import { snippets } from '../code_snippets';
import axios from 'axios';
import qs from 'qs'
 // Import your CodeEditorWindow component

const { Option } = Select;

//`//some comment`;
const Default = snippets['c'];//`//some comments`;

export const Landing = () => {
  const {user} = useAuth();
  const { data , submission , setSubmission} = useData();
  const [selectedLanguage, setSelectedLanguage] = useState('c');
  const [code, setCode] = useState(Default);
  const [output, setOutput] = useState('');
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [theme, setTheme] = useState('vs-dark');

 //snippets[selectedLanguage];
  
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
      if(data[id]){
        setQuestion(data[id]);
      }
    };

    fetchData();
  }, [id]);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    setCode(snippets[mapLang[value]]);
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
          alert("You have successfully submitted");
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
    var data = qs.stringify({
        'code':  code,//'print("hello")',
        'language': lang
    });

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
    <div style={{display:'flex', flexDirection:'row'}}>
    
    {question?(
      <div style={{width:'450px'}}>
        <Link to="/home"><button>View Other Questions</button></Link>
    <div>
      <h2>{question.get('title')}</h2>
      <p>{question.get('description')}</p>
      <b>level - {question.get('complexity')}</b>
    </div>
  
      <div>
      <p>sample input:</p>
      <CodeBlock code={ decodeURIComponent(question.get('input'))} id={`input`}/>
      </div>
      <div>
      <p>sample output: </p>
      <CodeBlock code={decodeURIComponent(question.get('output'))} id={`output`}/>
      </div>
    </div>
    ):
    (<p>oops not valid id </p>
    )}
   
    
      <div style={{display:'flex' , flexDirection:'column', gap:'10px', marginRight:'10px'}}>
      <label>
        
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          style={{ width: 80 }}
        >   
          <Option value="c">C</Option>
          <Option value="cpp">C++</Option>
          <Option value="javascript">JavaScript</Option>
          <Option value="python">Python</Option>
          <Option value="java">Java</Option>
          <Option value="csharp">C#</Option>
        </Select>
      </label>
      <button onClick={onRun}><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></button>
      
      <Switch checked={theme === 'vs-dark'} onChange={toggleTheme} />
      <button onClick={onSubmit}><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></button>
      </div>
      
      {/* editor and output */ }
      <div style={{display:'flex', flexDirection:'column'}}>
      <CodeEditorWindow
        code={code}
        onChange={onChange}
        language={selectedLanguage}
        theme={theme}
      />
        <Input.TextArea
          value={output}
          autoSize={{ minRows: 15, maxRows: 15}}
          readOnly
          style={{ width:'720px' , overflowY: 'scroll' , background:'black', border:'none', color:'white'}}
        />
     
      </div>
      {/* Rest of your component content */}
      </div>
    </>
  );
};
