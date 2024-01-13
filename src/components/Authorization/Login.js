// IMPORTS
import { useEffect, useState } from "react";

// STYLESHEETS
import "./Login.css";

// IMAGES
import pageImage from "../../assets/images/cover-image.jpeg";
import LoginView from "./LoginView/Login";
import { useNavigate } from "react-router";

// LOGIN PAGE
function Login() {
  // CONSTANTS AND USESTATE HOOKS

  const navigate = useNavigate();

  let [tab, setTab] = useState(0);
  let user = null;


  // DISPLAY LOGIN PAGE(S)
  return (
    <>
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          background: `url(${pageImage}) no-repeat scroll center center`,
          backgroundSize: "cover",
          height: "100vh",
        }}
        className="wrapper"
      >
          <LoginView show={tab === 0}></LoginView>
      </div>
    </>
  );
}
export default Login;
