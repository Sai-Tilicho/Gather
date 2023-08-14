import React from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { useRouter } from "next/router";

export default function WeeklySparkHeader() {
  const router = useRouter();
  const handleBackPage = () => {
    router.push("/dashboard");
  };

  return (
    <div className="weeklySparkHeader">
      <div className="backArrow" onClick={handleBackPage}>
        <MdOutlineArrowBackIosNew />
      </div>
      <p className="collegeBuds">Week Spark</p>
      <div className="infoIcon">
        <RiInformationLine />
      </div>
    </div>
  );
}
