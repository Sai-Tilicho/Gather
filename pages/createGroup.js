import { getDataFromDb, setDataToDb, storage } from "@/firebase";
import { uuidv4 } from "@firebase/util";
import { Alert, Button, Form, Input, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function CreateGroup() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState("");
  const [imgChange, setImgChange] = useState([
    {
      uid: "uid",
      status: "done",
      url: "/assets/profile.png",
    },
  ]);

  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    if (!error) {
      router.push("/dashboard");
      messageApi.open({
        type: "success",
        content: "Group created successfully",
      });
    }
  };

  const addContactsToGroup = () => {
    const credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    const userId = parseCredentials.user.uid;
    getDataFromDb(`userContactNumbers/${userId}`, (contactsids) => {
      Object.keys(contactsids).forEach((contactId) => {
        setDataToDb(
          `userContactNumbers/${userId}/${contactId}/status`,
          "false"
        );
      });
    });
  };

  const handleUpload = () => {
    if (groupName !== "" && description !== "") {
      if (imgChange?.[0]?.originFileObj) {
        const imageRef = ref(storage, `GroupImages/${Date.now()}`);
        uploadBytes(imageRef, imgChange[0]?.originFileObj).then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              addContactsToGroup();
              updateContactDataToDB(url);
              success();
            })
            .catch((error) => {
              throw error;
            });
        });
      } else {
        addContactsToGroup();
        updateContactDataToDB("/assets/profile.png");
        success();
      }
    } else {
      setError("Please enter a value");
    }
  };

  useEffect(() => {
    const getUsersDataFromDB = () => {
      const credentials = localStorage.getItem("userCredentials");
      const parseCredentials = JSON.parse(credentials);

      getDataFromDb(
        "userContactNumbers",
        (userData) => {
          const userIdsWithTrueStatus = Object.keys(userData).filter(
            (userId) => {
              return parseCredentials.user.uid === userId;
            }
          );

          if (userIdsWithTrueStatus.length > 0) {
            const selectedContactDetails = [];

            userIdsWithTrueStatus.forEach((userId) => {
              const user = userData[userId];
              Object.keys(user).forEach((groupId) => {
                const selectedContacts = user[groupId];

                if (selectedContacts.status === "true") {
                  selectedContactDetails.push({
                    mobile_number: selectedContacts.mobile_number,
                    status: selectedContacts.status,
                    contact_name: selectedContacts.contact_name,
                    userId: userId,
                  });
                }
              });
            });
            setContacts(selectedContactDetails);
          } else {
            console.log("No contacts with status true found.");
          }
        },
        (userError) => {
          console.log("User Data Error:", userError);
        }
      );
    };

    getUsersDataFromDB();
  }, []);

  const updateContactDataToDB = async (imageUrl) => {
    try {
      const credentials = localStorage.getItem("userCredentials");
      const parseCredentials = JSON.parse(credentials);
      const userId = parseCredentials.user.uid;

      getDataFromDb(`group/${userId}`, (groupData) => {
        if (!groupData) {
          setDataToDb(`group/${userId}/${uuidv4()}`, {
            group_name: groupName,
            description: description,
            avatar_url: imageUrl,
            contact_details: contacts,
            time_stamp: String(new Date()),
          });
        } else {
          setDataToDb(`group/${userId}/${uuidv4()}`, {
            group_name: groupName,
            description: description,
            avatar_url: imageUrl,
            contact_details: contacts,
            time_stamp: String(new Date()),
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = ({ fileList: newFileList }) => {
    setImgChange(newFileList);
  };

  const handleGroupName = (event) => {
    var inputGroupName = event.target.value;
    if (inputGroupName) {
      setGroupName(inputGroupName);
      setError("");
    } else {
      setError("Please enter a value");
    }
  };

  const handleDescription = (event) => {
    var inputDescription = event.target.value;
    if (inputDescription) {
      setDescription(inputDescription);
      setError("");
    } else {
      setError("Please enter a value");
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onPreview = async (file) => {
    let src = "/assets/profile.png";
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;

    const imgWindow = window.open(src);
    setImageSrc(imgWindow);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="createGroupPage">
      <div className="createGroupDiv">
        <IoIosArrowBack
          className="groupBackArrow"
          onClick={() => router.push("/dashboard")}
        />
        <p className="createGroupTitle">Create Group</p>
      </div>
      <div>
        <div className="upload_container">
          <ImgCrop rotationSlider>
            <Upload
              fileList={imgChange}
              onPreview={onPreview}
              onChange={onChange}
              maxCount={1}
              className="upload_div"
              listType="picture-circle"
            >
              Add Group photo
            </Upload>
          </ImgCrop>
        </div>
      </div>

      <Form className="grpForm">
        <Input
          placeholder="Enter Group Name"
          ref={inputRef}
          className="groupInput"
          onChange={handleGroupName}
          maxLength={20}
          minLength={1}
        />

        <Input
          placeholder="Enter Description"
          className="groupInput"
          onChange={handleDescription}
          maxLength={20}
          minLength={1}
        />
        {error && <Alert type="error" message={error} />}
        <Button className="createGrpButton" onClick={handleUpload}>
          Create Group
        </Button>
      </Form>
      {!error && contextHolder}

      {!error && (
        <div className="grpImgDiv">
          <Image
            src={"/assets/groupOrUserDp.png"}
            alt="gather"
            width={40}
            height={40}
          />
          <Image
            src={"/assets/gatherText.png"}
            alt="gather"
            width={97}
            height={40}
          />
        </div>
      )}
    </div>
  );
}
