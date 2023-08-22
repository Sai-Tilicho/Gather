import React, { useEffect, useState } from "react";
import { getDataFromDb } from "@/firebase";
import { Empty, Tooltip } from "antd";
import { useRouter } from "next/router";

export default function GroupContacts({ handleSharing = () => {} }) {
  const [groupData, setGroupData] = useState(null);
  const [parseCredentials, setParseCredentials] = useState(null);
  const router = useRouter();


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
//     var timestamp = "Tue Aug 22 2023 15:01:23 GMT+0530 (India Standard Time)";
//     const formattedTimestamp = formatTimestamp(new Date(timestamp));
// console.log("formattedTimestamp", formattedTimestamp);
    useEffect(() => {
      getContactDataFromDB();
      const intervalId = setInterval(getContactDataFromDB, 60000);
      return () => clearInterval(intervalId);
    }, []);

 
    const getContactDataFromDB = () => {
      let credentials = localStorage.getItem("userCredentials");
      const parsedCredentials = JSON.parse(credentials);
      setParseCredentials(parsedCredentials);

      getDataFromDb("group", (data) => {
        const filteredGroups = Object.keys(data).filter((groupId) => {
          return parsedCredentials.user.uid === groupId;
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
  return (
    <div className="groupDataContainer">
      <div className="dataContainer">
        {groupData === null ? (
          <Empty />
        ) : Object.keys(groupData).length === 0 ? (
          <p>No groups available</p>
        ) : (
          Object.keys(groupData).map((groupId) => (
            <div
              key={groupId}
              className="card"
              onClick={() => {
                handleSharing(groupId, groupData[groupId].group_name);
              }}
            >
              <div>
                <img
                  className="groupContactScreenImg"
                  src={groupData[groupId].avatar_url}
                  alt="Avatar"
                />
              </div>
              <div className="grpContactTitleDiv">
                <p className="grpContactTitle">
                  <Tooltip title={groupData[groupId].group_name}>
                    {groupData[groupId].group_name}
                  </Tooltip>
                </p>
                <p className="grpContactsDescription">
                  {groupData[groupId].description}
                </p>
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                <Tooltip>
                  <p className="">{formatTimestamp(groupData[groupId].time_stamp)}</p>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
