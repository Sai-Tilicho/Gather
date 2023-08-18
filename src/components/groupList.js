// import React, { useState, useEffect, useContext } from "react";
// import { getDatabase, ref, set, get, update } from "firebase/database";
// import { v4 as uuidv4 } from "uuid";
// import { SparkContext } from "./sparkContentContext";
// import { storage } from "@/firebase";
// import { FaArrowLeft } from "react-icons/fa";
// import {
//   getDownloadURL,
//   ref as reference,
//   uploadBytes,
// } from "firebase/storage";
// import GroupContacts from "./groupContacts";
// import { useRouter } from "next/router";
// import { Button, Form } from "antd";

// const GroupList = () => {
//   const [groupId, setGroupId] = useState([]);
//   const { combinedContent, fileList, groupData, setGroupData } =
//     useContext(SparkContext);
//   const router = useRouter();
//   useEffect(() => {
//     const getData = async () => {
//       const db = getDatabase();
//       try {
//         const groupData = await get(ref(db, "group"));
//         const groupId = groupData.val();
//         const userUUIDs = Object.keys(groupId);
//         setGroupId(groupId);
//       } catch (error) {
//         console.log("Error:", error);
//       }
//     };
//     getData();
//   }, []);

//   const saveDataToDatabase = async (
//     groupId,
//     content,
//     groupName,
//     status,
//     imageUrl
//   ) => {
//     const db = getDatabase();

//     const newConversationId = uuidv4();
//     const newConversationRefPath = `conversations/${newConversationId}`;

//     const conversationData = {
//       groupId: groupId,
//       groupName: groupName,
//       spark: content,
//       status: status,
//       profileImageUrl: imageUrl,
//     };

//     try {
//       await set(ref(db, newConversationRefPath), conversationData);
//       console.log("Conversation data saved successfully!");
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };

//   const handleEmptydata = () => {
//     router.push("/dashboard");
//   };

//   const handleSharing = async (groupId, groupName) => {
//     const storedData = localStorage.getItem("FilledData");
//     let content = "";
//     if (storedData) {
//       content = storedData;
//     }

//     if (content) {
//       router.push("/displayConversation");
//       await updateStatusToTrue(groupId);

//       const imageFile = fileList[0]?.originFileObj;
//       if (imageFile) {
//         const storageRef = reference(
//           storage,
//           `conversations/groupId/${imageFile.name}`
//         );
//         try {
//           const snapshot = await uploadBytes(storageRef, imageFile);
//           const imageUrl = await getDownloadURL(snapshot.ref);
//           await saveDataToDatabase(groupId, content, groupName, true, imageUrl);
//           router.push("/displayConversation");
//         } catch (error) {
//           console.log("Error uploading image:", error);
//         }
//       } else {
//         await saveDataToDatabase(groupId, content, groupName, true, null);
//       }
//     } else {
//       console.log("Content is undefined. Cannot save conversation data.");
//     }
//   };

//   const updateStatusToTrue = async (selectedGroupId) => {
//     const db = getDatabase();
//     const conversationsRef = ref(db, "conversations");

//     const snapshot = await get(conversationsRef);
//     if (snapshot.exists()) {
//       const conversations = snapshot.val();
//       for (const conversationId in conversations) {
//         const conversation = conversations[conversationId];
//         if (conversation.groupId === selectedGroupId) {
//           await update(ref(db, `conversations/${conversationId}`), {
//             status: true,
//           });
//           console.log(
//             `Status updated to true for conversation with groupId: ${selectedGroupId}`
//           );
//         } else {
//           await update(ref(db, `conversations/${conversationId}`), {
//             status: false,
//           });
//         }
//       }
//     }
//   };

//   return (
//     <div className="groupList">
//       <div className="groupHeader">
//         <div>
//           <FaArrowLeft size={20} />
//         </div>
//         <div className="forward">Forward to...</div>
//       </div>
//       <div className="groupData">
//         <GroupContacts handleSharing={handleSharing} />
//       </div>
//       {groupData === null && (
//         <Form.Item>
//           <Button type="primary" onClick={handleEmptydata}>
//             Go to dashBoard
//           </Button>
//         </Form.Item>
//       )}
//     </div>
//   );
// };

// export default GroupList;

import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { SparkContext } from "./sparkContentContext";
import { storage } from "@/firebase";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import {
  getDownloadURL,
  ref as reference,
  uploadBytes,
} from "firebase/storage";
import GroupContacts from "./groupContacts";
import { useRouter } from "next/router";

const GroupList = () => {
  const [groupId, setGroupId] = useState([]);
  const { combinedContent, fileList, groupData, setGroupData } =
    useContext(SparkContext);
  const router = useRouter();
  console.log(groupData);
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
  const handleBack = () => {
    router.push("/fillSpark");
  };
  const handleEmptydata = () => {
    router.push("/displayContactsList");
  };
  const handleSharing = async (groupId, groupName) => {
    const storedData = localStorage.getItem("FilledData");
    let content = "";
    if (storedData) {
      content = storedData;
    }

    if (content) {
      console.log(groupId, "id");
      console.log(groupName, "name");
      console.log(content, "data");
      router.push("/displayConversation");
      await updateStatusToTrue(groupId);

      const imageFile = fileList[0]?.originFileObj;
      if (imageFile) {
        const storageRef = reference(
          storage,
          `conversations/groupId/${imageFile.name}`
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
    <div className="groupList">
      <div className="groupHeader">
        <div onClick={handleBack}>
          <MdOutlineArrowBackIosNew />
        </div>
        <div className="forward">Forward to...</div>
      </div>
      <div className="groupData">
        {" "}
        <GroupContacts handleSharing={handleSharing} />
      </div>
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
