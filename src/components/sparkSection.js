import React from "react";
import Image from "next/image";
import WeeklySparkContentFetcher from "./weeklySparkComponentFetcher";
import SparkContent from "./sparkContent";

const SparkSection = ({ setSparkContent, sparkContent }) => {
  return (
    <div>
      <div className="topRightDesign">
        <Image
          src={"/assets/topRightSpark.png"}
          alt="topRightDesign"
          width={30}
          height={34.7}
        />
      </div>
      <p className="sparkHeading">This week’s spark</p>
      <WeeklySparkContentFetcher setSparkContent={setSparkContent} />
      <div className="sparkContent">
        <SparkContent content={sparkContent} />
      </div>
    </div>
  );
};

export default SparkSection;
