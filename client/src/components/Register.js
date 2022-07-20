import { Cancel } from "@material-ui/icons";

import { useRef, useState } from "react";
import "../styles/Register.scss";

import { axiosInstance } from "../config";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axiosInstance.post("/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="registerContainer">
      <div className="title">
        <span>Register</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} required />
        <input type="email" placeholder="email" ref={emailRef} required />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
          required
        />
        <button className="btn" type="submit">
          Register
        </button>
        {success && (
          <span className="successMsg">Successfull. You can login now!</span>
        )}
        {error && (
          <span className="failureMsg">
            Username is Already in Use.
            <br />
            Something went wrong!
          </span>
        )}
      </form>
      <Cancel className="cancelBtn" onClick={() => setShowRegister(false)} />
    </div>
  );
}
