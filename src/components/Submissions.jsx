import { useParams  } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useEffect, useState } from 'react';
import { getSubByQues, addScore, getUser, deleteScore } from '../api';
import { Input } from 'antd'
import CodeEditorWindow from './editor';
import CodeBlock from './CodeBlock';
import qs from 'qs'
import axios from 'axios';


export const Submissions = () => {
    const { id } = useParams();
    const {data} = useData();
    const [ ques, setQues ] = useState(null);
    const [submissions, setSubmissions] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [code, setCode] = useState(null);
    const [disable, setDisable] = useState(false);
    const [output, setOutput] = useState('');
    const [user, setUser ] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          if(data[id]){
            setQues(data[id]);
          }
            let sub = await getSubByQues(data[id]);
              if(sub){ 
              let u = await getUser(sub[0].user);
              setUser(u);
                //console.log(sub);   
              setSubmissions(sub);
              setCode(sub[0].code);
          }
    };
    
        fetchData();
      }, [id]);

      
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
        var data = qs.stringify({
            'code':  code,//'print("hello")',
            'language':mapLang[submissions[currentIndex].lang]
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
            console.log(JSON.stringify(response.data));
            checkStatus(response.data);
            
        })
        .catch(function (error) {
            console.log(error);
        });
      };

      const handleNext = async() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % submissions.length);
        setCode(submissions[currentIndex + 1].code);
        let res = await getUser(submissions[currentIndex + 1].user);
        setUser(res);
        setDisable(false);
      };
    
      const handlePrev = async() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + submissions.length) % submissions.length 
        );
        setCode(submissions[currentIndex - 1].code);
        let res = await getUser(submissions[currentIndex - 1].user);
        setUser(res);
      };

      const Addbtn = () => {
        let complexity = ques.get('complexity');
        let id = submissions[currentIndex].id;
        addScore(id , complexity)
        .then((success) => {
          if (success) {
            setDisable(true);
            alert('added score');
          }else{
            alert('already addded score')
          }
        })
        .catch((error) => {
          console.error('Error adding score', error);
      });
      }

      const Undo = () => {
        let complexity = ques.get('complexity');
        let id = submissions[currentIndex].id;
        deleteScore(id , complexity, submissions[currentIndex].user)
        .then((success) => {
          if (success) {
            setDisable(false);
            alert('undo done')
          }else{
            alert('there is nothing to undo')
          }
        })
        .catch((error) => {
          console.error('Error adding score', error);
      });
      
      }

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

    return (
        <>
        <div style={{display:'flex', flexDirection:'row'}}>
            {ques?(<div>
        <h1>{ques.get('title')}</h1>
        <p>{ques.get('description')}</p>
        <p>{ques.get('complexity')}</p>
        <p>Expected Input</p>
        <CodeBlock code={ decodeURIComponent(ques.get('input'))} id={`input`}/>
        <p>Expected Output</p>
        <CodeBlock code={decodeURIComponent(ques.get('output'))} id={`output`}/>
        </div>):
        (<p>oops not valid id </p>
        )}
      {submissions && submissions.length > 0 && (
        <div>
          <h3>Total number of submissions : {submissions.length}</h3>
          <p>Submission Details : {user ? user.get('username') : ''} - {user ? user.get('name') : ''} - {submissions[currentIndex].lang}</p>
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            Previous
          </button>
          <button onClick={handleNext} disabled={currentIndex === submissions.length - 1}>
            Next
          </button>
          <button onClick={Addbtn} disabled={submissions[currentIndex].scored}>
            Add Score
          </button>
          <button onClick={Undo} disabled={!(submissions[currentIndex].scored)}>
            Undo
          </button>
          <button onClick={onRun}>Run</button>
          <div style={{display:'flex', flexDirection:'column'}}>
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={submissions[currentIndex].lang}
            theme={'vs-dark'}
          />
      
        <Input.TextArea
          value={output}
          autoSize={{ minRows: 15, maxRows: 15}}
          readOnly
          style={{ width:'720px' , overflowY: 'scroll' , background:'black', border:'none', color:'white'}}
        />

          </div>

        </div>
        
      )}
      </div>

        </>
    )   
}