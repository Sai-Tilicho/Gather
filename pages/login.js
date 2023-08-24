import { useState, useEffect, useContext } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import LoginForm from "@/src/components/loginForm";
import { useRouter } from "next/router";
import { message } from "antd";
import { SparkContext } from "@/src/components/context/sparkContentContext";
import { LoadingOutlined } from "@ant-design/icons";
const Login = () => {
  const {
    loginEmail,
    loginPassword,
    setLoginPasswordError,
    setEmailNotFoundError,
  } = useContext(SparkContext);

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedInUser(user);
      autoLogin();
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  });

  const autoLogin = async () => {
    const storedCredentials = localStorage.getItem("userData");
    if (storedCredentials) {
      try {
        const parsedCredentials = JSON.parse(storedCredentials);
        const { email, password } = parsedCredentials;
        router.push("/dashboard");

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        messageApi.open({
          type: "success",
          content: "Auto-login successful",
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error.code === "auth/wrong-password") {
          setLoginPasswordError("Wrong password");
        } else if (error.code === "auth/user-not-found") {
          messageApi.open({
            type: "error",
            content: "email doesnot exists",
          });
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
        const userCredential = await signInWithEmailAndPassword(
          auth,
          loginEmail,
          loginPassword
        );
        messageApi.open({
          type: "success",
          content: "Login successful",
        });
        const storage = JSON.stringify(userCredential);
        localStorage.setItem("userCredentials", storage);
        const storedData = JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        });
        localStorage.setItem("userData", storedData);

        router.push("/dashboard");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setLoginPasswordError("Wrong password");
      } else if (error.code === "auth/user-not-found") {
        messageApi.open({
          type: "error",
          content: "Email does not exist",
        });
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="loader">
          {" "}
          <LoadingOutlined spin />
        </div>
      ) : (
        <LoginForm login={login} />
      )}
      <div>{contextHolder}</div>
    </div>
  );
};

export default Login;
