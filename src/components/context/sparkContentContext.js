import { createContext, useState } from "react";

export const SparkContext = createContext();

export const SparkContentContext = ({ children }) => {
  const [sparkContent, setSparkContent] = useState("");
  const [combinedContent, setCombinedContent] = useState("");
  const [groupName, setGroupName] = useState("");
  const [filledSpark, setFilledSpark] = useState("");
  const [sparkURL, setSparkURL] = useState("");
  const [fileList, setFileList] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registeredFirstName, setRegisteredFirstName] = useState("");
  const [registeredLasttName, setRegisteredLasttName] = useState("");
  const [user, setUser] = useState();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [emailNotFoundError, setEmailNotFoundError] = useState("");
  const [sparkData, setSparkData] = useState(false);

  const contextValue = {
    sparkContent,
    setSparkContent,
    combinedContent,
    setCombinedContent,
    groupName,
    setGroupName,
    filledSpark,
    setFilledSpark,
    fileList,
    setFileList,
    sparkURL,
    groupData,
    setGroupData,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registeredFirstName,
    setRegisteredFirstName,
    registeredLasttName,
    setRegisteredLasttName,
    user,
    setUser,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    firstNameError,
    setFirstNameError,
    lastNameError,
    setLastNameError,
    showPassword,
    setShowPassword,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginPasswordError,
    setLoginPasswordError,
    emailNotFoundError,
    setEmailNotFoundError,
  };

  return (
    <SparkContext.Provider value={contextValue}>
      {children}
    </SparkContext.Provider>
  );
};
