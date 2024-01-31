import React, { useRef, useEffect } from 'react';

const CodeBlock = ({ code }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [code]);

  return (
    <textarea cols="40"
      ref={textareaRef}
      value={code}
      readOnly // If you want to prevent manual editing
      style={{
        background: 'black',
        overflow: 'hidden', // Prevent vertical scroll (optional)
        resize: 'none',
        border:'none',
        color:'green' // Disable resizing
      }}
    />
  );
}

export default CodeBlock;