import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Alert, Button, Form, Input, message, Upload } from "antd";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import { uuidv4 } from "@firebase/util";
import ImgCrop from "antd-img-crop";
import { storage } from "@/firebase";
import {
  uploadBytes,
  ref as reference,
  getDownloadURL,
} from "firebase/storage";
import { setDataToDb } from "@/firebase";

export default function CreateContacts() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [imgChange, setImgChange] = useState([
    {
      uid: "uid",
      status: "done",
      url: "/assets/profile.png",
    },
  ]);
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    router.push("/displayContactsList");
    messageApi.open({
      type: "success",
      content: "Contact Saved successfully",
    });
  };

  const handleName = (event) => {
    var inputValue = event.target.value;
    if (inputValue) {
      setName(event.target.value);
      setError("");
    } else {
      setError("Please enter a value");
      setNumber("");
    }
  };

  const handleNumber = (event) => {
    const inputNumber = event.target.value;

    if (/^[0-9]*$/.test(inputNumber) && inputNumber.length === 10) {
      setError("");
      setNumber(inputNumber);
    } else {
      setError("Please enter a valid 10-digit number.");
      setNumber("");
    }
  };

  const handleNumberKeyDown = (e) => {
    // Allow only numeric digits and control keys
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const updateContactDataToDB = (imageURL) => {
    if (number !== "" && name !== "") {
      setDataToDb("userContactNumbers/" + `${userId}` + "/" + uuidv4(), {
        mobile_number: number,
        contact_name: name,
        avatar_url: imageURL ? imageURL : "/assets/profile.png",
        status: "false",
      });
      success();
    }
  };

  const handleUpload = () => {
    if (name === "" || number === "") {
      setError("Please fill in all the fields.");
      return;
    }

    if (imgChange?.[0]?.originFileObj) {
      const imageRef = reference(storage, `GroupImages/${Date.now()}`);
      uploadBytes(imageRef, imgChange[0]?.originFileObj).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            updateContactDataToDB(url);
            success();
            setError("");
          })
          .catch((error) => {
            throw error;
          });
      });
    } else {
      updateContactDataToDB("/assets/profile.png");
      success();
      setError("");
    }
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" alt="Preview" />`);
  };

  const onChange = ({ fileList }) => {
    setImgChange([...fileList]);
  };

  useEffect(() => {
    const getUsersDataFromDB = () => {
      let credentials = localStorage.getItem("userCredentials");
      const parseCredentials = JSON.parse(credentials);
      setUserId(parseCredentials.user.uid);
    };
    getUsersDataFromDB();
  }, []);

  return (
    <div className="createContactPage">
      <div className="contactsDiv">
        <IoIosArrowBack
          className="contactBackArrow"
          onClick={() => router.push("/dashboard")}
        />
        <p className="contactTitle">Create Contact</p>
      </div>
      <div className="contactImg_upload_container">
        <ImgCrop rotate>
          <Upload
            fileList={imgChange}
            onPreview={onPreview}
            onChange={onChange}
            maxCount={1}
            className="upload_div"
            listType="picture-circle"
          >
            Add Profile photo
          </Upload>
        </ImgCrop>
      </div>
      <Form className="contactsForm">
        <Input
          placeholder="Enter Full Name"
          className="contactInput"
          onChange={handleName}
          maxLength={30}
          minLength={1}
        />
        <Input
          placeholder="Contact Number"
          className="contactInput"
          onChange={handleNumber}
          onKeyDown={handleNumberKeyDown}
          maxLength={10}
        />
        {error && <Alert type="error" message={error} />}
        <Button className="ContactSaveBtn" onClick={handleUpload}>
          Save Contact
        </Button>
      </Form>
      <div className="createImgDiv">
        <Image
          src="/assets/groupOrUserDp.png"
          alt="gather"
          width={50}
          height={50}
        />
        <Image
          src="/assets/gatherText.png"
          alt="gather"
          width={120}
          height={50}
        />
      </div>
      {contextHolder}
    </div>
  );
}
