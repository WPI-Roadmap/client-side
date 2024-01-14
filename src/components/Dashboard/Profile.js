import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import { Button, Form, Input, Select } from "antd";
import RequestUtils from "../../Utils/RequestUtils.js";
import { auth, logout } from "../../Firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";

function Profile({  }) {
    // first, setFirst, last, setLast, year, setYear, major, setMajor
    const { Option } = Select;
    let [user, loading] = useAuthState(auth);
    
    let [first, setFirst] = useState("");
    let [last, setLast] = useState("");
    let [year, setYear] = useState("");
    let [major, setMajor] = useState("");

    const signupyayslay = () => {
        let reqbody = {
            first: first,
            last: last,
            email: user.email,
            year: year,
            major: major,
        }
        RequestUtils.post('/user?id=' + user.uid, reqbody)
    }

    useEffect(() => {
        if (user != null) {
            getUserInfo();
        }

    }, [user]);

    const getUserInfo = () => {
        try {
            RequestUtils.get('/retrieve?id=' + user.uid).then((response) => response.json())
                .then((data) => {
                    console.log(data.status)
                    if (data.status == 200) {
                        setFirst(data.data.name);
                        setLast(data.data.last);
                        setYear(data.data.year);
                        setMajor(data.data.major);
                    }
                    if (data.status == 404) {
                        console.log(data.status)
                    }
                });
        } catch {
            console.log("Error in retrieving user info.")
        }
    }

    return (
        <>
            <br>
            </br>
            <br></br>
            <h1>Profile</h1>

            <Form layout='vertical'>
                <Form.Item label="First Name" style={{
                    width: "50%",
                    marginBottom: "10px"
                }}>
                    <Input disabled size="medium" value={first} width={200} onChange={(e) => {
                        setFirst(e.target.value)
                    }}></Input>
                </Form.Item>
                <Form.Item disabled label="Last Name" style={{
                    width: "50%",
                    marginBottom: "10px"
                }}>
                    <Input size="medium" disabled value={last} width={200} onChange={(e) => {
                        setLast(e.target.value)
                    }}
                    />
                </Form.Item>
                <Form.Item label="Year" style={{
                    width: "50%",
                    marginBottom: "10px"
                }}>
                    <Select
                        size="medium"
                        onChange={(value) => {
                            setYear(value);
                        }}
                    >
                        <Option value="Freshman">Freshman</Option>
                        <Option value="Sophomore">Sophomore</Option>
                        <Option value="Junior">Junior</Option>
                        <Option value="Senior">Senior</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Major" style={{
                    width: "50%",
                }}>
                    <Select
                        size="medium"
                        onChange={(value) => {
                            setMajor(value);
                        }}
                    >
                        <Option value="Computer Science">Computer Science</Option>
                        <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                        <Option value="Robotics Engineering">Robotics Engineering</Option>
                        <Option value="Electrical Engineering">Electrical Engineering</Option>
                        <Option value="Biomedical Engineering">Biomedical Engineering</Option>
                        <Option value="Chemical Engineering">Chemical Engineering</Option>
                        <Option value="Aerospace Engineering">Aerospace Engineering</Option>
                        <Option value="Civil Engineering">Civil Engineering</Option>
                        <Option value="Biology">Biology</Option>
                        <Option value="Physics">Physics</Option>
                        <Option value="IMGD">IMGD</Option>
                        <Option value="Humanities">Humanities</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={() => { }}>
                        Update Profile
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default Profile;