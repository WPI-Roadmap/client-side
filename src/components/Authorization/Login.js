// IMPORTS
import { useEffect, useContext, useState } from "react";

import dayjs from "dayjs";


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

  
  /**
   * Initializes the starting state
   * @param {*} user - userImpl object from Firebase
   * @redux - sets the starting state
   * @returns the calendar page if user
   */
  function initializeStates(user) {
      navigate("/calendar/" + dayjs().unix());
  }
  
  // USEEFFECT HOOKS
  useEffect(() => {

    if (user) {
      initializeStates(user);
    } else {
      navigate("/");
    }
  }, [user]);

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
