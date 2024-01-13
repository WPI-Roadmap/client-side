import { useState } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import { Button, Form, Layout, Menu, theme } from "antd";

import { MenuFoldOutlined, MenuUnfoldOutlined, ApartmentOutlined, FileTextOutlined } from "@ant-design/icons";
import ReactFlow from 'reactflow';
import Flow from './Flow.js';
import RequirementsSidebar from './Requirements/Requirements.js';

import 'reactflow/dist/style.css';

var data = require('./courses.json');

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
                tempCourses.push({
                    id: id.toString(),
                    position: { x: x, y: y },
                    data: { label: data.Report_Entry[i]["Course_Title"] },
                    desc: data.Report_Entry[i]["Course_Description"]
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

    let [q, setQ] = useState(1);

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
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
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Flow initialNodes={nodes} initialEdges={edges} />
                    {/* <ReactFlow nodes={nodes} edges={initialEdges} /> */}
                </Content>
                <RequirementsSidebar switchTree={() => { }} />
            </Layout>
        </Layout>
    );
}

export default Dashboard;