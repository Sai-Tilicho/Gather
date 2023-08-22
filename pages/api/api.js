import { ref, child, get, set } from "firebase/database";
import { database } from "@/firebase";

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

    const selectedContactCount = Object.values(updatedCheckedContacts).filter(Boolean).length;

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