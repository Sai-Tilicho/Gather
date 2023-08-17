import React, { useEffect, useState } from "react";
import { getDataFromDb } from "@/firebase";
import { Empty, Tooltip } from "antd";

export default function GroupContacts({ handleSharing = () => {} }) {
  const [groupData, setGroupData] = useState(null);

  useEffect(() => {
    const getContactDataFromDB = () => {
      getDataFromDb(
        "group",
        (data) => {
          setGroupData(data);
        },
        (error) => {
          console.log(error);
        }
      );
    };
    getContactDataFromDB();
  }, []);

  return (
    <div className="groupDataContainer">
      <div className="dataContainer">
        {groupData === null ? (
          <Empty></Empty>
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
                  <p className="">
                    {groupData[groupId].time_stamp.time_locale}
                  </p>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
