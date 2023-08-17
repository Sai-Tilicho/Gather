import { createContext, useState, useEffect } from "react";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
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

  useEffect(() => {
    const dbRef = ref(database);

    const starCountRef = ref(database, "users");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (!!data) {
        Object.values(data).forEach((userData) => {
          if (userData.status === "true") {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setImageURL(userData.profileImageUrl);
          }
        });
      } else {
        console.log("No data available");
      }
    });
  }, []);

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
  };

  return (
    <SparkContext.Provider value={contextValue}>
      {children}
    </SparkContext.Provider>
  );
};
