import { createContext, useState, useEffect } from "react";
import { ref, child, get, onValue } from "firebase/database";
import { database } from "@/firebase";

export const SparkContext = createContext();

export const SparkContentContext = ({ children }) => {
  const [sparkContent, setSparkContent] = useState("");
  const [combinedContent, setCombinedContent] = useState("");
  const [groupName, setGroupName] = useState("");
  const [filledSpark, setFilledSpark] = useState("");
  const [sparkURL, setSparkURL] = useState("");
  const [fileList, setFileList] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageURL, setImageURL] = useState("");
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

  useEffect(() => {
    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    if (credentials) {
      const starCountRef = ref(database, "users");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        const ids = Object.keys(data);

        if (snapshot.exists()) {
          for (const userId of ids) {
            console.log("object");
            console.log(userId);
            if (parseCredentials.user.uid == userId) {
              console.log("zxcvbn");

              const userData = data[userId];
              setFirstName(userData.firstName);
              setLastName(userData.lastName);
              setImageURL(userData.profileImageUrl);
            }
          }
        }
      });
    }
  }, []);

  console.log(firstName);

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `/conversations`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((userSnapshot) => {
            const userData = userSnapshot.val();
            if (userData.status === true) {
              setSparkURL(userData.profileImageUrl);
              setGroupName(userData.groupName);
              setFilledSpark(userData.spark);
            }
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
    firstName,
    lastName,
    setFirstName,
    setLastName,
    imageURL,
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
