import { useState, useEffect, useContext } from "react";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/firebase";
import { getDatabase, ref, get, update } from "firebase/database";
import { GatherContext } from "./gatherContext";
import LoginForm from "@/src/components/loginForm";
import { useRouter } from "next/router";
import { Button, message } from 'antd';
function Login() {

    const { loginEmail, loginPassword, setLoginPasswordError, setEmailNotFoundError } = useContext(GatherContext)

    const [loggedInUser, setLoggedInUser] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoggedInUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const updateStatusToTrue = async (email) => {
        const db = getDatabase();
        const usersRef = ref(db, "users");
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const userId in users) {
                if (users[userId].email === email) {
                    await update(ref(db, `users/${userId}`), { status: "true" });
                    console.log(`Status updated to true for user with email: ${email}`);
                }
                else {
                    await update(ref(db, `users/${userId}`), { status: "false" });
                }
            }
        }
    };

    const login = async () => {
        setEmailNotFoundError("");

        if (loginPassword === "") {
            setLoginPasswordError("Password is required");
            return;
        } else {
            setLoginPasswordError("");
        }

        try {
            if (loginEmail && loginPassword) {
                const user = await signInWithEmailAndPassword(
                    auth,
                    loginEmail,
                    loginPassword
                );
                messageApi.open({
                    type: 'success',
                    content: ' loggin successfull',
                });
                await updateStatusToTrue(loginEmail);
                router.push("/dashboard");
                console.log(user);
            }
        } catch (error) {
            console.log(error.message);

            if (error.code === "auth/wrong-password") {
                setLoginPasswordError("Wrong password");
            } else if (error.code === "auth/user-not-found") {
                messageApi.open({
                    type: 'error',
                    content: 'email doesnot exists',
                });
            }
        }
    };

    return (
        <div>
            <LoginForm login={login} />
            <div>
                {contextHolder}
            </div>
        </div>
    )
}

export default Login;