import React, { useContext } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const handleBackPage = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      <div className="conversationHeader">
        <div className="backArrow" onClick={handleBackPage}>
          <MdOutlineArrowBackIosNew />
        </div>
        <p className="groupName">Group Name</p>
        <div className="info">
          <RiInformationLine />
        </div>
      </div>
    </div>
  );
}
