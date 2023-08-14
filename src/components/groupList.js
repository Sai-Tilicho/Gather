import React, { useState, useEffect, useContext } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { app } from "@/firebase";
import { SparkContext } from './sparkContentContext';

const GroupList = () => {

    const [groupId, setGroupId] = useState([]);
    const { combinedContent } = useContext(SparkContext);

    useEffect(() => {
        const getData = async () => {
            const db = getDatabase();
            try {
                const groupData = await get(ref(db, "group"));
                const groupId = groupData.val();
                const userUUIDs = Object.keys(groupId);
                setGroupId(groupId)
            } catch (error) {
                console.log("Error:", error);
            }
        };
        getData();
    }, []);

    const saveDataToDatabase = async (groupId, content, groupName, status) => {
        const db = getDatabase();

        const newConversationId = uuidv4();
        const newConversationRefPath = `conversations/${newConversationId}`;

        const conversationData = {
            groupId: groupId,
            groupName: groupName,
            spark: content,
            status: status,
        };

        await set(ref(db, newConversationRefPath), conversationData, (error) => {
            if (error) {
                console.log("Error:", error);
            } else {
                console.log("Conversation data saved successfully!");
            }
        });
    };

    const handleSharing = async (groupId, groupName) => {
        const storedData = localStorage.getItem("FilledData");
        let content = ""
        if (storedData) {
            content = storedData;
        }
        
        if (content) {
            console.log("groupId", groupId);
            console.log("content", content);
            console.log("group", groupName);

            await updateStatusToTrue(groupId);

            await saveDataToDatabase(groupId, content, groupName, true);
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
                    await update(ref(db, `conversations/${conversationId}`), { status: true });
                    console.log(`Status updated to true for conversation with groupId: ${selectedGroupId}`);
                } else {
                    await update(ref(db, `conversations/${conversationId}`), { status: false });
                }
            }
        }
    };


    return (
        <div>
            <div>get data</div>
            {Object.entries(groupId).map(([uuid, groupData], index) => {
                return (
                    <div key={index} onClick={() => handleSharing(uuid, groupData.group_name)}>
                        {groupData.group_name}
                    </div>
                );
            })}
        </div>
    );
}

export default GroupList


