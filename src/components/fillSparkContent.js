import React, { useContext, useState } from "react";
import { BsCamera } from "react-icons/bs";
import { Upload, Button, message, Input } from "antd";
import { SparkContext } from "./sparkContentContext";

export default function FillSparkContent({ content }) {
  const parts = content.split(/(____|📷)/);

  const [fileList, setFileList] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const { combinedContent, setCombinedContent } = useContext(SparkContext);
  const [areAllRequiredFilled, setAreAllRequiredFilled] = useState(false);
  const requiredInputIndices = parts
    .map((part, index) => (part === "____" ? index : null))
    .filter((index) => index !== null);

  // console.log(combinedContent);

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
    setCombinedContent(combinedContentArray.join(""));

    const allFilled = requiredInputIndices.every(
      (idx) => newInputValues[idx] && newInputValues[idx].trim() !== ""
    );
    setAreAllRequiredFilled(allFilled);
  };

  const handleShareClick = () => {
    if (areAllRequiredFilled) {
      console.log("Shared successfully");
      window.location.href = "nextPage";
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
              onRemove={() => setFileList([])}>
              <Button
                icon={<BsCamera size={18} color="rgb(66 69 83)" />}
                className="addPhoto">
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
          onClick={handleShareClick}>
          SHARE
        </button>
      </div>
    </div>
  );
}
