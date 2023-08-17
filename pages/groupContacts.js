/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { getDataFromDb } from '@/firbase';
import { Empty, Tooltip } from 'antd';

export default function GroupContacts() {
    const [groupData, setGroupData] = useState(null);

    useEffect(() => {
        const getContactDataFromDB = () => {
            getDataFromDb('group', (data) => {
                setGroupData(data);
                Object.keys(groupData).map(groupId => {
                    console.log(groupData[groupId].group_avatar);
                })
                
            }, (error) => {
                console.log(error);
            });
        }
        getContactDataFromDB();
    }, []);

    return (
        <div className='groupDataContainer'>
            <div className="dataContainer">
                {groupData === null ? (
                    <Empty></Empty>
                ) : Object.keys(groupData).length === 0 ? (
                    <p>No data available</p>
                ) : (
                    Object.keys(groupData).map(groupId => (
                        <div key={groupId} className='card'>
                            <div>
                                <img
                                    className='groupContactScreenImg'
                                   
                                    src={groupData[groupId].group_avatar}
                                    alt='Avatar'
                                />
                            </div>
                            <div className='grpContactTitleDiv'>
                                <p className='grpContactTitle'>
                                    <Tooltip title={groupData[groupId].group_name}>{groupData[groupId].group_name}</Tooltip></p>
                                <p className='grpContactsDescription'>{groupData[groupId].description}</p>
                            </div>
                            <div style={{ display: "grid", gap: "10px" }}>
                                <Tooltip>
                                    <p className='grpDate_Time'>Date:{groupData[groupId].time_stamp.date_locale}</p>
                                    <p className=''>Time:{groupData[groupId].time_stamp.time_locale}</p>
                                </Tooltip>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}