import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { Tooltip } from "antd";
import BottomSheet from "@/src/components/bottomSheet";
import { useRouter } from "next/router";
import { SparkContext } from "@/src/components/sparkContentContext";
import GroupContacts from "@/src/components/groupContacts";
import GroupList from "@/src/components/groupList";
import Groups from "@/src/components/groups";
import Link from "next/link";

export default function EmptyDashBoard() {
  const [open, setOpen] = useState(false);
  const { firstName, lastName, imageURL } = useContext(SparkContext);
  const router = useRouter();
  const showDrawer = () => {
    setOpen(true);
  };

  const handleRouteProfileEdit = () => {
    router.push("/profileEdit");
  };

  const handleSparkRoute = () => {
    router.push("/weeklySpark");
  };

  const firstLetter = firstName.toUpperCase();
  const lastLetter = lastName.toUpperCase();

  const text = (
    <div className="textToolTip">
      <div className="headTextToolTip">Start a Meaningful Conversation</div>
      <div className="paraTextToolTip">
        Choose who you want to deepen your relationship with.
      </div>
    </div>
  );
  return (
    <div className="emptyContactsMainPage">
      <div className="emptyContactHeader">
        <div className="profile" onClick={handleRouteProfileEdit}>
          {imageURL ? (
            <img
              className="imageProfile"
              src={imageURL}
              width={42.66}
              height={42.66}
            />
          ) : (
            <p className="paraProfile">
              {firstLetter[0]}
              {lastLetter[0]}
            </p>
          )}
        </div>
        <div className="conversation">Conversations</div>
        <div className="editIcon" onClick={showDrawer}>
          <Tooltip placement="bottomRight" color={"white"} title={text}>
            <Image
              className="EditImg"
              src={"/assets/editButton1.png"}
              alt="edit"
              width={32}
              height={32}
            />
          </Tooltip>
        </div>
      </div>
      <div className="accessDiv" onClick={handleSparkRoute}>
        <div>This week's Spark</div>
      </div>
      <Groups />

      <div className="bottomSheet">
        {open && (
          <div onClick={() => setOpen(false)}>
            <BottomSheet />
          </div>
        )}
      </div>
    </div>
  );
}
