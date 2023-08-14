import { useState, createContext } from "react";
import React from "react";
export const GatherContext = createContext();
const Context = ({ children }) => {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registeredFirstName, setRegisteredFirstName] = useState("");
    const [registeredLasttName, setRegisteredLasttName] = useState("");
    const [user, setUser] = useState();
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginPasswordError, setLoginPasswordError] = useState("");
    const [emailNotFoundError, setEmailNotFoundError] = useState("");
    const contextValue = {
        registerEmail, setRegisterEmail, registerPassword, setRegisterPassword, registeredFirstName, setRegisteredFirstName,
        registeredLasttName, setRegisteredLasttName, user, setUser,
        emailError, setEmailError, passwordError
        , setPasswordError, firstNameError, setFirstNameError, lastNameError, setLastNameError, showPassword, setShowPassword,
        loginEmail, setLoginEmail, loginPassword, setLoginPassword,
        loginPasswordError, setLoginPasswordError, emailNotFoundError, setEmailNotFoundError
    }


    return (
        <GatherContext.Provider value={contextValue}>{children}</GatherContext.Provider>
    )
}

export default Context;