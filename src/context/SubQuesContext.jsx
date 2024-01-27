import React, { createContext, useContext, useState } from 'react';

const SubQuesContext = createContext();

export const SubQuesProvider = ({ children }) => {
  const [data, setSubQues] = useState(null);

  return (
    <SubQuesContext.Provider value={{ data, setSubQues }}>
      {children}
    </SubQuesContext.Provider>
  );
};

export const useSubQues = () => {
  return useContext(SubQuesContext);
};