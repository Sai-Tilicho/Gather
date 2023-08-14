import React, { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get,update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { app } from "@/firebase";

const group = [{ id: "1", name: "group1" },
{ id: "2", name: "group2" },
{ id: "3", name: "group3" },
{ id: "4", name: "group4" },
{ id: "5", name: "group5" }]

function GroupList() {

    const [sparkData, setSparkData] = useState([]);
    const [groupId, setGroupId] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const db = getDatabase();
            try {
                const groupData = await get(ref(db, "group"));
                const groupId = groupData.val();
                const userUUIDs = Object.keys(groupId);
                setGroupId(groupId)

                const sparkdata = await get(ref(db, "sparks/repo/SP-32"));
                setSparkData(sparkdata.val());
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
        const content = sparkData.content;
    
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


