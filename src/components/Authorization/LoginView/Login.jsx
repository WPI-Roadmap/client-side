// IMPORTS
import { Button, Form } from "antd";
import { loginWithMicrosoft } from "../../../Firebase"
// IMAGES
// import publicLogo from "../../../assets/images/public.png";
import microsoft from "../../../assets/images/Microsoft_icon.svg.png";
import { useNavigate } from "react-router";

// ADMIN LOGIN VIEW
function LoginView(props) {

    const navigate = useNavigate();

    // DISPLAY ADMIN LOGIN VIEW
    return props.show ? (
        <div className="login">
            <div className="login__container">
                <img className="coverLogo" src='/public.png'></img>
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
                        <strong>Welcome to Roadmap-WPI</strong>
                    </h2>
                    <p className="padded-text">
                        A universal solution to introduce you to WPI's major requirement system Developed by WPI students for WPI students (GoatHack 2024).
                    </p>
                    <Form.Item
                        wrapperCol={{
                            span: 20,
                        }}
                    >
                        <Button
                            type="primary"
                            className="microsoft"
                            onClick={() => {
                                // loginWithMicrosoft();
                                navigate("/dashboard");
                            }}
                        >
                            {/* <img src={microsoft} height={"20px"} className="msft"></img> */}
                            Continue To App
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
