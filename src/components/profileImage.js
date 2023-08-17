import React from "react";
import { SparkContext } from "./sparkContentContext";

export default function ProfileImage() {

  const { firstName, lastName, imageURL } = useContext(SparkContext);

  return (
    <div>
      {imageURL ? (
        <img
          className="imageProfile"
          src={imageURL}
          width={42.66}
          height={42.66}
        />
      ) : (
        <p className="paraProfile">
          {firstLetter[0]}
          {lastLetter[0]}
        </p>
      )}
    </div>
  );
}
