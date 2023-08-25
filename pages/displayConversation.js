import { SparkContext } from "@/src/components/context/sparkContentContext";
import SparkSection from "@/src/components/sparkSection";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import { database } from "@/firebase";
import Header from "@/src/components/conversationHeader";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";

export default function DisplayConversation() {
  const { sparkContent, setSparkContent, setGroupName } =
    useContext(SparkContext);
  const router = useRouter();
  const [conversationData, setConversationData] = useState({});
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [like, setLike] = useState(false);
  const [likesMap, setLikesMap] = useState({});

  useEffect(() => {
    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    const storedGroupId = localStorage.getItem("groupId");

    const conversationDataFromDB = () => {
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
                `group/${parseCredentials?.user?.uid}/${storedGroupId}`
              );
              get(conversationRef).then((groupSnapshot) => {
                if (groupSnapshot.exists()) {
                  const groupData = groupSnapshot.val();
                  setGroupName(groupData?.group_name);
                }
              });
              console.log("No data available for the stored group ID");
            }
          })
          .catch((error) => {
            console.error("Error fetching conversation data:", error);
          });
      }
    };
    conversationDataFromDB();
    const intervalId = setInterval(conversationDataFromDB, 1000);
    return () => clearInterval(intervalId);
  }, [conversationData, setGroupName]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    const fetchingUserData = () => {
      if (credentials) {
        const starCountRef = ref(database, "users");
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          const ids = Object.keys(data);
          if (snapshot.exists()) {
            for (const userId of ids) {
              if (parseCredentials?.user?.uid == userId) {
                const userData = data[userId];
                setUserData(userData);
              }
            }
          }
        });
      }
    };
    fetchingUserData();
  }, []);

  const firstLetter = userData.firstName;
  const secondLetter = userData.lastName;

  const handleStart = () => {
    router.push("/weeklySpark");
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();

    const tsDate = new Date(timestamp);

    const timeDifference = now - tsDate;

    if (timeDifference < 60000) {
      return "just now";
    } else if (timeDifference < 3600000) {
      const minutes = Math.floor(timeDifference / 60000);
      return `${minutes} min`;
    } else if (timeDifference < 86400000) {
      const hours = Math.floor(timeDifference / 3600000);
      return `${hours} hr`;
    } else {
      const days = Math.floor(timeDifference / 86400000);
      return `${days} days`;
    }
  };

  const handleLike = (conversationId) => {
    const updatedLikesMap = { ...likesMap };
    updatedLikesMap[conversationId] = !likesMap[conversationId];
    setLikesMap(updatedLikesMap);
  };

  return (
    <div className="conversationDiv">
      <Header />
      <div className="horizontalLine"></div>
      {isLoading ? (
        <div className="loader">
          <LoadingOutlined spin />
        </div>
      ) : (
        <div className="displayPage">
          <div className="sparkConversation">
            <SparkSection
              setSparkContent={setSparkContent}
              sparkContent={sparkContent}
            />
          </div>
          {Object.keys(conversationData).length > 0
            ? Object.keys(conversationData).map((conversationId) => {
                const conversation = conversationData[conversationId];
                const groupName = conversation.groupName;
                const time_stamp = conversation.time_stamp;
                const splitSpark = conversation.spark.split("📷");

                setGroupName(groupName);

                return (
                  <div key={conversationId} className="conversationContainer">
                    {isLoading ? (
                      <div className="loader conversationLoader">
                        <LoadingOutlined spin />
                      </div>
                    ) : (
                      <div>
                        <div className="imageSparkContent">
                          {userData.profileImageUrl ? (
                            <Image
                              className="imageProfile"
                              src={userData.profileImageUrl}
                              alt={"profileImage"}
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
                            <div style={{ fontSize: "12pt" }}>
                              {formatTimestamp(time_stamp)}
                            </div>
                          </div>
                        </div>
                        <div className="sparkMsg">{splitSpark[0]}</div>
                        {conversation.profileImageUrl && (
                          <Image
                            className="sparkImage"
                            src={conversation?.profileImageUrl}
                            alt="spark image"
                            width={440}
                            height={0}
                          />
                        )}
                        <div className="iconsDiv">
                          <div
                            className="iconsLike"
                            onClick={() => handleLike(conversationId)}
                          >
                            {likesMap[conversationId] ? (
                              <Image
                                className="like"
                                src="/assets/heartLike.png"
                                alt="disLike"
                                width={35}
                                height={35}
                              />
                            ) : (
                              <Image
                                className="disLike"
                                src="/assets/heart.png"
                                alt="like"
                                width={35}
                                height={35}
                              />
                            )}
                          </div>
                          <div>
                            <Image
                              className="comment"
                              src="/assets/comment.png"
                              alt="like"
                              width={32}
                              height={32}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            : conversationData && (
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
      )}
    </div>
  );
}
