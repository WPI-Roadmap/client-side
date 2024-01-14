import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import { Button, ConfigProvider, Dropdown, Form, Input, Layout, Menu, Modal, Select, Image, theme } from "antd";

import Joyride from 'react-joyride';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ApartmentOutlined,
    FileTextOutlined,
    UserOutlined,
} from "@ant-design/icons";
import ReactFlow, { Background, MarkerType } from "reactflow";
import Flow from "./Flow.js";
import RequirementsSidebar from "./Requirements/Requirements.js";

import Table from "../Table/Table.jsx";

import "reactflow/dist/style.css";

const data = require('./Courses.json');
const { Option } = Select;
const { Header, Sider, Content } = Layout;

function Dashboard() {

    const [collapsed, setCollapsed] = useState(false);

    const handleClose = () => {
        setSignup(false);
    }

    let [first, setFirst] = useState("");
    let [last, setLast] = useState("");
    let [year, setYear] = useState("");
    let [major, setMajor] = useState("");

    const items2 = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item
                </a>
            ),
        },
    ];

    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    ];

    let [nodes, setNodes] = useState({});

    let [edges, setEdges] = useState({});

    let [tab, setTab] = useState(0);

    let [signup, setSignup] = useState(true);

    let [colorSchema, setColorSchema] = useState("tot");


    const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

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
        let encounteredCodes = new Set();
    
        for (var i = 0; i < data.Report_Entry.length; i++) {
            // console.log(data.Report_Entry[i]["Course_Section_Owner"])
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
                    parentNode: courseCode.length == 3 ? 6 + data.Report_Entry.length : Number(courseCode.substring(0, 1)) - 1 + data.Report_Entry.length,
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

        let first = 1;
        let second = 2;


        for (let i = 0; i < tempCourses.length; i++) {

            // The text to match against
            const text = tempCourses[i].desc;

            // Use the match method to find all occurrences of the pattern in the text
            let courseCodes = [];
            encounteredCodes.forEach((code) => {
                const regex = new RegExp(code + "\\s\\d+");
                const match = text.match(regex);
                if (match !== null) courseCodes = courseCodes.concat(match);
            })
            // // Print the extracted course codes

            if (courseCodes.length > 0) console.log(courseCodes);

            for (var j = 0; j < tempCourses.length; j++) {
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
                                // console.log(tempCourses[i].data.label + " " + tempCourses[j].data.label)
                                first += 2;
                                second += 2;
                            }
                        }
                    }
                }

            }
        }
        id++;

        for (let i = 1; i <= 7; i++) {
            tempCourses.push({
                id: i - 1 + data.Report_Entry.length,
                data: { label: (i == 7 ? 'Grad' : i + '000') + 'Courses' },
                style: { display: "none" },
                type: 'group',
                courseType: i,
                courseCode: "",
                professor: ""
            })
        }

        setEdges(tempEdges);
        setNodes(tempCourses);
    }
    useState(() => setCourses(), []);
    useEffect(() => {setCourses()}, [department]);

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

    let windowContent
    if (tab == 1) {
        windowContent = <Content
            style={{
                margin: 0,//'24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            <Flow initialNodes={nodes} initialEdges={edges} />
            {/* <ReactFlow nodes={nodes} edges={initialEdges} /> */}
        </Content>;
    } else {
        // windowContent = <Table />
    }

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
                        src="/logo-white.png"
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

                        </Header>
                        <Content
                            style={{
                                padding: 20,
                                minHeight: 280,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {
                                tab === 0 ?
                                    <Flow initialNodes={nodes} initialEdges={edges} colorSchema={colorSchema}/> :
                                    tab === 1 ? <Table />
                                        : <>
                                            <h1>Profile</h1>
                                            <h3>First Name: {first}</h3>
                                            <h3>Last Name: {last}</h3>
                                            <h3>Year: {year}</h3>
                                            <h3>Major: {major}</h3>
                                        </>
                            }

                        </Content>
                        <RequirementsSidebar changeDepartment={setDepartment} changeColorSchema={setColorSchema}/>
                </Layout>
                </Layout>
                <Modal title="Get Started!" open={signup} onClose={handleClose} footer={[]}>

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
                            <Button type="primary" htmlType="submit" style={{ marginBottom: -10 }} onClick={() => { setSignup(false) }}>
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