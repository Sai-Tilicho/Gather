import React, { useContext, useState } from "react";
import WeeklySparkHeader from "@/src/components/weeklySparkHeader";
import { useRouter } from "next/router";
import { SparkContext } from "@/src/components/sparkContentContext";
import SparkSection from "@/src/components/sparkSection";

export default function WeeklySpark() {
  const { sparkContent, setSparkContent, setFileList } =
    useContext(SparkContext);
  const router = useRouter();

  const handleFillSpark = () => {
    setFileList([]);
    router.push("fillSpark");
  };

  return (
    <div className="weeklySpark">
      <WeeklySparkHeader />
      <div className="horizontalLine"></div>

      <div className="spark">
        <SparkSection
          setSparkContent={setSparkContent}
          sparkContent={sparkContent}
        />

        <button className="join" onClick={handleFillSpark}>
          Join Conversation
        </button>
      </div>
    </div>
  );
}
