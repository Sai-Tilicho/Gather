import React, { useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase";
import { getDatabase, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import SignUpForm from "@/src/components/signUpForm";
import { useRouter } from "next/router";
import { message } from "antd";
import { SparkContext } from "@/src/components/context/sparkContentContext";

function SignUp() {
  const {
    registerEmail,
    registerPassword,
    registeredFirstName,
    registeredLasttName,
    setUser,
    setEmailError,
    setPasswordError,
  } = useContext(SparkContext);

  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    const auth1 = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return auth1;
  }, []);

  const saveDataToDatabase = async (firstName, lastName, email, userId) => {
    const db = getDatabase();
    const newUserRefPath = `users/${userId}`;

    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    await set(ref(db, newUserRefPath), userData, (error) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("User data saved successfully!");
      }
    });
  };

  const register = async () => {
    if (registerPassword === "") {
      setPasswordError("Password is required");
      return;
    }

    try {
      if (registeredFirstName && registeredLasttName) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          registerEmail,
          registerPassword,
          registeredFirstName,
          registeredLasttName
        );

        const userId = userCredential.user.uid;
        const storage = JSON.stringify(userCredential);
        localStorage.setItem("userCredentials", storage);

        messageApi.open({
          type: "success",
          content: "Account created successfully",
        });
        await saveDataToDatabase(
          registeredFirstName,
          registeredLasttName,
          registerEmail,
          userId
        );
        router.push("/dashboard");
      } else {
        console.log("First name and last name are required.");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        messageApi.open({
          type: "error",
          content: "This email address is already in use",
        });
      } else {
        setEmailError(error.message);
      }
    }
  };

  return (
    <div>
      <SignUpForm register={register} />
      <div>{contextHolder}</div>
    </div>
  );
}

export default SignUp;
