// IMPORTS
import { Button, Form } from "antd";

// IMAGES
import publicLogo from "../../assets/images/public.png";
import microsoft from "../../assets/images/Microsoft_icon.svg.png";
import { useNavigate } from "react-router";

// ADMIN LOGIN VIEW
function LoginView(props) {

  const navigate = useNavigate();

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
        >
          <h2>
            <strong>Welcome</strong>
          </h2>
          <p className="padded-text">
            The new way to plan your WPI courses! Login to get started. Note, this
            is an WPI-student only tool.
          </p>
          <Form.Item
            wrapperCol={{
              span: 20,
            }}
          >
            <Button
              type="primary"
              className="microsoft"
              onClick={() => {navigate("/dashboard")}}
            >
              {/* <img src={microsoft} height={"20px"} className="msft"></img> */}
             Login with Microsoft
              
            </Button>
          </Form.Item>

        </Form>
        <p className="footerText mx-auto">
          <a
            className="link"
            href=""
            target="0"
          >
            More information
          </a>{" "}
          •{" "}
          <a
            className="link"
            href=""
            target="0"
          >
            Privacy policy
          </a>{" "}
          •{" "}
          <a
            className="link"
            href=""
            target="0"
          >
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
