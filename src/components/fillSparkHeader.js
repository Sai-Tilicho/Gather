import React from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { useRouter } from "next/router";

export default function FillSparkHeader() {
  const router = useRouter();
  const handleBackPage = () => {
    router.push("weeklySpark");
  };

  return (
    <div className="fillSparkHeader">
      <div className="backArrow" onClick={handleBackPage}>
        <MdOutlineArrowBackIosNew />
      </div>
      <p className="fill">Fill Spark</p>
      <div className="infoIcon">
        <RiInformationLine />
      </div>
    </div>
  );
}
