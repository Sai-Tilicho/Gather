/* eslint-disable @next/next/no-img-element */
import { database } from '../../firbase';
import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, child, get } from "firebase/database";
import _ from 'lodash';
import Link from 'next/link';
import { Empty, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Router from 'next/router';

const DisplayContactsList = () => {
    const [contactsData, setcontactsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCount, setSelectedCount] = useState(0);
    const [isAnyContactSelected, setIsAnyContactSelected] = useState(false);
    const [selectedLetterNumber, setSelectedLetterNumber] = useState(null);

    const contactContainerRef = useRef(null);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    useEffect(() => {
        const dbRef = ref(database);
        get(child(dbRef, `/userContactNumbers/Naidu`))
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const contactIDs = Object.keys(data);

                    const contactDataPromises = contactIDs.map(async (contactID) => {
                        const contactSnapshot = await get(child(dbRef, `/userContactNumbers/Naidu/${contactID}`));
                        return contactSnapshot.exists() ? { id: contactID, ...contactSnapshot.val() } : null;
                    });

                    Promise.all(contactDataPromises)
                        .then((contactDataArray) => {
                            const validContactData = contactDataArray.filter((contactData) => contactData !== null);
                            setcontactsData(validContactData);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        const selected = contactsData.filter(contactData => contactData.isSelected).length;
        setSelectedCount(selected);
        setIsAnyContactSelected(selected > 0);
    }, [contactsData]);

    const handleCheckboxChange = (event, contactID) => {
        const updatedcontactsData = contactsData.map(contactData =>
            contactData.id === contactID ? { ...contactData, isSelected: event.target.checked } : contactData
        );
        setcontactsData(updatedcontactsData);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const filteredContacts = searchQuery.length === 0 ? contactsData : contactsData.filter((contactData) => {
        const contactNameLowerCase = contactData.contact_name.toLowerCase();

        if (selectedLetterNumber !== null) {
            return contactNameLowerCase.startsWith(selectedLetterNumber.toLowerCase());
        }

        const searchQueryLowerCase = searchQuery.toLowerCase();
        return contactNameLowerCase.includes(searchQueryLowerCase);
    });

    const sortedContacts = _.orderBy(filteredContacts, ['contact_name'], ['asc']);

    const allLetters = alphabet + numbers;
    const scrollItems = allLetters.split('').map(char => (
        { char, scrollToIndex: sortedContacts.findIndex(contact => contact.contact_name[0].toUpperCase() === char) }
    ))

    const scrollToLetter = (scrollToItem) => {
        const container = document.querySelector('.contact_container');
        const elementToScroll = document.getElementById(scrollToItem.scrollToIndex);

        if (container && elementToScroll) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = elementToScroll.getBoundingClientRect();
            const scrollTop = elementRect.top - containerRect.top + container.scrollTop;

            container.scrollTo({
                top: scrollTop,
                behavior: 'smooth',
            });
        }
    };


    return (
        <div className='container'>

            <div className='header-container'>

                <div className='top_header'>
                    <Link className='Links Cancel'
                        onClick={() => Router.push('/dashboard')}
                        href={''}>Cancel</Link>

                    <div className='add_partici_container'>
                        <p className='Add_partici'>Add Participants</p>
                        <p className='count'> {selectedCount} / {contactsData.length}</p>
                    </div>

                    {isAnyContactSelected ?
                        (
                            <Link
                                className={`Links Next ${isAnyContactSelected ? 'blueLink' : ''}`}
                                href=''
                                onClick={() => Router.push('/createGroup')}
                            >Next</Link>
                        ) :
                        (<div className='next'>Next</div>
                        )}
                </div>

                <div className='search_input_container'>
                    <SearchOutlined className='search_icon' />
                    <input
                        className='search_input'
                        type="text"
                        placeholder="Search for a Friend"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

            </div>

            <div className='div_details'>

                <div className='letter_numbers_container'>
                    {scrollItems.map((scrollItem) => (
                        <div className={scrollItem?.scrollToIndex !== -1 ? 'letters' : 'letters-disabled'} key={scrollItem?.char} onClick={() => scrollToLetter(scrollItem)}>
                            {scrollItem?.char}
                        </div>
                    ))}
                </div>

                <div className='contact_container' ref={contactContainerRef}>

                    {sortedContacts?.length > 0 ? (
                        sortedContacts?.map((contactData, index) => (

                            <div className='container_for_radio' key={index} id={`${index}`}>

                                <div className='contact_container_div' key={index}>

                                    <div className='avatar_container'>
                                        <img className='avatar' src={contactData?.avatar_url} alt='' width={25} height={25} />
                                    </div>

                                    <div className='contact_details'>
                                        <Tooltip title={contactData?.contact_name} placement='topRight'>
                                            <p className='contact_name'>{capitalizeFirstLetter(contactData?.contact_name)}</p>
                                        </Tooltip>
                                        <p className='contact_number'>{contactData?.mobile_number}</p>
                                    </div>

                                </div>

                                <label class="custom-checkbox">
                                    <input type="checkbox" onChange={(event) => handleCheckboxChange(event, contactData.id)} />
                                    <span class="checkbox-style"></span>
                                </label>

                            </div>
                        ))) : (

                        <Empty />
                    )}
                </div>

            </div>

        </div>
    );
}

export default DisplayContactsList;