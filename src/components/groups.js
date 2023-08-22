import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { SparkContext } from "./sparkContentContext";
import { storage } from "@/firebase";
import {
  getDownloadURL,
  ref as reference,
  uploadBytes,
} from "firebase/storage";
import GroupContacts from "./groupContacts";
import { useRouter } from "next/router";

const Groups = ({ dashBoard = false }) => {
  const [groupId, setGroupId] = useState([]);
  const { fileList, groupData, combinedContent } = useContext(SparkContext);
  const router = useRouter();
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

  const saveDataToDatabase = async (groupId, content, groupName, imageUrl) => {
    const db = getDatabase();
    localStorage.setItem("groupId", groupId);

    if (!dashBoard) {
      const newConversationId = uuidv4();
      localStorage.setItem("newConversationId", newConversationId);
      const newConversationRefPath = `conversations/${groupId}/${newConversationId}`;

      const conversationData = {
        groupName: groupName,
        spark: content,
        profileImageUrl: imageUrl,
      };

      try {
        await set(ref(db, newConversationRefPath), conversationData);
        console.log("Conversation data saved successfully!");
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  const handleSharing = async (groupId, groupName) => {
    localStorage.setItem("groupId", groupId);

    const storedData = combinedContent;
    let content = "";
    if (storedData) {
      content = storedData;
    }

    if (content) {
      router.push("/displayConversation");
      const imageFile = fileList[0]?.originFileObj;
      if (imageFile) {
        const storageRef = reference(
          storage,
          `conversations/groupId/${imageFile.name}`
        );
        try {
          const snapshot = await uploadBytes(storageRef, imageFile);
          const imageUrl = await getDownloadURL(snapshot.ref);
          await saveDataToDatabase(groupId, content, groupName, imageUrl);
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      } else {
        router.push("/displayConversation");
        await saveDataToDatabase(groupId, content, groupName, null);
      }
    } else {
      router.push("/displayConversation");
      localStorage.setItem("groupId", groupId);
      console.log("Content is undefined. Cannot save conversation data.");
    }
  };

  return (
    <div className="groupData">
      <GroupContacts handleSharing={handleSharing} />
    </div>
  );
};

export default Groups;
