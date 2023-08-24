import { useState, useContext } from "react";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { SparkContext } from "./context/sparkContentContext";

function LoginForm({ login }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginPasswordError,
    emailNotFoundError,
    setLoginPasswordError,
  } = useContext(SparkContext);
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setLoginPassword(e.target.value);

    if (validatePassword(newPassword)) {
      setLoginPasswordError("");
    } else {
      setLoginPasswordError(
        "Password must contain numbers, letters, and special characters."
      );
    }
  };

  return (
    <div className="signUpMaindiv">
      <div className="heading">Login</div>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <div className="formDiv">
          <div>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please input a valid email!",
                },
                {
                  required: true,
                  message: "Email is required!",
                },
              ]}>
              <Input
                placeholder="Email"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </Form.Item>
            {emailNotFoundError && (
              <p style={{ color: "red" }}>{emailNotFoundError}</p>
            )}
          </div>

          <div className="passwordDiv">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={handlePasswordChange}
              className="password"
            />
            {showPassword ? (
              <div className="iconDiv">
                {" "}
                <EyeTwoTone
                  className="passwordToggle"
                  onClick={() => setShowPassword(false)}
                  size={50}
                />
              </div>
            ) : (
              <div className="iconDiv">
                {" "}
                <EyeInvisibleOutlined
                  className="passwordToggle"
                  onClick={() => setShowPassword(true)}
                  size={50}
                />
              </div>
            )}
            {loginPasswordError && (
              <p style={{ color: "red" }}>{loginPasswordError}</p>
            )}
          </div>

          <div>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={login}>
                Login
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
      <div className="switchToLogin">
        Dont have an account?{" "}
        <Link href="signUp" className="switch">
          signUp
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
