import { SparkContext } from "./context/sparkContentContext";
import { storage } from "@/firebase";
import {
  getDownloadURL,
  ref as reference,
  uploadBytes,
} from "firebase/storage";
import GroupContacts from "./groupContacts";
import { useRouter } from "next/router";
import { saveSparkDataToDatabase } from "@/pages/api/api";
import { useContext } from "react";

const Groups = ({ dashBoard = false }) => {
  const { fileList, combinedContent } = useContext(SparkContext);
  const router = useRouter();
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
          await saveSparkDataToDatabase(
            groupId,
            content,
            groupName,
            imageUrl,
            dashBoard
          );
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      } else {
        router.push("/displayConversation");
        await saveSparkDataToDatabase(
          groupId,
          content,
          groupName,
          null,
          dashBoard
        );
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
