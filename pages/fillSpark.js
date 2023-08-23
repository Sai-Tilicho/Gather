import FillSparkContent from "@/src/components/fillSparkContent";
import FillSparkHeader from "@/src/components/fillSparkHeader";
import { SparkContext } from "@/src/components/context/sparkContentContext";
import React, { useContext, useState } from "react";

export default function FillSpark() {
  const { sparkContent } = useContext(SparkContext);

  return (
    <div className="fillSpark">
      <FillSparkHeader />

      <div className="horizontalLine"></div>

      <div className="fillSparkContent">
        <FillSparkContent content={sparkContent} />
      </div>
    </div>
  );
}
