import React, { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get } from "firebase/database";
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
                if (groupData.exists()) {

                    // console.log("User data:", groupId);
                    // console.log("content",groupData.val())
                    // console.log("id", userUUIDs)
                }
                if (sparkdata.exists()) {
                    // console.log("spark")
                    // console.log("spark data:", sparkdata.val())
                }
                else {
                    console.log("No user data found.");
                }
            } catch (error) {
                console.log("Error:", error);
            }
        };
        getData();
    }, []);

    const saveDataToDatabase = async (id, content, groupName) => {
        const db = getDatabase();
        const conversationsRef = ref(db, "conversations");
    
        const newConversationId = uuidv4();
        const newConversationRefPath = `conversations/${newConversationId}`;
        
        const conversationData = {
            groupId: id,
            groupName: groupName, 
            spark: content,
        };
    
        await set(ref(db, newConversationRefPath), conversationData, (error) => {
            if (error) {
                console.log("Error:", error);
            } else {
                console.log("Conversation data saved successfully!");
            }
        });
    }; 
   
    const handleSharing = async (id, groupName) => {
        const content = sparkData.content;
        if (content) {
            console.log("id", id);
            console.log("content", content);
            console.log("group", groupName);
            await saveDataToDatabase(id, content, groupName);
        } else {
            console.log("Content is undefined. Cannot save conversation data.");
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


