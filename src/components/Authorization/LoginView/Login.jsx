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
                <img className="coverLogo" src='/logo-black.png'></img>
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
                        <strong>Welcome to WPI Roadmap</strong>
                    </h2>
                    <p className="padded-text">
                        Plan your academic success at WPI with a universal solution to WPI's major requirement system Developed by WPI students for WPI students (GoatHack 2024).
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
                            Get Started
                        </Button>
                    </Form.Item>

                </Form>

            </div>
        </div>
    ) : (
        <></>
    );
}

export default LoginView;
