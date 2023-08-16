import React from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { Tooltip } from "antd";

export default function WeeklySparkHeader() {
  const router = useRouter();
  const handleBackPage = () => {
    router.push("/dashboard");
  };

  const text = (
    <div className="text">
      <p>Click on join conversation to fill Spark</p>
    </div>
  );

  return (
    <div className="weeklySparkHeader">
      <div className="backArrow" onClick={handleBackPage}>
        <MdOutlineArrowBackIosNew />
      </div>
      <p className="collegeBuds">Week Spark</p>
      <div className="infoIcon">
        <Tooltip placement="bottomRight" color="white" title={text}>
          <RiInformationLine />
        </Tooltip>
      </div>
    </div>
  );
}
