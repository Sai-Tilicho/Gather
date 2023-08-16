import React, { useContext } from "react";
import { Button, Form, Input } from 'antd';
import Link from "next/link";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { GatherContext } from "@/pages/gatherContext";

function SignUpForm({ register }) {
    const { setRegisterEmail, registerPassword, setRegisterPassword, setRegisteredFirstName,
        setRegisteredLasttName, emailError, passwordError
        , showPassword, setShowPassword,setPasswordError }
        = useContext(GatherContext)

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const validateLettersOnly = (_, value) => {
        if (!value || /^[A-Za-z]+$/.test(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Please input letters only!'));
      };
      const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
        return passwordRegex.test(password);
      };
    
      const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setRegisterPassword(newPassword);
    
        if (validatePassword(newPassword)) {
          setPasswordError('');
        } else {
          setPasswordError('Password must contain numbers, letters, and special characters.');
        }
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
                                {
                                    validator: validateLettersOnly,
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
                                {
                                    validator: validateLettersOnly,
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

                    <div className="passwordDiv">

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={registerPassword}
                            onChange={handlePasswordChange}
                            className="password"
                        />
                        {showPassword ? (
                           <div className="iconDiv"> <EyeTwoTone
                                className="passwordToggle"
                                onClick={() => setShowPassword(false)}
                                size={50}
                            /></div>
                        ) : (
                           <div className="iconDiv"> <EyeInvisibleOutlined
                                className="passwordToggle"
                                onClick={() => setShowPassword(true)}
                                size={50}
                            /></div>
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

