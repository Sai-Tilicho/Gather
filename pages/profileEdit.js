import React, { useState, useRef, useEffect, useContext } from "react";
import { Form, Input, Tooltip, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useRouter } from "next/router";
import { getDatabase, ref, get, update, onValue } from "firebase/database";
import { storage } from "@/firebase";
import { database } from "@/firebase";
import {
  uploadBytes,
  ref as reference,
  getDownloadURL,
} from "firebase/storage";
import { BiLogOut } from "react-icons/bi";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { SparkContext } from "@/src/components/context/sparkContentContext";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

const ProfileEdit = () => {
  const [firstName, setFirstName] = useState("");
  const { setLoginPassword } = useContext(SparkContext);
  const [lastName, setLastName] = useState("");
  const [imgChange, setImgChange] = useState([
    {
      name: "image.png",
      status: "done",
      url: "/assets/profile.png",
    },
  ]);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    if (credentials) {
      const starCountRef = ref(database, "users");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        const ids = Object.keys(data);
        if (snapshot.exists()) {
          for (const userId of ids) {
            if (parseCredentials.user.uid == userId) {
              const userData = data[userId];
              setFirstName(userData.firstName);
              setLastName(userData.lastName);
              if (userData?.profileImageUrl)
                setImgChange((prv) => {
                  prv[0] = {
                    ...prv[0],
                    url: userData?.profileImageUrl,
                  };
                  return [...prv];
                });
            }
          }
        }
      });
    }
  }, []);

  const onChange = ({ fileList }) => {
    setImgChange((prv) => [...fileList]);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleRouteDashboard = async () => {
    await updateFirstAndLastName(firstName, lastName);
    router.push("/dashboard");
  };

  const isFormComplete = firstName && lastName;

  const updateFirstAndLastName = async (firstName, lastName) => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    let credentials = localStorage.getItem("userCredentials");
    const parseCredentials = JSON.parse(credentials);
    if (credentials) {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const ids = Object.keys(users);
        for (const userId of ids) {
          if (parseCredentials.user.uid == userId) {
            const imageFile = imgChange[0].originFileObj;
            if (imageFile) {
              const storageRef = reference(
                storage,
                `images/${userId}/${imageFile.name}`
              );
              const uploadTask = uploadBytes(storageRef, imageFile);
              await uploadTask;

              const imageUrl = await getDownloadURL(storageRef);

              await update(ref(db, `users/${userId}`), {
                firstName: firstName,
                lastName: lastName,
                profileImageUrl: imageUrl,
              });
            } else {
              await update(ref(db, `users/${userId}`), {
                firstName: firstName,
                lastName: lastName,
              });
            }
            break;
          }
        }
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("userData");
    setLoginPassword("");
    router.push("/");
  };

  return (
    <div className="profileMainPage">
      <div className="profileHeader">
        <div className="backArrow" onClick={() => router.push("/dashboard")}>
          <MdOutlineArrowBackIosNew color="white" />
        </div>
        <div className="logoutIcon" onClick={logout}>
          <Tooltip
            placement="bottomRight"
            color="rgb(6, 51, 164)"
            title={"logout"}
            className="logoutTooltip">
            <BiLogOut />
          </Tooltip>
        </div>
      </div>
      <div className="completeProfile">Complete Your profile</div>
      <div className="inputFields">
        <div className="inputFirstName">
          <Input
            placeholder="First Name"
            ref={inputRef}
            maxLength={20}
            bordered={false}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="inputLastName" style={{ color: "white" }}>
          <Input
            placeholder="Last Name"
            maxLength={20}
            bordered={false}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="uploadImg">
        <Form.Item>
          <ImgCrop rotationSlider>
            <Upload
              fileList={imgChange}
              onChange={onChange}
              maxCount={1}
              className="upload_div"
              listType="picture-circle"
              showRemoveIcon={false}>
              <div className="addPhoto"> Add a photo</div>
            </Upload>
          </ImgCrop>
        </Form.Item>
      </div>
      <div className="faceBook">Pull from Facebook</div>
      <div>
        <Form.Item>
          <button
            type="button"
            className={firstName && lastName ? "start" : "default"}
            disabled={!isFormComplete}
            onClick={handleRouteDashboard}>
            Save
          </button>
        </Form.Item>
      </div>
    </div>
  );
};

export default ProfileEdit;
