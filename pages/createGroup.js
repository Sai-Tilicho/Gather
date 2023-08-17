import { getDataFromDb, setDataToDb, storage } from "@/firebase";
import { uuidv4 } from "@firebase/util";
import { Alert, Button, Form, Input, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function CreateGroup() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [timeStamp, setTimeStamp] = useState(new Date());
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
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimestamp();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const getUsersDataFromDB = () => {
      getDataFromDb(
        "users",
        (userData) => {
          const userIdsWithTrueStatus = Object.keys(userData).filter(
            (userId) => {
              return userData[userId].status === "true";
            }
          );
          getDataFromDb(
            "userContactNumbers/" + `${userIdsWithTrueStatus}`,
            (contactData) => {
              try {
                console.log("object", contactData);
                const trueContactKeys = Object.keys(contactData).filter(
                  (key) => {
                    return contactData[key].status === "true";
                  }
                );
                if (trueContactKeys.length > 0) {
                  const selectedContactDetails = trueContactKeys.map((key) => {
                    const contact = contactData[key];

                    return {
                      id: key,
                      mobile_number: contact.mobile_number,
                      status: contact.status,
                      contact_name: contact.contact_name,
                    };
                  });

                  console.log(
                    "Selected Contact Details:",
                    selectedContactDetails
                  );
                  setContacts(selectedContactDetails);
                } else {
                  console.log("No contacts with status true found.");
                }
              } catch (error) {
                console.log("Error while processing contact data:", error);
              }
            },
            (contactError) => {
              console.log("Contact Data Error:", contactError);
            }
          );
        },
        (userError) => {
          console.log("User Data Error:", userError);
        }
      );
    };

    getUsersDataFromDB();
  }, []);
  const handleUpload = () => {
    if (groupName !== "" && description !== "") {
      if (imgChange?.[0]?.originFileObj) {
        const imageRef = ref(storage, `GroupImages/${Date.now()}`);
        uploadBytes(imageRef, imgChange[0]?.originFileObj).then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              updateTimestamp();
              updateContactDataToDB(url);
              success(); // Navigate to the next page
            })
            .catch((error) => {
              throw error;
            });
        });
      } else {
        updateTimestamp();
        updateContactDataToDB("/assets/profile.png");
        success(); // Navigate to the next page
      }
    } else {
      setError("Please enter a value");
    }
  };
  const updateTimestamp = () => {
    const now = new Date();

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };

    const formattedDate = now.toLocaleDateString(undefined, dateOptions);
    const formattedTime = now.toLocaleTimeString(undefined, timeOptions);

    setTimeStamp({
      date_locale: formattedDate,
      time_locale: formattedTime,
    });
  };

  const updateContactDataToDB = async (imageUrl) => {
    try {
      getDataFromDb("group", (data) => {
        //if data not present
        let credentials = localStorage.getItem("userCredentials");
        const parseCredentials = JSON.parse(credentials);
        if (!data) {
          setDataToDb("group/" + uuidv4(), {
            group_name: groupName,
            description: description,
            avatar_url: imageUrl,
            contacts: contacts,
            time_stamp: timeStamp,
          });
        } else {
          const existingGroups = Object.keys(data);

          const groupExists =
            existingGroups.filter((groupKey) => {
              const group = data[groupKey];
              return group.group_name === groupName;
            }).length === 1;
          if (groupExists) {
            setError("Group name already exists");
          } else {
            setDataToDb("group/" + uuidv4(), {
              group_name: groupName,
              description: description,
              avatar_url: imageUrl,
              contacts: contacts,
              time_stamp: timeStamp,
            });
          }
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
    console.log("src", imageSrc);
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
          className="groupInput"
          onChange={handleGroupName}
          maxLength={20}
          minLength={1}
        />
        {error && <Alert type="error" message={error} />}

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
