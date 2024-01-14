import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import { Button, ConfigProvider, Dropdown, Space, Form, Input, Layout, Menu, Modal, Select, Image, theme } from "antd";
import { BiLogOut } from "react-icons/bi";

import Joyride from 'react-joyride';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ApartmentOutlined,
    FileTextOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import ReactFlow, { Background, MarkerType } from "reactflow";
import Flow from "./Flow.js";
import RequirementsSidebar from "./Requirements/Requirements.js";
import Table from "../Table/Table.jsx";
import Profile from "./Profile.js";
import 'reactflow/dist/style.css';
import { auth, logout } from "../../Firebase.js";
import RequestUtils from "../../Utils/RequestUtils.js";
import { useAuthState } from "react-firebase-hooks/auth";

const data = require('./Courses.json');
const { Option } = Select;
const { Header, Sider, Content } = Layout;

function Dashboard() {

    const [collapsed, setCollapsed] = useState(false);

    let [user, loading] = useAuthState(auth);

    const handleClose = () => {
        setSignup(false);
    };
    let [logoutUser, setLogout] = useState(false);



    let [first, setFirst] = useState("");
    let [last, setLast] = useState("");
    let [year, setYear] = useState("");
    let [major, setMajor] = useState("");
    let [coursesTaken, setCoursesTaken] = useState([]);


    // console.log(user)
    useEffect(() => {
        // console.log(logoutUser)
        if (user == null && logoutUser) {
            navigate("/");
            setLogout(false);
        }

    }, [user]);



    const signupyayslay = () => {
        let reqbody = {
            first: first,
            last: last,
            email: user.email,
            year: year,
            major: major,
        }
        RequestUtils.post('/user?id=' + user.uid, reqbody)

        setSignup(false);
    }

    const initialNodes = [
        { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
        { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
    ];

    let [nodes, setNodes] = useState({});
    let [edges, setEdges] = useState({});
    let [tab, setTab] = useState(0);
    let [signup, setSignup] = useState(false);
    let [colorSchema, setColorSchema] = useState("tot");
    let [department, setDepartment] = useState("Computer Science Department");

    let tempCourses = [];
    let tempEdges = [];
    let courseTracking = [];
    let id = 1;
    let x = 0;
    let y = 0;

    function setCourses() {
        tempCourses = [];
        tempEdges = [];
        courseTracking = [];
        let encounteredCodes = new Set();

        for (let i = 0; i < data.Report_Entry.length; i++) {
            if (
                data.Report_Entry[i]["Course_Section_Owner"] == department &&
                !courseTracking.includes(data.Report_Entry[i]["Course_Title"])
            ) {
                courseTracking.push(data.Report_Entry[i]["Course_Title"]);
                let courseCode =
                    data.Report_Entry[i]["Course_Title"].match(/\d+/)[0];
                encounteredCodes.add(data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].search(/\s[0-9]*\s-\s/g)).trim())
                tempCourses.push({
                    id: id.toString(),
                    position: { x: x, y: y },
                    data: { label: data.Report_Entry[i]["Course_Title"] },
                    desc: data.Report_Entry[i]["Course_Description"],
                    // parentNode: courseCode.length == 3 ? 6 + data.Report_Entry.length : Number(courseCode.substring(0, 1)) - 1 + data.Report_Entry.length,
                    courseType: courseCode.length == 3 ? 7 : courseCode.substring(0, 1),
                    courseCode: data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim(),
                    professor: data["Report_Entry"][i]["Instructors"] ? data["Report_Entry"][i]["Instructors"] : "",
                });
                if (id % 2 == 0) {
                    x += 100;
                } else {
                    y += 100;
                }
                id++;
            }
        }

        let first = 1, second = 2;

        for (let i = 0; i < tempCourses.length; i++) {
            // The text to match against
            const text = tempCourses[i].desc;
            const courseCodeRegex = /CS\s\d+/g;

            // Use the match method to find all occurrences of the pattern in the text
            let courseCodes = [];
            encounteredCodes.forEach((code) => {
                const regex = new RegExp(code + "\\s\\d+");
                const match = text.match(regex);
                if (match !== null) courseCodes = courseCodes.concat(match);
            })
            // // Print the extracted course codes

            for (let j = 0; j < tempCourses.length; j++) {
                if (courseCodes.length > 0) {
                    for (var k = 0; k < courseCodes.length; k++) {
                        if (
                            tempCourses[j].courseCode !=
                            null
                        ) {
                            if (
                                tempCourses[j].courseCode == courseCodes[k]
                            ) {
                                tempEdges.push({
                                    id: 'e' + first.toString() + '-' + second.toString(),
                                    type: 'smoothstep',
                                    markerStart: {
                                        type: MarkerType.ArrowClosed,
                                        width: 20,
                                        height: 20,
                                    },
                                    source: tempCourses[i].id,
                                    target: tempCourses[j].id
                                });
                                first += 2;
                                second += 2;
                            }
                        }
                    }
                }

            }
        }
        id++;

        // for (let i = 1; i <= 7; i++) {
        //     tempCourses.push({
        //         id: i - 1 + data.Report_Entry.length,
        //         data: { label: (i == 7 ? 'Grad' : i + '000') + 'Courses' },
        //         // style: {  },
        //         type: 'group',
        //         courseType: i,
        //         courseCode: "",
        //         professor: ""
        //     })
        // }

        setEdges(tempEdges);
        setNodes(tempCourses);
    }
    useState(() => setCourses(), []);
    useEffect(() => { setCourses() }, [department]);

    useState(() => {
        if (user == null) {
            return;
        }
        RequestUtils.get('/retrieve?id=' + user.uid).then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.status == 200) {
                    setSignup(false);
                } else {
                    setSignup(true);
                }
            });

    });

    const services = [
        {
            id: 'frontend-app',
            name: 'Frontend',
            status: 'active',
            connections: ['graphql-server'],
            nodes: [
                {
                    status: 'running',
                    count: 1
                },
                {
                    status: 'failed',
                    count: 1
                }
            ],
            instancesActive: true,
            instancesHealthy: {
                total: 2,
                healthy: 0
            },
            transitionalStatus: false,
            reversed: true
        },
        {
            id: 'graphql-server',
            name: 'GraphQL',
            status: 'active',
            connections: ['api-server'],
            nodes: [
                {
                    status: 'running',
                    count: 2
                }
            ],
            instancesActive: true,
            instancesHealthy: {
                total: 2,
                healthy: 2
            },
            transitionalStatus: false,
            reversed: true
        },
        {
            id: 'api-server',
            name: 'API',
            status: 'active',
            connections: ['graphql-server'],
            nodes: [
                {
                    status: 'running',
                    count: 1
                },
                {
                    status: 'failed',
                    count: 1
                },
                {
                    status: 'unknown',
                    count: 1
                }
            ],
            instancesActive: true,
            instancesHealthy: {
                total: 3,
                healthy: 2
            },
            transitionalStatus: false,
            reversed: false
        }
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();

    let [q, setQ] = useState(1);

    let windowContent = (
        <Content
            style={{
                margin: 0, //'24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            <Flow initialNodes={nodes} initialEdges={edges} colorSchema={colorSchema} />
        </Content>
    );

    let steps = [
        {
            target: ".one",
            content: "Welcome to WPI Roadmap, here you can view your course roadmap based on course you have taken",
            placement: "right"
        },
        {
            target: ".two",
            content: "Here you can view and update your tracking sheet",
            placement: "right"
        },
        {
            target: ".three",
            content: "Here you can view your profile information",
            placement: "right"
        },
        {
            target: ".four",
            content: "This sidebar shows the requirements you have fulfilled so far, and you can check out each category of requirements",
            placement: "right"
        },
    ];

    const [runTour, setRunTour] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("visited") != true) {
            setRunTour(true);
            localStorage.setItem("visited", true);
        }
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
                        setCoursesTaken(data.data.courses);
                    }
                    if (data.status == 404) {
                        console.log(data.status)
                        setSignup(true);
                    }
                });
        } catch {
            console.log("Error in retrieving user info.")
        }
    }

    const handleTourEnd = () => {
        setRunTour(false);
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#AB2B37',
                    },
                }}
            >
                <Header>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="sideButt"
                        style={{
                            width: 48,
                            height: 48,
                            position: "absolute",
                            left: 6,
                            top: 9,
                            zIndex: 1,
                            background: "transparent",
                            color: "white",
                        }}
                    />
                    <Image
                        style={{ marginLeft: 10 }}
                        width={200}
                        preview={false}
                        src="/logo-white.png"
                    />
                    <Menu

                    />
                </Header>
                <Layout style={{ height: "100vh" }}>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        style={{}}
                        collapsedWidth={55}
                    >
                        <div className="demo-logo-vertical" />
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            items={[
                                {
                                    key: '1',
                                    icon: <ApartmentOutlined />,
                                    label: 'Roadmap',
                                    onClick: () => {
                                        setTab(0);
                                    }
                                },
                                {
                                    key: '2',
                                    icon: <FileTextOutlined />,
                                    label: 'Tracking Sheet',
                                    onClick: () => {
                                        setTab(1);
                                    }
                                },
                                {
                                    key: '3',
                                    icon: <UserOutlined />,
                                    label: 'Profile',
                                    onClick: () => {
                                        setTab(2);
                                    },
                                    className: 'three',
                                },
                                {
                                    key: "4",
                                    icon: <BiLogOut style={{ transform: 'rotate(90deg)' }} />,
                                    label: "Logout",
                                    onClick: () => {
                                        logout();
                                        setLogout(true);
                                    }

                                }
                            ]}
                        />
                    </Sider>

                    <Layout>
                        <Header
                            style={{
                                padding: 0,
                                background: colorBgContainer,
                                position: "relative",
                                height: 0,
                            }}
                        >
                            <Menu>

                            </Menu>
                        </Header>
                        <Content
                            style={{
                                padding: 25,
                                minHeight: 280,
                                background: "#F2F2F2",
                            }}
                        >
                            {tab === 0 ? (
                                <Flow
                                    initialNodes={nodes}
                                    initialEdges={edges}
                                    colorSchema={colorSchema}
                                    coursesTaken={coursesTaken}
                                />
                            ) : tab === 1 ? (
                                <Table />
                            ) : (
                                <div>
                                    <h1 style={{ marginTop: 5 }}>Profile</h1>
                                    <Form layout='vertical'>
                                        <Form.Item label="First Name" style={{
                                            width: "10%",
                                            minWidth: "200px",
                                            marginBottom: "10px",
                                        }}>
                                            <Input
                                                size="medium"
                                                width={200}
                                                onChange={(e) => {
                                                    setFirst(e.target.value)
                                                }}
                                                defaultValue={first}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Last Name" style={{
                                            width: "10%",
                                            minWidth: "200px",
                                            marginBottom: "10px",
                                        }}>
                                            <Input
                                                size="medium"
                                                width={200}
                                                onChange={(e) => {
                                                    setLast(e.target.value)
                                                }}
                                                defaultValue={last}
                                            />
                                        </Form.Item>
                                    </Form>

                                    <Form layout="vertical">
                                        <Form.Item label="Year" style={{
                                            width: "10%",
                                            minWidth: "200px",
                                            marginBottom: "10px"
                                        }}>
                                            <Select
                                                size="medium"
                                                onChange={(value) => {
                                                    setYear(value);
                                                }}
                                                defaultValue={year}
                                            >
                                                <Option value="Freshman">Freshman</Option>
                                                <Option value="Sophomore">Sophomore</Option>
                                                <Option value="Junior">Junior</Option>
                                                <Option value="Senior">Senior</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="Major" style={{
                                            width: "10%",
                                            minWidth: "200px",
                                        }}>
                                            <Select
                                                size="medium"
                                                onChange={(value) => {
                                                    setMajor(value);
                                                }}
                                                defaultValue={major}
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
                                        <p>Following: n/a, Followers: n/a (Coming Soon!)</p>
                                    </Form>
                                </div>

                            )}
                        </Content>
                        <RequirementsSidebar changeDepartment={setDepartment} changeColorSchema={setColorSchema} userCourses={coursesTaken} />
                    </Layout>
                </Layout>
                <Modal title="Get Started!" open={signup} onCancel={handleClose} footer={[]}>

                    <p>Tell us a little bit about yourself to customize your roadmap experience!</p>
                    <br></br>
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
                            <Button type="primary" htmlType="submit" onClick={() => { signupyayslay() }}>
                                Sign Up
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </ConfigProvider>

        </>
    );
}

export default Dashboard;