import { SparkContext } from "@/src/components/sparkContentContext";
import SparkSection from "@/src/components/sparkSection";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import { database } from "@/firebase";
import Header from "@/src/components/conversationHeader";

export default function DisplayConversation() {
  const { sparkContent, setSparkContent, setGroupName } =
    useContext(SparkContext);
  const router = useRouter();

  const [conversationData, setConversationData] = useState({});
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    const storedGroupId = localStorage.getItem("groupId");

    if (storedGroupId) {
      const conversationRef = ref(database, `conversations/${storedGroupId}`);

      get(conversationRef)
        .then((groupSnapshot) => {
          if (groupSnapshot.exists()) {
            const groupData = groupSnapshot.val();
            setConversationData(groupData);
          } else {
            const conversationRef = ref(
              database,
              `group/${parseCredentials.user.uid}/${storedGroupId}`
            );
            get(conversationRef).then((groupSnapshot) => {
              if (groupSnapshot.exists()) {
                const groupData = groupSnapshot.val();
                setGroupName(groupData.group_name);
              }
            });
            console.log("No data available for the stored group ID");
          }
        })
        .catch((error) => {
          console.error("Error fetching conversation data:", error);
        });
    }
  }, [conversationData]);

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
            if (parseCredentials.user.uid == userId) {
              const userData = data[userId];
              setUserData(userData);
            }
          }
        }
      });
    }
  }, []);
  const firstLetter = userData.firstName;
  const secondLetter = userData.lastName;

  const handleStart = () => {
    router.push("/weeklySpark");
  };

  return (
    <div className="conversationDiv">
      <Header />
      <div className="horizontalLine"></div>
      <div className="displayPage">
        <div className="sparkConversation">
          <SparkSection
            setSparkContent={setSparkContent}
            sparkContent={sparkContent}
          />
        </div>
        {Object.keys(conversationData).length > 0 ? (
          Object.keys(conversationData).map((conversationId) => {
            const conversation = conversationData[conversationId];
            const groupName = conversation.groupName;
            const splitSpark = conversation.spark.split("📷");

            setGroupName(groupName);

            return (
              <div key={conversationId} className="conversationContainer">
                <div className="imageSparkContent">
                  {userData.profileImageUrl ? (
                    <img
                      className="imageProfile"
                      src={userData.profileImageUrl}
                      width={53.33}
                      height={53.33}
                    />
                  ) : (
                    <p className="profileName">
                      {firstLetter[0].toUpperCase()}
                      {secondLetter[0].toUpperCase()}
                    </p>
                  )}
                  <div className="sparkmsgHead">
                    <div style={{ fontSize: "17pt" }}>You</div>
                    <div style={{ fontSize: "12pt" }}></div>
                  </div>
                </div>
                <div className="sparkMsg">{splitSpark[0]}</div>
                {conversation.profileImageUrl && (
                  <img
                    className="sparkImage"
                    src={conversation?.profileImageUrl}
                    alt="spark image"
                    width={440.66}
                  />
                )}
              </div>
            );
          })
        ) : (
          <div>
            <p className="sparkAlert">No conversations available yet!</p>
            <div className="startDiv">
              <button className="startConversation" onClick={handleStart}>
                Start Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}