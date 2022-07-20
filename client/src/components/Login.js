import { Cancel } from "@material-ui/icons";

import { useRef, useState } from "react";
import "../styles/Login.scss";

import { axiosInstance } from "../config";

export default function Login({ setShowLogin, setCurrentUsername, myStorage }) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axiosInstance.post("/users/login", user);
      setCurrentUsername(res.data.username);
      myStorage.setItem("user", res.data.username);
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="title">
        <span>Log In</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} required />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
          required
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Wrong username or password</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
