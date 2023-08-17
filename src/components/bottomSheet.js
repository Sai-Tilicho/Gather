import React from "react";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import { useRouter } from "next/router";

export default function BottomSheet() {
  const router = useRouter();

  const handleCreateContact = () => {
    router.push("/createContacts");
  };

  const handleCreateGroup = () => {
    router.push("/displayContactsList");
  };

  return (
    <div className="sheetMainDiv">
      <div className="sheetSubDiv1">
        <div className="sheetSubDiv2">
          <div className="createContact" onClick={handleCreateContact}>
            <button className="createContactBtn">
              Create Contacts <BsFillPersonPlusFill />
            </button>
          </div>
          <div className="createGroup" onClick={handleCreateGroup}>
            <button className="createGroupBtn">
              Create Group <HiUserGroup />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
