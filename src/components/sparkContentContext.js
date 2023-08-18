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
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    if (credentials && isLogin) {
      const starCountRef = ref(database, "users");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        const ids = Object.keys(data);
        if (snapshot.exists()) {
          for (const userId of ids) {
            if (parseCredentials.user.uid == userId) {
              const userData = data[userId];
              setFirstName(userData.firstName);
              setLastName(userData.lastName);
              setImageURL(userData.profileImageUrl);
            }
          }
        }
      });
    }
  }, [isLogin]);

  useEffect(() => {
    setLogin(true);
    (async () => {
      const storedGroupId = await localStorage.getItem("groupId");
      const storedConversationId = await localStorage.getItem(
        "newConversationId"
      );
      if (storedGroupId && storedConversationId) {
        const conversationRef = ref(
          database,
          `conversations/${storedGroupId}/${storedConversationId}`
        );
        get(conversationRef)
          .then((conversationSnapshot) => {
            if (conversationSnapshot.exists()) {
              const conversationData = conversationSnapshot.val();
              setGroupName(conversationData.groupName);
              setFilledSpark(conversationData.spark);
              setSparkURL(conversationData.profileImageUrl);
            } else {
              console.log("No data available for the stored group ID");
            }
          })
          .catch((error) => {
            console.error("Error fetching conversation data:", error);
          });
      }
    })();
  }, [isLogin]);

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
    isLogin,
    setLogin,
  };

  return (
    <SparkContext.Provider value={contextValue}>
      {children}
    </SparkContext.Provider>
  );
};
