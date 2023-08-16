import React from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { Tooltip } from "antd";

export default function FillSparkHeader() {
  const router = useRouter();
  const handleBackPage = () => {
    router.push("weeklySpark");
  };

  const text = (
    <div className="text">
      <p>Fill spark to share it to any group</p>
    </div>
  );

  return (
    <div className="fillSparkHeader">
      <div className="backArrow" onClick={handleBackPage}>
        <MdOutlineArrowBackIosNew />
      </div>
      <p className="fill">Fill Spark</p>
      <div className="infoIcon">
        <Tooltip placement="bottomRight" color="white" title={text}>
          <RiInformationLine />
        </Tooltip>
      </div>
    </div>
  );
}
