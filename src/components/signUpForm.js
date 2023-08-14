import React, { useContext } from "react";
import { Button, Form, Input } from 'antd';
import Link from "next/link";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { GatherContext } from "@/pages/gatherContext";

function SignUpForm({ register }) {
    const { setRegisterEmail, registerPassword, setRegisterPassword, setRegisteredFirstName,
        setRegisteredLasttName, emailError, passwordError
        , showPassword, setShowPassword, }
        = useContext(GatherContext)

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="signUpMaindiv">
            <div className="heading">SignUp</div>
            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off" >
                <div className="formDiv">
                    <div>
                        <Form.Item
                            name="First Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your First Name!',
                                },
                            ]}
                        >
                            <Input placeholder="First Name" onChange={(e) => setRegisteredFirstName(e.target.value)} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            name="Last Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Last Name!',
                                },
                            ]}
                        >
                            <Input placeholder="Last Name" onChange={(e) => setRegisteredLasttName(e.target.value)} />
                        </Form.Item>
                    </div>

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
                                onChange={(e) => setRegisterEmail(e.target.value)}
                            />
                        </Form.Item>
                        {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                    </div>

                    <div>

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="password"
                        />
                        {showPassword ? (
                            <EyeTwoTone
                                className="passwordToggle"
                                onClick={() => setShowPassword(false)}
                                size={50}
                            />
                        ) : (
                            <EyeInvisibleOutlined
                                className="passwordToggle"
                                onClick={() => setShowPassword(true)}
                                size={50}
                            />
                        )}
                        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                    </div>

                    <div>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" onClick={register}>
                                Create
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>
            <div className="switchToLogin">Already have an account? <Link href="login" className="switch">Login</Link></div>
        </div>
    )
}

export default SignUpForm;

