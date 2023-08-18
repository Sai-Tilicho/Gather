import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { SparkContext } from "./sparkContentContext";
import { storage } from "@/firebase";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import Router from "next/router";
import {
  getDownloadURL,
  ref as reference,
  uploadBytes,
} from "firebase/storage";
import GroupContacts from "./groupContacts";
import { useRouter } from "next/router";
import Groups from "./groups";

const GroupList = () => {
  const { fileList, groupData } = useContext(SparkContext);
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
        <div onClick={handleBack}>
          <MdOutlineArrowBackIosNew />
        </div>
        <div className="forward">Forward to...</div>
      </div>
      {/* <div className="groupData">
        <GroupContacts handleSharing={handleSharing} />
      </div> */}
      <Groups />
      {groupData == null && (
        <div className="buttonDiv">
          <button className="btn" onClick={handleEmptydata}>
            Create Group
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupList;
