import React, { useEffect, useState } from "react";
import { getDataFromDb } from "@/firebase";
import { Empty } from "antd";
import Image from "next/image";

export default function GroupContacts({ handleSharing = () => { } }) {
  const [groupData, setGroupData] = useState(null);
  const [parseCredentials, setParseCredentials] = useState(null);
  const formatTimestamp = (timestamp) => {
    const now = new Date();

    const tsDate = new Date(timestamp);

    const timeDifference = now - tsDate;

    if (timeDifference < 60000) {
      return "just now";
    } else if (timeDifference < 3600000) {
      const minutes = Math.floor(timeDifference / 60000);
      return `${minutes} min ago`;
    } else if (timeDifference < 86400000) {
      const hours = Math.floor(timeDifference / 3600000);
      return `${hours} hr ago`;
    } else {
      const days = Math.floor(timeDifference / 86400000);
      return `${days} days ago`;
    }
  };

  useEffect(() => {
    const getContactDataFromDB = () => {
      let credentials = localStorage.getItem("userCredentials");
      const parsedCredentials = JSON.parse(credentials);
      setParseCredentials(parsedCredentials);

      getDataFromDb("group", (data) => {
        const filteredGroups = Object.keys(data).filter((groupId) => {
          return parsedCredentials?.user?.uid === groupId;
        });

        if (filteredGroups.length > 0) {
          const groupId = filteredGroups[0];
          getDataFromDb(
            "group/" + groupId,
            (groupData) => {
              setGroupData(groupData);
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
    };
    getContactDataFromDB();
    const intervalId = setInterval(getContactDataFromDB, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="groupDataContainer">
      <div className="dataContainer">
        {groupData ? (
           Object.keys(groupData).map((groupId) => (
            <div
              key={groupId}
              className="card"
              onClick={() => {
                handleSharing(groupId, groupData[groupId].group_name);
              }}
            >
              <div>
                <Image
                  className="groupContactScreenImg"
                  src={groupData[groupId].avatar_url}
                  alt="Avatar"
                  width={53}
                  height={53} />
              </div>
              <div className="grpContactTitleDiv">
                <p className="grpContactTitle">
                    {groupData[groupId].group_name}
                </p>
                <p className="grpContactsDescription">
                  {groupData[groupId].description}
                </p>
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                  <p className="">
                    {formatTimestamp(groupData[groupId].time_stamp)}
                  </p>
              </div>
            </div>
          ))
          ) : (
          <Empty />
         
        )}
      </div>

    </div>
  );
}
