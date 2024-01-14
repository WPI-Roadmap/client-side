import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import { Button, Form, Input, Select } from "antd";

function Profile({ first, setFirst, last, setLast, year, setYear, major, setMajor }) {

    const { Option } = Select;

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
                    <Input size="medium" width={200} onChange={(e) => {
                        setFirst(e.target.value)
                    }}></Input>
                </Form.Item>
                <Form.Item label="Last Name" style={{
                    width: "50%",
                    marginBottom: "10px"
                }}>
                    <Input size="medium" width={200} onChange={(e) => {
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