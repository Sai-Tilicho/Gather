import Header from "@/src/components/conversationHeader";
import { SparkContext } from "@/src/components/sparkContentContext";
import SparkSection from "@/src/components/sparkSection";
import React, { useContext } from "react";

export default function DisplayConversation() {
  const { sparkContent, setSparkContent } = useContext(SparkContext);
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
    </div>
  );
}
