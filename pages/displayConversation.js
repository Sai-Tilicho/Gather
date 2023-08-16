import Header from "@/src/components/conversationHeader";
import { SparkContext } from "@/src/components/sparkContentContext";
import SparkSection from "@/src/components/sparkSection";
import React, { useContext } from "react";

export default function DisplayConversation() {
  const { sparkContent, setSparkContent, filledSpark, sparkURL } =
    useContext(SparkContext);

  const splitSpark = filledSpark.split("📷");

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
      <div>
        <div className="imageSpaekContent">
          <img src={"/assets/favicon.ico"} width={53.33} height={53.33} />
          <div className="sparkmsgHead">
            <div style={{ fontSize: "17pt" }}>You</div>
            <div style={{ fontSize: "12pt" }}>just now</div>
          </div>
        </div>
      </div>
      <div className="sparkMsg">{splitSpark[0]}</div>
      <div>
        <img src={sparkURL} alt="spark image" width={386.66} height={284} />
      </div>
    </div>
  );
}
