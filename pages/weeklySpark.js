import React, { useContext, useState, useEffect } from "react";
import WeeklySparkHeader from "@/src/components/weeklySparkHeader";
import { useRouter } from "next/router";
import { SparkContext } from "@/src/components/context/sparkContentContext";
import SparkSection from "@/src/components/sparkSection";
import { LoadingOutlined } from "@ant-design/icons";

export default function WeeklySpark() {
  const { sparkContent, setSparkContent, setFileList } =
    useContext(SparkContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleFillSpark = () => {
    setFileList([]);
    router.push("fillSpark");
  };

  return (
    <div className="weeklySpark">
      <WeeklySparkHeader />
      <div className="horizontalLine"></div>
      <div>
        {isLoading ? (
          <div className="loader">
            <LoadingOutlined spin />
          </div>
        ) : (
          <div className="spark">
            <>
              <SparkSection
                setSparkContent={setSparkContent}
                sparkContent={sparkContent}
              />

              <button className="join" onClick={handleFillSpark}>
                Join Conversation
              </button>
            </>
          </div>
        )}
      </div>
    </div>
  );
}
