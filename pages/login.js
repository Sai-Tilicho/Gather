import { useState, useEffect, useContext } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import LoginForm from "@/src/components/loginForm";
import { useRouter } from "next/router";
import { message } from "antd";
import { SparkContext } from "@/src/components/sparkContentContext";
function Login() {
  const {
    loginEmail,
    loginPassword,
    setLoginPasswordError,
    setEmailNotFoundError,
  } = useContext(SparkContext);

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
        const userCredential = await signInWithEmailAndPassword(
          auth,
          loginEmail,
          loginPassword
        );
        messageApi.open({
          type: "success",
          content: " loggin successfull",
        });
        const storage = JSON.stringify(userCredential);
        localStorage.setItem("userCredentials", storage);
        console.log(storage);

        router.push("/dashboard");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setLoginPasswordError("Wrong password");
      } else if (error.code === "auth/user-not-found") {
        messageApi.open({
          type: "error",
          content: "email doesnot exists",
        });
      }
    }
  };

  return (
    <div>
      <LoginForm login={login} />
      <div>{contextHolder}</div>
    </div>
  );
}

export default Login;
