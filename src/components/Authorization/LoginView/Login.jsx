// IMPORTS
import { Button, Form, Input } from "antd";
import { auth, logInWithEmailAndPassword, loginWithMicrosoft, registerWithEmailAndPassword } from "../../../Firebase";
// IMAGES
// import publicLogo from "../../../assets/images/public.png";
import microsoft from "../../../assets/images/Microsoft_icon.svg.png";
import { useNavigate } from "react-router";
import "./Login.css";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import publicLogo from "../../../assets/images/logo-black.png";

// ADMIN LOGIN VIEW
function LoginView(props) {
  const navigate = useNavigate();

  let [tab, setTab] = useState(false);

  let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    let [user, loading] = useAuthState(auth);

  const login = (values) => {

    tab === false ? logInWithEmailAndPassword(email, password) : registerWithEmailAndPassword(email, password);
};

    const register = (values) => {
        registerWithEmailAndPassword(email, password);
    }


    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }
    , [user]);


  // DISPLAY ADMIN LOGIN VIEW
  return props.show ? (
    <div className="login">
      <div className="login__container">
        <img className="coverLogo" src={publicLogo}></img>
        <Form
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
          <h2>
            <strong>Welcome to Roadmap-WPI</strong>
          </h2>
          <p className="padded-text">
          A universal solution to introduce you to WPI's major requirement system Developed by WPI students for WPI students (GoatHacks 2024).
          </p>
          <Form.Item
            wrapperCol={{
              span: 20,
            }}
          >
            <Input
              size="large"
              className="br-10 my-2"
              placeholder="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></Input>
          </Form.Item>
          <Form.Item>
            <Input.Password
              size="large"
              className="br-10 my-3"
              placeholder="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }
                }
            ></Input.Password>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className="microsoft"
              htmlType="submit"
            
            >
              {/* <img src={microsoft} height={"20px"} className="msft"></img> */}
              {tab === false ? "Login" : "Register"}
            </Button>
          </Form.Item>
        </Form>
        <p className="footerText mx-auto">
          <a className="link" onClick={() => setTab(!tab)} target="0">
            {tab === false ? "Register" : "Back to login"}
          </a>{" "}
          •{" "}
          <a className="link" href="" target="0">
            Privacy policy
          </a>{" "}
          •{" "}
          <a className="link" href="https://github.com/WPI-Roadmap" target="0">
            Github
          </a>{" "}
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default LoginView;
