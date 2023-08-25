import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Link from "next/link";
import { Empty, Input, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Image from "next/image";
import { getContactData, handleInteraction } from "./api/api";

const getUserCredentials = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const credentials = localStorage.getItem("userCredentials");
  return JSON.parse(credentials);
};

const DisplayContactsList = () => {
  const router = useRouter();
  const [contactsData, setContactsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnyContactSelected, setIsAnyContactSelected] = useState(false);
  const [checkedContacts, setCheckedContacts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const contactContainerRef = useRef(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const parseCredentials = getUserCredentials();

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const contactDataArray = await getContactData(
          parseCredentials?.user?.uid
        );
        setIsLoading(false);
        setContactsData(contactDataArray);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContactData();
  });

  useEffect(() => {
    const anySelected = Object.values(checkedContacts).some((value) => value);
    setIsAnyContactSelected(anySelected);
  }, [checkedContacts]);

  const handleCheckboxChange = async (contactID) => {
    await handleInteraction(
      parseCredentials?.user?.uid,
      contactID,
      checkedContacts,
      setCheckedContacts
    );
  };

  const text = (
    <div className="text">
      <p>Add Contact</p>
    </div>
  );
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const filteredContacts =
    searchQuery?.length === 0
      ? contactsData
      : contactsData?.filter((contactData) => {
          const contactNameLowerCase = contactData?.contact_name.toLowerCase();
          const contactNumber = contactData?.mobile_number;

          const searchQueryLowerCase = searchQuery.toLowerCase();
          return (
            contactNameLowerCase?.includes(searchQueryLowerCase) ||
            contactNumber?.includes(searchQueryLowerCase)
          );
        });

  const sortedContacts = _.orderBy(filteredContacts, ["contact_name"], ["asc"]);

  const allLetters = alphabet + numbers;
  const scrollItems = allLetters?.split("").map((char) => ({
    char,
    scrollToIndex: sortedContacts?.findIndex(
      (contact) => contact?.contact_name[0]?.toUpperCase() === char
    ),
  }));

  const scrollToLetter = (scrollToItem) => {
    const container = document.querySelector(".contact_container");
    const elementToScroll = document.getElementById(
      scrollToItem?.scrollToIndex
    );

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
              <div
                className="Links Cancel"
                onClick={() => router.push("/dashboard")}>
                Cancel
              </div>

              <div className="add_partici_container">
                <p className="Add_partici">Add Participants</p>
                <p className="count">
                  {
                    Object.keys(checkedContacts).filter(
                      (id) => checkedContacts[id]
                    )?.length
                  }
                  /{contactsData?.length}
                </p>
              </div>

              {isAnyContactSelected ? (
                <div
                  className={`Links Next ${
                    isAnyContactSelected ? "blueLink" : ""
                  }`}
                  onClick={() => router.push("/createGroup")}>
                  Next
                </div>
              ) : (
                <div
                  onClick={() => router.push("/createContacts")}
                  className="next">
                  <Tooltip placement="bottomRight" title={text} color={"white"}>
                    <PlusOutlined className="plus_icon_contact" />
                  </Tooltip>
                </div>
              )}
            </div>

            <div className="search_input_container">
              <SearchOutlined className="search_icon" />
              <input
                className="search_input"
                type="search"
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
                      onClick={() => handleCheckboxChange(contactData.id, true)}
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
                          <p className="contact_name">
                            {capitalizeFirstLetter(contactData?.contact_name)}
                          </p>
                          <p className="contact_number">
                            {contactData?.mobile_number}
                          </p>
                        </div>
                      </div>

                      <label
                        className="custom-checkbox"
                        htmlFor={`checkbox-${contactData.id}`}>
                        <Input
                          type="checkbox"
                          checked={checkedContacts[contactData?.id] || false}
                          onChange={() => handleCheckboxChange(contactData?.id)}
                        />
                        <span className="checkbox-style"></span>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="no_data">
                    <p className="contacts_not_available">
                      <Empty />
                    </p>
                  </div>
                )}
              </div>

              <div className="letter_numbers_container">
                {contactsData?.length > 0 &&
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

export default DisplayContactsList;
