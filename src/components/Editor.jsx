import React, { useEffect, useState } from "react";
import { Switch } from 'antd';
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");
  const [Theme, setTheme] = useState('vs-dark');

  useEffect(() => {
    
  }, [Theme]);

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };
  
  const toggleTheme = () => {
    const newTheme = Theme === 'vs-dark' ? 'light' : 'vs-dark';
    setTheme(newTheme);
  };
  
  //value={value}
  //theme={Theme}
  //defaultValue={`\\some comment`}

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      
      <Editor
        height="70vh"
        width='720px'
        language={language || "javascript"}
        value={code}
        theme={theme}
        defaultValue={code}
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;