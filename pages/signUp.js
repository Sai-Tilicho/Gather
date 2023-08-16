import React, { useContext, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase";
import { getDatabase, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { GatherContext } from "./gatherContext";
import SignUpForm from "@/src/components/signUpForm";
import { useRouter } from "next/router";

import { Button, message, Space } from 'antd';

function SignUp() {
    const { registerEmail, registerPassword, setRegisterPassword, registeredFirstName,
        registeredLasttName, setUser, emailError, setEmailError, passwordError
        , setPasswordError, firstNameError, setFirstNameError, lastNameError, setLastNameError, }
        = useContext(GatherContext)

    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    useEffect(() => {
        const auth1 = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return auth1;
    }, []);


    const saveDataToDatabase = async (firstName, lastName, email) => {
        const db = getDatabase();
        const usersRef = ref(db, "users");
        const newUserId = uuidv4();
        const newUserRefPath = `users/${newUserId}`;

        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            status: "false"
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
        setEmailError("");
        setPasswordError("");
        setFirstNameError("");
        setLastNameError("");

        if (!registerEmail.includes("@") && registerEmail) {
            setEmailError("Invalid email format");
        }

        if (registerPassword === "") {
            setPasswordError("Password is required");
        }

        if (registeredFirstName === "") {
            setFirstNameError("First Name is required");
        }

        if (registeredLasttName === "") {
            setLastNameError("Last Name is required");
        }

        if (emailError || passwordError || firstNameError || lastNameError) {
            return;
        }

        try {
            if (registeredFirstName && registeredLasttName) {
                const user = await createUserWithEmailAndPassword(
                    auth,
                    registerEmail,
                    registerPassword
                );
                messageApi.open({
                    type: 'success',
                    content: 'account created successfully',
                });
                await saveDataToDatabase(registeredFirstName, registeredLasttName, registerEmail);
                router.push("/dashboard");
            } else {
                console.log("First name and last name are required.");
            }
        } catch (error) {
            console.log("inside", error.message);
            if (error.code === "auth/email-already-in-use") {
                // setEmailError("This email address is already in use.");
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

