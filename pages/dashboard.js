import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { Tooltip } from "antd";
import BottomSheet from "@/src/components/bottomSheet";
import { useRouter } from "next/router";
import Groups from "@/src/components/groups";
import { ref, child, get, onValue } from "firebase/database";
import { database } from "@/firebase";

export default function EmptyDashBoard() {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageURL, setImageURL] = useState("");

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

  useEffect(() => {
    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    if (credentials) {
      const starCountRef = ref(database, "users");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        const ids = Object.keys(data);
        if (snapshot.exists()) {
          for (const userId of ids) {
            if (parseCredentials.user.uid == userId) {
              const userData = data[userId];
              setFirstName(userData.firstName);
              setLastName(userData.lastName);
              setImageURL(userData.profileImageUrl);
            }
          }
        }
      });
    }
  }, []);

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
      <div className="groupCards">
        <div className="accessDiv" onClick={handleSparkRoute}>
          <div>This week's Spark</div>
        </div>
        <Groups dashBoard={true} />
      </div>
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
