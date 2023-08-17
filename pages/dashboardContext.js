import React, { createContext, useContext, useState, useEffect } from "react";
import { database } from "@/firebase";
import { ref, child, get, onValue } from "firebase/database";

const UserContext = createContext();

export function UserProvider({ children }) {
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

  return (
    <UserContext.Provider
      value={{
        firstName,
        lastName,
        setFirstName,
        setLastName,
        imageURL,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
