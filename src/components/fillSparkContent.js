import React, { useContext, useState } from "react";
import { BsCamera } from "react-icons/bs";
import { Upload, Button, message, Input } from "antd";
import { SparkContext } from "./context/sparkContentContext";
import { useRouter } from "next/router";
import { storage } from "@/firebase";
import { uploadBytes, ref as reference } from "firebase/storage";

export default function FillSparkContent({ content }) {
  const { setCombinedContent, fileList, setFileList } =
    useContext(SparkContext);
  const [inputValues, setInputValues] = useState([]);
  const [areAllRequiredFilled, setAreAllRequiredFilled] = useState(false);
  const router = useRouter();

  const handleUpload = () => {
    const imageRef = reference(storage, `sparkImages/${fileList?.[0]?.name}`);
    uploadBytes(imageRef, fileList?.[0]?.originFileObj).then(() => {
      console.log("image uploaded");
      return;
    });
  };

  const parts = content.split(/(____|📷)/);

  const requiredInputIndices = parts
    .map((part, index) => (part === "____" ? index : null))
    .filter((index) => index !== null);

  const onChange = ({ file, fileList: newFileList }) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";

    if (!isImage) {
      message.error("You can only upload JPEG or PNG image files!");
    } else if (newFileList.length > 1) {
      message.warning(
        "You can upload only one image. The latest image will replace the previous one."
      );
      setFileList([file]);
    } else {
      setFileList(newFileList);
    }
  };

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    const combinedContentArray = parts.map((part, idx) =>
      part === "____" ? newInputValues[idx] || "___" : part
    );

    const combinedContent = combinedContentArray.join("");
    setCombinedContent(combinedContent);

    const allFilled = requiredInputIndices.every(
      (idx) => newInputValues[idx] && newInputValues[idx].trim() !== ""
    );
    setAreAllRequiredFilled(allFilled);
  };

  const handleShareClick = () => {
    handleUpload();
    if (areAllRequiredFilled) {
      console.log("Shared successfully");
      router.push({ pathname: "group" });
    } else {
      message.error("Please fill all required input boxes before sharing.");
    }
  };

  return (
    <div>
      {parts.map((part, index) => (
        <span key={index}>
          {part === "____" ? (
            <Input
              className="inputBox"
              style={{
                width: inputValues[index]
                  ? `${Math.min(
                      Math.max(inputValues[index].length * 10, 81),
                      500 - 40
                    )}px`
                  : "81px",
              }}
              value={inputValues[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              required
            />
          ) : part === "📷" ? (
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={onChange}
              onRemove={() => setFileList([])}
            >
              <Button
                icon={<BsCamera size={18} color="rgb(66 69 83)" />}
                className="Photo"
              >
                add photo
              </Button>
            </Upload>
          ) : (
            part
          )}
        </span>
      ))}
      <div className="button">
        <button
          className={`shareButton ${areAllRequiredFilled ? "enable" : ""}`}
          onClick={handleShareClick}
        >
          SHARE
        </button>
      </div>
    </div>
  );
}
