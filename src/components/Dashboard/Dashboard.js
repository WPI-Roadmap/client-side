import { useState } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import { Button, Form, Layout, Menu, theme } from "antd";

import { MenuFoldOutlined, MenuUnfoldOutlined, ApartmentOutlined, FileTextOutlined } from "@ant-design/icons";
import ReactFlow, { Background, MarkerType } from 'reactflow';
import Flow from './Flow.js';
import RequirementsSidebar from './Requirements/Requirements.js';
import Table from "../Table/Table.jsx"

import 'reactflow/dist/style.css';

var data = require('./Courses.json');

const { Header, Sider, Content } = Layout;

function Dashboard() {

    const [collapsed, setCollapsed] = useState(false);

    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    ];

    let [nodes, setNodes] = useState({});

    let [edges, setEdges] = useState({});


    const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

    let [department, setDepartment] = useState("Computer Science Department");


    let tempCourses = [];
    let tempEdges = [];
    let courseTracking = [];
    let id = 1;
    let x = 0;
    let y = 0;

    function setCourses() {
        for (var i = 0; i < data.Report_Entry.length; i++) {
            // console.log(data.Report_Entry[i]["Course_Section_Owner"])
            if (data.Report_Entry[i]["Course_Section_Owner"] == department && !courseTracking.includes(data.Report_Entry[i]["Course_Title"])) {
                courseTracking.push(data.Report_Entry[i]["Course_Title"])
                let courseCode = data.Report_Entry[i]["Course_Title"].match(/\d+/)[0];
                tempCourses.push({
                    id: id.toString(),
                    position: { x: x, y: y },
                    data: { label: data.Report_Entry[i]["Course_Title"] },
                    desc: data.Report_Entry[i]["Course_Description"],
                    parentNode: courseCode.length == 3 ? 6 + data.Report_Entry.length : Number(courseCode.substring(0, 1)) - 1 + data.Report_Entry.length,
                    courseType: courseCode.length == 3 ? 7 : courseCode.substring(0, 1),
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


        for (var i = 0; i < tempCourses.length; i++) {

            // The text to match against
            const text = tempCourses[i].desc;

            const courseCodeRegex = /CS\s\d+/g;

            // Use the match method to find all occurrences of the pattern in the text
            const courseCodes = text.match(courseCodeRegex);

            // // Print the extracted course codes


            for (var j = 0; j < tempCourses.length; j++) {
                if (courseCodes != null) {

                    for (var k = 0; k < courseCodes.length; k++) {

                        if (tempCourses[j].data.label.match(courseCodeRegex) != null) {
                            if (tempCourses[j].data.label.match(courseCodeRegex) == courseCodes[k]) {
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
              id: i-1 + data.Report_Entry.length,
              data: { label: (i == 7 ? 'Grad' : i + '000') + 'Courses' },
              style: { display: "none" },
              type: 'group',
              courseType: i,
            })
        }

        setEdges(tempEdges);
        setNodes(tempCourses);
    }
    useState(() => setCourses(), []);

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

    let [tab, setTab] = useState(1);

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
        windowContent = <Table />
    }

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    onClick={(e) => {
                        setTab(e.key);
                    }}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <ApartmentOutlined />,
                            label: 'Roadmap',
                        },
                        {
                            key: '2',
                            icon: <FileTextOutlined />,
                            label: 'Tracking Sheet',
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
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="sideButt"
                        style={{
                            fontSize: '16px',
                            width: 48,
                            height: 48,
                            position: "absolute",
                            top: 16,
                            left: 16,
                            zIndex: 1,
                            background: "black",
                            color: "white",
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "white",
                        }}
                    />
                </Header>
                {windowContent}
                <RequirementsSidebar switchTree={() => { }} />
            </Layout>
        </Layout>
    );
}

export default Dashboard;