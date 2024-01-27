import React from "react";
import AceEditor from "react-ace";
import MonacoEditor from 'react-monaco-editor';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"

const CodeEditor =()=>{
  const options = {
    autoIndent: 'full',
    contextmenu: true,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: 'always',
    minimap: {
      enabled: true,
    },
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18,
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
  }; 

  return (
    <MonacoEditor
      height="400"
      options={options}
    />
    );
    /*function onChange(newValue) {
        console.log("change", newValue);
      }
      
      // Render editor
      return (
        <AceEditor
          mode="c"
          theme="terminal"
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true
          }}
        />
        
      );*/
}

export default CodeEditor;
