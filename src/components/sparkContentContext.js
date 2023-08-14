import { createContext, useState } from "react";

export const SparkContext = createContext();

export const SparkContentContext = ({ children }) => {
  const [sparkContent, setSparkContent] = useState("");
  const [combinedContent, setCombinedContent] = useState("");

  const contextValue = {
    sparkContent,
    setSparkContent,
    combinedContent,
    setCombinedContent,
  };

  return (
    <SparkContext.Provider value={contextValue}>
      {children}
    </SparkContext.Provider>
  );
};
