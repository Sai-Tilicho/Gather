import { ref, child, get, set, getDatabase } from "firebase/database";
import { database } from "@/firebase";
import { v4 as uuidv4 } from "uuid";

export const getContactData = async (uid) => {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `/userContactNumbers/${uid}`));
  if (snapshot.exists()) {
    const data = snapshot.val();
    const nestedContactId = Object.keys(data);

    const contactDataPromises = nestedContactId.map(async (contactID) => {
      const contactSnapshot = await get(
        child(dbRef, `/userContactNumbers/${uid}/${contactID}`)
      );
      return contactSnapshot.exists()
        ? { id: contactID, ...contactSnapshot.val() }
        : null;
    });

    const contactDataArray = await Promise.all(contactDataPromises);
    return contactDataArray.filter((contactData) => contactData !== null);
  } else {
    return [];
  }
};

export const updateContactStatus = async (uid, contactID, status) => {
  try {
    const dbRef = ref(database);
    await set(
      child(dbRef, `/userContactNumbers/${uid}/${contactID}/status`),
      status ? "true" : "false"
    );
  } catch (error) {
    console.error(error);
  }
};

export const handleInteraction = async (
  uid,
  contactID,
  checkedContacts,
  setCheckedContacts
) => {
  const updatedCheckedContacts = {
    ...checkedContacts,
    [contactID]: !checkedContacts[contactID],
  };

  const selectedContactCount = Object.values(updatedCheckedContacts).filter(
    Boolean
  ).length;

  if (selectedContactCount <= 50) {
    setCheckedContacts(updatedCheckedContacts);

    await updateContactStatus(
      uid,
      contactID,
      updatedCheckedContacts[contactID]
    );
  } else {
    console.log("Contact limit reached");
  }
};

export const saveDataToDatabase = async (
  firstName,
  lastName,
  email,
  userId
) => {
  const db = getDatabase();
  const newUserRefPath = `users/${userId}`;

  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  await set(ref(db, newUserRefPath), userData, (error) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("User data saved successfully!");
    }
  });
};

export const saveSparkDataToDatabase = async (
  groupId,
  content,
  groupName,
  imageUrl,
  dashBoard = false
) => {
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
      time_stamp: String(new Date()),
    };

    try {
      await set(ref(db, newConversationRefPath), conversationData);
      console.log("Conversation data saved successfully!");
    } catch (error) {
      console.log("Error:", error);
    }
  }
};
