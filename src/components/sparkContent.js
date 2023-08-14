import React from "react";
import { BsCamera } from "react-icons/bs";

export default function SparkContent({ content }) {
  const parts = content.split(/(____|📷)/);
  return (
    <div>
      {parts.map((part, index) => (
        <span key={index}>
          {part === "____" ? (
            <input type="text" disabled className="inputBox" />
          ) : part === "📷" ? (
            <button className="addPhoto">
              <BsCamera size={18} color="rgb(66 69 83)" />
              add photo
            </button>
          ) : (
            part
          )}
        </span>
      ))}
    </div>
  );
}
