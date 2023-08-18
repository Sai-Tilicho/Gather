import Header from "@/src/components/conversationHeader";
import { SparkContext } from "@/src/components/sparkContentContext";
import SparkSection from "@/src/components/sparkSection";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

export default function DisplayConversation() {
  const {
    sparkContent,
    setSparkContent,
    filledSpark,
    sparkURL,
    imageURL,
    firstName,
    lastName,
    setLogin,
  } = useContext(SparkContext);

  const splitSpark = filledSpark.split("📷");

  const [messageTimestamp, setMessageTimestamp] = useState(new Date());
  const [timeAgoString, setTimeAgoString] = useState("Just Now");
  const router = useRouter();

  const firstLetter = firstName.toUpperCase();
  const lastLetter = lastName.toUpperCase();

  useEffect(() => {
    if (sparkContent && sparkContent.timestamp) {
      setMessageTimestamp(new Date(sparkContent.timestamp));
    }
  }, [sparkContent]);

  const handleStart = () => {
    router.push("/weeklySpark");
  };

  const getTimeAgoString = () => {
    const currentTimestamp = new Date();
    const timeDifference = currentTimestamp - messageTimestamp;
    const seconds = Math.floor(timeDifference / 1000);
    const hours = Math.floor(timeDifference / 3600000);
    const minutes = Math.floor(timeDifference / 60000);
    const days = Math.floor(timeDifference / 86400000);

    if (seconds < 60) {
      return "Just Now";
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "min" : "mins"} `;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? "hr" : "hrs"} `;
    } else {
      return `${days} ${days === 1 ? "day" : "days"} `;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageTimestamp(new Date());
      setTimeAgoString(getTimeAgoString());
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="conversationDiv">
      <Header />
      <div className="horizontalLine"></div>
      <div className="sparkConversation">
        <SparkSection
          setSparkContent={setSparkContent}
          sparkContent={sparkContent}
        />
      </div>
      {splitSpark ? (
        <div>
          <div>
            <div className="imageSparkContent">
              {imageURL ? (
                <img
                  className="imageProfile"
                  src={imageURL}
                  width={53.33}
                  height={53.33}
                />
              ) : (
                <p className="profileName">
                  {firstLetter[0]}
                  {lastLetter[0]}
                </p>
              )}
              <div className="sparkmsgHead">
                <div style={{ fontSize: "17pt" }}>You</div>
                <div
                  style={{
                    fontSize: "12pt",
                  }}
                >
                  {timeAgoString}
                </div>
              </div>
            </div>
          </div>
          <div className="sparkMsg">{splitSpark[0]}</div>
          <div>
            {sparkURL ? (
              <img
                className="sparkImage"
                src={sparkURL}
                alt="spark image"
                width={440.66}
              />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className="sparkAlert">conversation not started yet !</p>
          <div className="startDiv">
            <button className="start" onClick={handleStart}>
              Start Conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
