import React, { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { SparkContext } from "./context/sparkContentContext";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

import { useRouter } from "next/router";
import Groups from "./groups";

const GroupList = () => {
  const { groupData } = useContext(SparkContext);
  const router = useRouter();

  const handleBack = () => {
    router.push("/fillSpark");
  };
  const handleEmptydata = () => {
    router.push("/displayContactsList");
  };
  return (
    <div className="groupList">
      <div className="groupHeader">
        <div onClick={handleBack} style={{ cursor: "pointer" }}>
          <MdOutlineArrowBackIosNew />
        </div>
        <div className="forward">Forward to...</div>
      </div>
      <div className="groupNames">
        <Groups />
        {groupData == null && (
          <div className="buttonDiv">
            <button className="btn" onClick={handleEmptydata}>
              Create Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
