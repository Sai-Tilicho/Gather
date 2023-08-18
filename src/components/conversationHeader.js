import React, { useContext } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { SparkContext } from "./sparkContentContext";

export default function Header() {
  const { groupName } = useContext(SparkContext);
  const router = useRouter();
  const handleBackPage = () => {
    router.push("/weeklySpark");
  };

  return (
    <div>
      <div className="conversationHeader">
        <div className="backArrow" onClick={handleBackPage}>
          <MdOutlineArrowBackIosNew />
        </div>
        <p className="groupName">{groupName}</p>
        <div className="info">
          <RiInformationLine />
        </div>
      </div>
    </div>
  );
}
