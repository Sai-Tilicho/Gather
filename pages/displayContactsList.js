import { database } from "../firebase";
import React, { useState, useEffect, useRef } from "react";
import { ref, child, get, set } from "firebase/database";
import _ from "lodash";
import Link from "next/link";
import { Input, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Router, { useRouter } from "next/router";
import Image from "next/image";

const getUserCredentials = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const credentials = localStorage.getItem("userCredentials");
  return JSON.parse(credentials);
};

const DisplayContactsListComp = () => {
  const router = useRouter();
  const [contactsData, setContactsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnyContactSelected, setIsAnyContactSelected] = useState(false);
  const [selectedLetterNumber, setSelectedLetterNumber] = useState(null);
  const [checkedContacts, setCheckedContacts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const contactContainerRef = useRef(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const parseCredentials = getUserCredentials();

  useEffect(() => {
    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    const dbRef = ref(database);

    get(child(dbRef, `/userContactNumbers/${parseCredentials.user.uid}`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          const nestedContactId = Object.keys(data);

          const contactDataPromises = nestedContactId.map(async (contactID) => {
            const contactSnapshot = await get(
              child(
                dbRef,
                `/userContactNumbers/${parseCredentials.user.uid}/${contactID}`
              )
            );
            return contactSnapshot.exists()
              ? { id: contactID, ...contactSnapshot.val() }
              : null;
          });

          Promise.all(contactDataPromises)
            .then((contactDataArray) => {
              let validContactData = contactDataArray.filter(
                (contactData) => contactData !== null
              );
              setIsLoading(false);
              setContactsData(validContactData);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const anySelected = Object.values(checkedContacts).some((value) => value);
    setIsAnyContactSelected(anySelected);
  }, [checkedContacts]);

  const handleCheckboxChange = async (event, contactID) => {
    const updatedCheckedContacts = {
      ...checkedContacts,
      [contactID]: event.target.checked,
    };
    setCheckedContacts(updatedCheckedContacts);

    try {
      const dbRef = ref(database);
      await set(
        child(
          dbRef,
          `/userContactNumbers/${parseCredentials.user.uid}/${contactID}/status`
        ),
        event.target.checked ? "true" : "false"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const filteredContacts =
    searchQuery.length === 0
      ? contactsData
      : contactsData.filter((contactData) => {
          const contactNameLowerCase = contactData.contact_name.toLowerCase();

          if (selectedLetterNumber !== null) {
            return contactNameLowerCase.startsWith(
              selectedLetterNumber.toLowerCase()
            );
          }
          const searchQueryLowerCase = searchQuery.toLowerCase();
          return contactNameLowerCase.includes(searchQueryLowerCase);
        });

  const sortedContacts = _.orderBy(filteredContacts, ["contact_name"], ["asc"]);

  const allLetters = alphabet + numbers;
  const scrollItems = allLetters.split("").map((char) => ({
    char,
    scrollToIndex: sortedContacts.findIndex(
      (contact) => contact.contact_name[0].toUpperCase() === char
    ),
  }));

  const scrollToLetter = (scrollToItem) => {
    const container = document.querySelector(".contact_container");
    const elementToScroll = document.getElementById(scrollToItem.scrollToIndex);

    if (container && elementToScroll) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = elementToScroll.getBoundingClientRect();
      const scrollTop =
        elementRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container">
      {
        <div>
          <div className="header-container">
            <div className="top_header">
              <Link
                className="Links Cancel"
                onClick={() => router.push("/createContacts")}
                href="">
                Cancel
              </Link>

              <div className="add_partici_container">
                <p className="Add_partici">Add Participants</p>
                <p className="count">
                  {
                    Object.keys(checkedContacts).filter(
                      (id) => checkedContacts[id]
                    ).length
                  }
                  /{contactsData.length}
                </p>
              </div>

              {isAnyContactSelected ? (
                <Link
                  className={`Links Next ${
                    isAnyContactSelected ? "blueLink" : ""
                  }`}
                  href=""
                  onClick={() => Router.push("/createGroup")}>
                  Next
                </Link>
              ) : (
                <div className="next">Next</div>
              )}
            </div>

            <div className="search_input_container">
              <SearchOutlined className="search_icon" />
              <input
                className="search_input"
                type="text"
                placeholder="Search for a Friend"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="loader">
              <LoadingOutlined spin />
            </div>
          ) : (
            <div className="div_details">
              <div className="contact_container" ref={contactContainerRef}>
                {sortedContacts?.length > 0 ? (
                  sortedContacts?.map((contactData, index) => (
                    <div
                      className="container_for_radio"
                      key={index}
                      id={`${index}`}>
                      <div className="contact_container_div" key={index}>
                        <div className="avatar_container">
                          <Image
                            className="avatar"
                            src={
                              contactData
                                ? contactData?.avatar_url
                                : "/assets/profile.png"
                            }
                            alt=""
                            width={25}
                            height={25}
                          />
                        </div>

                        <div className="contact_details">
                          <Tooltip
                            title={contactData?.contact_name}
                            placement="topRight">
                            <p className="contact_name">
                              {capitalizeFirstLetter(contactData?.contact_name)}
                            </p>
                          </Tooltip>
                          <p className="contact_number">
                            {contactData?.mobile_number}
                          </p>
                        </div>
                      </div>

                      <label className="custom-checkbox">
                        <Input
                          type="checkbox"
                          checked={checkedContacts[contactData.id] || false} // Check the correct contact's checked status
                          onChange={(event) =>
                            handleCheckboxChange(event, contactData.id)
                          }
                        />
                        <span className="checkbox-style"></span>
                      </label>
                    </div>
                  ))
                ) : (
                  <div
                    className="no_data"
                    onClick={() => Router.push("/createContacts")}>
                    <p className="contacts_not_available">
                      No contacts available here...
                    </p>
                    <PlusOutlined className="plus_icon" />
                  </div>
                )}
              </div>

              <div className="letter_numbers_container">
                {contactsData.length > 0 &&
                  scrollItems?.map((scrollItem) => (
                    <div
                      className={
                        scrollItem?.scrollToIndex !== -1
                          ? "letters"
                          : "letters-disabled"
                      }
                      key={scrollItem?.char}
                      onClick={() => scrollToLetter(scrollItem)}>
                      {scrollItem?.char}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default DisplayContactsListComp;
