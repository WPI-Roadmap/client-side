import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import {
    Button,
    ConfigProvider,
    Dropdown,
    Space,
    Form,
    Input,
    Layout,
    Menu,
    Modal,
    Select,
    Image,
    theme,
    Popover,
} from "antd";
import { BiLogOut } from "react-icons/bi";

import Joyride from "react-joyride";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ApartmentOutlined,
    FileTextOutlined,
    UserOutlined,
    LogoutOutlined,
    InfoCircleFilled,
} from "@ant-design/icons";
import ReactFlow, { Background, MarkerType } from "reactflow";
import Flow from "./Flow.js";
import RequirementsSidebar from "./Requirements/Requirements.js";
import Table from "../Table/Table.jsx";
import Profile from "./Profile.js";
import "reactflow/dist/style.css";
import { auth, logout } from "../../Firebase.js";
import RequestUtils from "../../Utils/RequestUtils.js";
import { useAuthState } from "react-firebase-hooks/auth";

const data = require("./courses.json");
const { Option } = Select;
const { Header, Sider, Content } = Layout;

const usesForEachTabDesc = (
    <div
        style={{
            maxWidth: "600px",
            overflowY: "auto",
            maxHeight: "400px",
        }}
    >
        <div id="courseRoadmap" class="tab">
            <h2
                style={{
                    margin: 0,
                    marginBottom: '0'
                }}
            >
                Course Roadmap
            </h2>
            <p>
                <strong>Overview</strong>
                <br />
                In the "Course Roadmap" tab, discover a visual representation of
                your academic journey. Navigate through the courses required for
                your program, view prerequisites, and plan your path to
                graduation effortlessly.
            </p>
            <p>
                <strong>Filter and Explore</strong>
                <br />
                Utilize the filtering options to focus on specific subjects or
                requirements. Tailor your roadmap to align with your academic
                interests and degree goals.
            </p>
            <p>
                <strong>Color-Coded Guidance</strong>
                <br />
                Benefit from our color-coded system indicating previous student
                ratings and difficulty levels. Quickly identify highly
                recommended courses and assess the academic challenges
                associated with each class.
            </p>
            <p>
                <strong>Prerequisite Dependencies</strong>
                <br />
                Easily identify and understand prerequisite dependencies,
                ensuring a seamless progression through your academic program.
            </p>
        </div>

        <div id="trackingSheet" class="tab">
            <h2
                style={{
                    marginTop: '2.5rem',
                    marginBottom: '0'
                }}
            >Tracking Sheet</h2>
            <p>
                <strong>Personalized Progress</strong>
                <br />
                The "Tracking Sheet" tab provides a personalized overview of
                your academic progress. Track completed courses, upcoming
                classes, and any outstanding requirements all in one place.
            </p>
            <p>
                <strong>Credit Tracking</strong>
                <br />
                Monitor your earned credits, ensuring you stay on track towards
                meeting the credit requirements for your degree.
            </p>
            <p>
                <strong>Grade Tracker</strong>
                <br />
                Record your grades for each course, enabling you to assess your
                academic performance over time.
            </p>
            <p>
                <strong>Advisory Notes</strong>
                <br />
                Add advisory notes to keep track of important information,
                deadlines, or insights from academic advisors.
            </p>
        </div>

        <div id="profile" class="tab">
            <h2
                style={{
                    marginTop: '2.5rem'
                }}
            >Profile</h2>
            <p>
                <strong>Personal Information</strong>
                <br />
                In the "Profile" tab, manage and update your personal
                information. This includes Your major and graduating class
            </p>
        </div>
    </div>
);

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
    let [reqSidebar, setReqSidebar] = useState(false);
    let [showTitle, setShowTitle] = useState(true);

    // console.log(user)
    useEffect(() => {
        // console.log(logoutUser)
        if (user == null && logoutUser) {
            navigate("/");
            setLogout(false);
        }
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading]);

    useEffect(() => {
        setReqSidebar(
            <RequirementsSidebar
                changeDepartment={setDepartment}
                changeColorSchema={setColorSchema}
                userCourses={coursesTaken}
            />
        );
    }, [coursesTaken]);

    const signupyayslay = () => {
        let reqbody = {
            first: first,
            last: last,
            email: user.email,
            year: year,
            major: major,
        };
        RequestUtils.post("/user?id=" + user.uid, reqbody);

        setSignup(false);
    };

    const updateUser = () => {
        let reqbody = {
            first: first,
            last: last,
            email: user.email,
            year: year,
            major: major,
        };

        RequestUtils.post("/updateUser?id=" + user.uid, reqbody).then((response) => response.json())
            .then((data) => {
                alert("User updated successfully!");
            });


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
                let courseNum =
                    data.Report_Entry[i]["Course_Title"].match(/\d+/)[0];
                let courseCode = data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim();
                encounteredCodes.add(data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].search(/\s[0-9]*\s-\s/g)).trim())
                tempCourses.push({
                    id: id.toString(),
                    position: { x: x, y: y },
                    data: { courseCode: courseCode, courseTitle: data["Report_Entry"][i]["Course_Title"].substring(3 + courseCode.length), showTitle: showTitle},//label: data.Report_Entry[i]["Course_Title"] },
                    desc: data.Report_Entry[i]["Course_Description"],
                    // parentNode: courseNum.length == 3 ? 6 + data.Report_Entry.length : Number(courseNum.substring(0, 1)) - 1 + data.Report_Entry.length,
                    courseType: courseNum.length == 3 ? 7 : courseNum.substring(0, 1),
                    courseCode: courseCode,
                    professor: data["Report_Entry"][i]["Instructors"] ? data["Report_Entry"][i]["Instructors"] : "",
                    type: "courseNode"
                });
                if (id % 2 == 0) {
                    x += 100;
                } else {
                    y += 100;
                }
                id++;
            }
        }

        let first = 1,
            second = 2;

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
            });
            // // Print the extracted course codes

            for (let j = 0; j < tempCourses.length; j++) {
                if (courseCodes.length > 0) {
                    for (var k = 0; k < courseCodes.length; k++) {
                        if (tempCourses[j].courseCode != null) {
                            if (tempCourses[j].courseCode == courseCodes[k]) {
                                tempEdges.push({
                                    id:
                                        "e" +
                                        first.toString() +
                                        "-" +
                                        second.toString(),
                                    type: "smoothstep",
                                    markerStart: {
                                        type: MarkerType.ArrowClosed,
                                        width: 20,
                                        height: 20,
                                    },
                                    source: tempCourses[i].id,
                                    target: tempCourses[j].id,
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
    useEffect(() => { setCourses() }, [department, showTitle]);

    useState(() => {
        if (user == null) {
            return;
        }
        RequestUtils.get("/retrieve?id=" + user.uid)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.status == 200) {
                    setSignup(false);
                } else {
                    setSignup(true);
                }
            });
    });

    const services = [
        {
            id: "frontend-app",
            name: "Frontend",
            status: "active",
            connections: ["graphql-server"],
            nodes: [
                {
                    status: "running",
                    count: 1,
                },
                {
                    status: "failed",
                    count: 1,
                },
            ],
            instancesActive: true,
            instancesHealthy: {
                total: 2,
                healthy: 0,
            },
            transitionalStatus: false,
            reversed: true,
        },
        {
            id: "graphql-server",
            name: "GraphQL",
            status: "active",
            connections: ["api-server"],
            nodes: [
                {
                    status: "running",
                    count: 2,
                },
            ],
            instancesActive: true,
            instancesHealthy: {
                total: 2,
                healthy: 2,
            },
            transitionalStatus: false,
            reversed: true,
        },
        {
            id: "api-server",
            name: "API",
            status: "active",
            connections: ["graphql-server"],
            nodes: [
                {
                    status: "running",
                    count: 1,
                },
                {
                    status: "failed",
                    count: 1,
                },
                {
                    status: "unknown",
                    count: 1,
                },
            ],
            instancesActive: true,
            instancesHealthy: {
                total: 3,
                healthy: 2,
            },
            transitionalStatus: false,
            reversed: false,
        },
    ];

    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    const colorBgContainer = "#3d405b";

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
            <Flow
                initialNodes={nodes}
                initialEdges={edges}
                colorSchema={colorSchema}
            />
        </Content>
    );

    let steps = [
        {
            target: ".one",
            content:
                "Welcome to WPI Roadmap, here you can view your course roadmap based on course you have taken",
            placement: "right",
        },
        {
            target: ".two",
            content: "Here you can view and update your tracking sheet",
            placement: "right",
        },
        {
            target: ".three",
            content: "Here you can view your profile information",
            placement: "right",
        },
        {
            target: ".four",
            content:
                "This sidebar shows the requirements you have fulfilled so far, and you can check out each category of requirements",
            placement: "right",
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
            RequestUtils.get("/retrieve?id=" + user.uid)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.status);
                    if (data.status == 200) {
                        setFirst(data.data.name);
                        setLast(data.data.last);
                        setYear(data.data.year);
                        setMajor(data.data.major);
                        setCoursesTaken(data.data.courses);
                    }
                    if (data.status == 404) {
                        console.log(data.status);
                        setSignup(true);
                    }
                });
        } catch {
            console.log("Error in retrieving user info.");
        }
    };

    const handleTourEnd = () => {
        setRunTour(false);
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#AB2B37",
                    },
                }}
            >
                <Header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <Button
                            type="text"
                            icon={
                                collapsed ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )
                            }
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
                    </div>
                    <Popover content={usesForEachTabDesc}>
                        <InfoCircleFilled
                            style={{
                                background: "transparent",
                                color: "white",
                                borderWidth: 0,
                                justifySelf: "flex-end",
                                fontSize: "1.25rem",
                            }}
                        />
                    </Popover>
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
                            defaultSelectedKeys={["1"]}
                            items={[
                                {
                                    key: "1",
                                    icon: <ApartmentOutlined />,
                                    label: "Roadmap",
                                    onClick: () => {
                                        setTab(0);
                                    },
                                },
                                {
                                    key: "2",
                                    icon: <FileTextOutlined />,
                                    label: "Tracking Sheet",
                                    onClick: () => {
                                        setTab(1);
                                    },
                                },
                                {
                                    key: "3",
                                    icon: <UserOutlined />,
                                    label: "Profile",
                                    onClick: () => {
                                        setTab(2);
                                    },
                                    className: "three",
                                },
                                {
                                    key: "4",
                                    icon: (
                                        <BiLogOut
                                            style={{
                                                transform: "rotate(90deg)",
                                            }}
                                        />
                                    ),
                                    label: "Logout",
                                    onClick: () => {
                                        logout();
                                        setLogout(true);
                                    },
                                },
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
                            <Menu></Menu>
                        </Header>
                        <Content
                            style={{
                                padding: 15,
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
                                <div
                                    style={{
                                        margin: "30px",
                                    }}
                                >
                                    <h1 style={{ marginTop: 5 }}>Profile</h1>
                                    <Form layout="vertical">
                                        <Form.Item
                                            label="First Name"
                                            style={{
                                                width: "10%",
                                                minWidth: "200px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <Input
                                                size="medium"
                                                width={200}
                                                onChange={(e) => {
                                                    setFirst(e.target.value);
                                                }}
                                                defaultValue={first}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Last Name"
                                            style={{
                                                width: "10%",
                                                minWidth: "200px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <Input
                                                size="medium"
                                                width={200}
                                                onChange={(e) => {
                                                    setLast(e.target.value);
                                                }}
                                                defaultValue={last}
                                            />
                                        </Form.Item>
                                    </Form>

                                    <Form layout="vertical">
                                        <Form.Item
                                            label="Year"
                                            style={{
                                                width: "10%",
                                                minWidth: "200px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <Select
                                                size="medium"
                                                onChange={(value) => {
                                                    setYear(value);
                                                }}
                                                defaultValue={year}
                                            >
                                                <Option value="Freshman">
                                                    Freshman
                                                </Option>
                                                <Option value="Sophomore">
                                                    Sophomore
                                                </Option>
                                                <Option value="Junior">
                                                    Junior
                                                </Option>
                                                <Option value="Senior">
                                                    Senior
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="Major"
                                            style={{
                                                width: "10%",
                                                minWidth: "200px",
                                            }}
                                        >
                                            <Select
                                                size="medium"
                                                onChange={(value) => {
                                                    setMajor(value);
                                                }}
                                                defaultValue={major}
                                            >
                                                <Option value="Computer Science">
                                                    Computer Science
                                                </Option>
                                                <Option value="Mechanical Engineering">
                                                    Mechanical Engineering
                                                </Option>
                                                <Option value="Robotics Engineering">
                                                    Robotics Engineering
                                                </Option>
                                                <Option value="Electrical Engineering">
                                                    Electrical Engineering
                                                </Option>
                                                <Option value="Biomedical Engineering">
                                                    Biomedical Engineering
                                                </Option>
                                                <Option value="Chemical Engineering">
                                                    Chemical Engineering
                                                </Option>
                                                <Option value="Aerospace Engineering">
                                                    Aerospace Engineering
                                                </Option>
                                                <Option value="Civil Engineering">
                                                    Civil Engineering
                                                </Option>
                                                <Option value="Biology">
                                                    Biology
                                                </Option>
                                                <Option value="Physics">
                                                    Physics
                                                </Option>
                                                <Option value="IMGD">
                                                    IMGD
                                                </Option>
                                                <Option value="Humanities">
                                                    Humanities
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                onClick={() => {
                                                    updateUser();
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </Form.Item>
                                        {/* <p>Following: n/a, Followers: n/a (Coming Soon!)</p> */}
                                    </Form>
                                </div>
                            )}
                        </Content>
                        <RequirementsSidebar changeDepartment={setDepartment} changeColorSchema={setColorSchema} userCourses={coursesTaken} setShowTitle={setShowTitle}/>
                    </Layout>
                </Layout>
                <Modal
                    title="Getting Started!"
                    open={signup}
                    onCancel={handleClose}
                    footer={[]}
                >
                    <p style={{ marginBottom: 20 }}>
                        Tell us a little bit about yourself to customize your
                        roadmap experience!
                    </p>
                    <Form layout="vertical" style={{ marginBottom: 0 }}>
                        <Form.Item
                            label="Major"
                            required
                            style={{
                                width: "50%",
                                marginBottom: "10px",
                            }}
                        >
                            <Select
                                size="medium"
                                onChange={(value) => {
                                    setMajor(value);
                                }}
                                placeholder="Select a major"
                            >
                                <Option value="Computer Science">
                                    Computer Science
                                </Option>
                                <Option value="Mechanical Engineering">
                                    Mechanical Engineering
                                </Option>
                                <Option value="Robotics Engineering">
                                    Robotics Engineering
                                </Option>
                                <Option value="Electrical Engineering">
                                    Electrical Engineering
                                </Option>
                                <Option value="Biomedical Engineering">
                                    Biomedical Engineering
                                </Option>
                                <Option value="Chemical Engineering">
                                    Chemical Engineering
                                </Option>
                                <Option value="Aerospace Engineering">
                                    Aerospace Engineering
                                </Option>
                                <Option value="Civil Engineering">
                                    Civil Engineering
                                </Option>
                                <Option value="Biology">Biology</Option>
                                <Option value="Physics">Physics</Option>
                                <Option value="IMGD">IMGD</Option>
                                <Option value="Humanities">Humanities</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="First Name"
                            style={{
                                width: "50%",
                                marginBottom: "10px",
                            }}
                        >
                            <Input
                                size="medium"
                                placeholder="Enter your first name"
                                width={200}
                                onChange={(e) => {
                                    setFirst(e.target.value);
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item
                            label="Last Name"
                            style={{
                                width: "50%",
                                marginBottom: "10px",
                            }}
                        >
                            <Input
                                size="medium"
                                placeholder="Enter your last name"
                                width={200}
                                onChange={(e) => {
                                    setLast(e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Year"
                            style={{
                                width: "50%",
                                marginBottom: 30,
                            }}
                        >
                            <Select
                                size="medium"
                                placeholder="Select your year"
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
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => {
                                    signupyayslay();
                                }}
                            >
                                Continue
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </ConfigProvider>
        </>
    );
}



export default Dashboard;

