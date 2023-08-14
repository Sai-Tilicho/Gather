import { useState, useContext } from "react";
import { Button, Form, Input } from 'antd';
import Link from "next/link";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { GatherContext } from "@/pages/gatherContext";
function LoginForm({ login }) {
    const [showPassword, setShowPassword] = useState(false);
    const { setLoginEmail, loginPassword, setLoginPassword,
        loginPasswordError, emailNotFoundError } = useContext(GatherContext)
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);

    };
    return (
        <div className="signUpMaindiv">
            <div className="heading">Login</div>
            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div className="formDiv">
                    <div>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Please input a valid email!',
                                },
                                {
                                    required: true,
                                    message: 'Email is required!',
                                },
                            ]}
                        >
                            <Input
                                placeholder="Email"
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </Form.Item>
                        {emailNotFoundError && <p style={{ color: "red" }}>{emailNotFoundError}</p>}
                    </div>

                    <div className="passwordInp">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="password"
                        />
                        {showPassword ? (
                            <EyeTwoTone
                                className="loginPasswordToggle"
                                onClick={() => setShowPassword(false)}
                            />
                        ) : (
                            <EyeInvisibleOutlined
                                className="loginPasswordToggle"
                                onClick={() => setShowPassword(true)}
                            />
                        )}
                        {loginPasswordError && <p style={{ color: "red" }}>{loginPasswordError}</p>}
                    </div>

                    <div>
                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit" onClick={login}>
                                Login
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>
            <div className="switchToLogin">Dont have an account? <Link href="signUp" className="switch">signUp</Link></div>
        </div>
    )
}

export default LoginForm;