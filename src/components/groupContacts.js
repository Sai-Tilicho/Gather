import React, { useEffect, useState } from "react";
import { getDataFromDb } from "@/firebase";
import { Empty, Tooltip } from "antd";
import { useRouter } from "next/router";

export default function GroupContacts({ handleSharing = () => {} }) {
  const [groupData, setGroupData] = useState(null);
  const [parseCredentials, setParseCredentials] = useState(null);
  const router = useRouter();

  useEffect(() => {
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

    getContactDataFromDB();
  }, []);

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
                router.push("/displayConversation");
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
                  <p className="">{groupData[groupId].time_stamp}</p>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
