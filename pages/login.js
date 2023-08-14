import { useState, useEffect, useContext } from "react";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/firebase";
import { getDatabase, ref, get, update } from "firebase/database";
import { GatherContext } from "./gatherContext";
import LoginForm from "@/src/components/loginForm";
function Login() {

    const { loginEmail, loginPassword, setLoginPasswordError, setEmailNotFoundError } = useContext(GatherContext)

    const [loggedInUser, setLoggedInUser] = useState(null);

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
                await updateStatusToTrue(loginEmail);
                console.log(user);
            }
        } catch (error) {
            console.log(error.message);

            if (error.code === "auth/wrong-password") {
                setLoginPasswordError("Wrong password");
            } else if (error.code === "auth/user-not-found") {
                setEmailNotFoundError("Email not found");
            }
        }
    };


    return (
        <LoginForm login={login} />
    )
}

export default Login;