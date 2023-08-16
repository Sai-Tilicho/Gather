import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { SparkContext } from "./sparkContentContext";
import { storage } from "@/firebase"; 
import { getDownloadURL, ref as reference, uploadBytes } from "firebase/storage";

const GroupList = () => {
  const [groupId, setGroupId] = useState([]);
  const { combinedContent, fileList } = useContext(SparkContext);

  useEffect(() => {
    const getData = async () => {
      const db = getDatabase();
      try {
        const groupData = await get(ref(db, "group"));
        const groupId = groupData.val();
        const userUUIDs = Object.keys(groupId);
        setGroupId(groupId);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getData();
  }, []);

  const saveDataToDatabase = async (
    groupId,
    content,
    groupName,
    status,
    imageUrl
  ) => {
    const db = getDatabase();

    const newConversationId = uuidv4();
    const newConversationRefPath = `conversations/${newConversationId}`;

    const conversationData = {
      groupId: groupId,
      groupName: groupName,
      spark: content,
      status: status,
      profileImageUrl: imageUrl,
    };

    try {
      await set(ref(db, newConversationRefPath), conversationData);
      console.log("Conversation data saved successfully!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleSharing = async (groupId, groupName) => {
    const storedData = localStorage.getItem("FilledData");
    let content = "";
    if (storedData) {
      content = storedData;
    }

    if (content) {
      console.log("groupId", groupId);
      console.log("content", content);
      console.log("group", groupName);

      await updateStatusToTrue(groupId);

      const imageFile = fileList[0].originFileObj;
      if (imageFile) {
        const storageRef = reference(
          storage,
          `conversations/${uuidv4()}/${imageFile.name}`
        );
        try {
          const snapshot = await uploadBytes(storageRef, imageFile);
          const imageUrl = await getDownloadURL(snapshot.ref);
          await saveDataToDatabase(groupId, content, groupName, true, imageUrl);
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      } else {
        await saveDataToDatabase(groupId, content, groupName, true, null);
      }
    } else {
      console.log("Content is undefined. Cannot save conversation data.");
    }
  };

  const updateStatusToTrue = async (selectedGroupId) => {
    const db = getDatabase();
    const conversationsRef = ref(db, "conversations");

    const snapshot = await get(conversationsRef);
    if (snapshot.exists()) {
      const conversations = snapshot.val();
      for (const conversationId in conversations) {
        const conversation = conversations[conversationId];
        if (conversation.groupId === selectedGroupId) {
          await update(ref(db, `conversations/${conversationId}`), {
            status: true,
          });
          console.log(
            `Status updated to true for conversation with groupId: ${selectedGroupId}`
          );
        } else {
          await update(ref(db, `conversations/${conversationId}`), {
            status: false,
          });
        }
      }
    }
  };

  return (
    <div>
      {Object.entries(groupId).map(([uuid, groupData], index) => (
        <div
          key={index}
          onClick={() => handleSharing(uuid, groupData.group_name)}
        >
          {groupData.group_name}
        </div>
      ))}
    </div>
  );
};

export default GroupList;
