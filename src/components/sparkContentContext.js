import { createContext, useState, useEffect } from "react";
import { getDatabase, ref, child, get } from "firebase/database";
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

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `/conversations`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((userSnapshot) => {
            const userData = userSnapshot.val();
            if (userData.status === true) {
              setSparkURL(userData.profileImageUrl);
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

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `/conversations`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((conversations) => {
            const userData = conversations.val();
            if (userData.status === true) {
              setGroupName(userData.groupName);
              setFilledSpark(userData.spark);
              return;
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
  };

  return (
    <SparkContext.Provider value={contextValue}>
      {children}
    </SparkContext.Provider>
  );
};
