// IMPORTS
import { Button, Form, Input } from "antd";
import {
  auth,
  logInWithEmailAndPassword,
  loginWithMicrosoft,
  registerWithEmailAndPassword,
} from "../../../Firebase";
// IMAGES
// import publicLogo from "../../../assets/images/public.png";
import microsoft from "../../../assets/images/Microsoft_icon.svg.png";
import { useNavigate } from "react-router";
import "./LoginView.css";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import publicLogo from "../../../assets/images/logo-black.png";

// ADMIN LOGIN VIEW
function LoginView(props) {
  const navigate = useNavigate();

  const [isEqualPW, setIsEqualPW] = useState(false);

  let [tab, setTab] = useState(false);

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let [user, loading] = useAuthState(auth);
  let [error, setError] = useState("");

  const login = (values) => {
    try {
      if (isEqualPW === false) {
        throw new Error("Passwords do not match");
      }
      tab === false
        ? logInWithEmailAndPassword(email, password)
        : registerWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const register = (values) => {
    registerWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  // DISPLAY ADMIN LOGIN VIEW
  return props.show ? (
    <div className="login">
      <div className="login__container">
        <img className="coverLogo" src={publicLogo}></img>
        <Form
          layout="vertical"
          name="basic"
          className="login_form"
          style={{
            width: 300,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
          size="large"
          onFinish={login}
        >
          <p className="padded-text">
            WPI Roadmap is a universal solution to introduce you to WPI's major
            requirement system. Developed by WPI students for WPI students
            (GoatHacks 2024).
          </p>
          <Form.Item
            label="Email"
            style={{ marginTop: 0, fontWeight: "bold" }}
            wrapperCol={{
              span: 20,
            }}
          >
            <Input
              size="large"
              className="br-10 my-2"
              style={{ width: 300 }}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></Input>
          </Form.Item>

          <Form.Item
            label="Password"
            style={{ marginTop: 0, fontWeight: "bold" }}
          >
            <Input.Password
              size="large"
              className="br-10 my-3"
              style={{ width: 300 }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></Input.Password>
          </Form.Item>

          {tab && (
            <Form.Item
              label="Confirm Password"
              style={{ marginTop: 0, fontWeight: "bold" }}
            >
              <Input.Password
                size="large"
                className="br-10 my-3"
                style={{ width: 300 }}
                onChange={(e) => {
                  setIsEqualPW(e.target.value === password);
                }}
              ></Input.Password>
            </Form.Item>
          )}

          <p className="padded-text">{error}</p>
          <Form.Item>
            <Button type="primary" className="microsoft" htmlType="submit">
              {/* <img src={microsoft} height={"20px"} className="msft"></img> */}
              {tab === false ? "Login" : "Register"}
            </Button>
          </Form.Item>
        </Form>

        <Button
          type="secondary"
          className="register"
          htmlType="submit"
          onClick={() => setTab(!tab)}
          target="0"
        >
          {/* <img src={microsoft} height={"20px"} className="msft"></img> */}
          {tab === false ? "Register Account" : "Back to Login"}
        </Button>
        <p className="footerText mx-auto">
          {/* <a className="link" onClick={() => setTab(!tab)} target="0">
                        {tab === false ? "ter" : "Back to login"}
                    </a>{" "}
                    {/* •{" "}
          <a className="link" href="" target="0">
            Privacy policy
          </a>{" "} */}
          {/* •{" "} */}
          {/* <a className="link" href="https://github.com/WPI-Roadmap" target="0">
            GitHub
          </a>{" "} */}
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default LoginView;
