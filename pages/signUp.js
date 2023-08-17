import React, { useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase";
import { getDatabase, ref, set, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { GatherContext } from "./gatherContext";
import SignUpForm from "@/src/components/signUpForm";
import { useRouter } from "next/router";
import { Button, message, Space } from 'antd';

function SignUp() {
    const { registerEmail, registerPassword, registeredFirstName,
        registeredLasttName, setUser, setEmailError, 
         setPasswordError,  userData,setUserData, }
        = useContext(GatherContext)
        

    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    useEffect(() => {
        const auth1 = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return auth1;
    }, []);

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
                    registerPassword, registeredFirstName, registeredLasttName
                );

                const userId = userCredential.user.uid;
                setUserData(userCredential);

                messageApi.open({
                    type: 'success',
                    content: 'Account created successfully',
                });

                router.push("/dashboard");
            } else {
                console.log("First name and last name are required.");
            }
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                messageApi.open({
                    type: 'error',
                    content: 'This email address is already in use',
                });
            } else {
                setEmailError(error.message);
            }
        }
    };

    return (
        <div>
            <SignUpForm register={register} />
            <div>
                {contextHolder}
            </div>
        </div>
    )
}

export default SignUp;

