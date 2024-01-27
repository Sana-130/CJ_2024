import { useParams  } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useEffect, useState } from 'react';
import { getSubByQues, addScore } from '../api';
import { Input } from 'antd'
import CodeEditorWindow from './editor';


export const Submissions = () => {
    const { id } = useParams();
    const {data} = useData();
    const [ ques, setQues ] = useState(null);
    const [submissions, setSubmissions] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [code, setCode] = useState(null);
    const [disable, setDisable] = useState(false);
    const [output, setOutput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          if(data[id]){
            setQues(data[id]);
          }
            let sub = await getSubByQues(data[id]);
              if(sub){ 
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
        let lang = mapLang[selectedLanguage];
        console.log(lang);
        var data = qs.stringify({
            'code':  code,//'print("hello")',
            'language':submissions[currentIndex].lang
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

      const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % submissions.length);
        setCode(submissions[currentIndex + 1].code);
      };
    
      const handlePrev = () => {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + submissions.length) % submissions.length 
        );
        setCode(submissions[currentIndex - 1].code);
      };

      const Addbtn = () => {
        let complexity = ques.get('complexity');
        let id = submissions[currentIndex].id;
        addScore(id , complexity)
        .then((success) => {
          if (success) {
            console.log('success');
            setDisable(true);
          }else{
            console.log("already submitted");
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
            {ques?(<div>
        <h1>{ques.get('title')}</h1>
        <p>{ques.get('description')}</p>
        <p>{ques.get('complexity')}</p>
        </div>):
        (<p>oops not valid id </p>
        )}
         

      {submissions && submissions.length > 0 && (
        <div>
          <h3>Total number of submissions : {submissions.length}</h3>
          <h2>Submission Details</h2>
          <p>{submissions[currentIndex].regno}</p>
          <p>{submissions[currentIndex].name}</p>
          <p>{submissions[currentIndex].code}</p>{/* Add other properties as needed */}
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            Previous
          </button>
          <button onClick={handleNext} disabled={currentIndex === submissions.length - 1}>
            Next
          </button>
          <button onClick={Addbtn} disabled={submissions[currentIndex].scored || disable}>
            Add Score
          </button>
          <button onClick={onRun}>Run</button>
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={submissions[currentIndex].lang}
            theme={'vs-dark'}
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

        </div>
      )}
      

        </>
    )   
}