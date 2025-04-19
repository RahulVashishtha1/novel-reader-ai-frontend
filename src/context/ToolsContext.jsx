import { createContext, useState, useContext } from 'react';

const ToolsContext = createContext();

export const ToolsProvider = ({ children }) => {
  const [showTools, setShowTools] = useState(false);

  const toggleTools = () => {
    setShowTools(!showTools);
  };

  return (
    <ToolsContext.Provider value={{ showTools, setShowTools, toggleTools }}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => useContext(ToolsContext);
