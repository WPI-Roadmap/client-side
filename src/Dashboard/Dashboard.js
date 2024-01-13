import { useState } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import { Button, Form, Layout, Menu, theme} from "antd";
import ReactFlow from 'reactflow';
 
import 'reactflow/dist/style.css';

import { MenuFoldOutlined, MenuUnfoldOutlined, ApartmentOutlined, FileTextOutlined } from "@ant-design/icons";
import RequirementsSidebar from "./Requirements/Requirements.js";
import Flow from "./Flow.js";

const { Header, Sider, Content } = Layout;
var data = require('./Courses.json');

function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);

    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
      ];

    let [nodes, setNodes] = useState({});
    
    
    const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }];

    let [department, setDepartment] = useState("Computer Science Department");

    console.log(data)
    let tempCourses  = [];
    let courseTracking = [];
    let id = 1;
    let x = 0;
    let y = 0;

    function setCourses() {
    for(var i = 0; i < data.Report_Entry.length; i++) {
        // console.log(data.Report_Entry[i]["Course_Section_Owner"])
        if(data.Report_Entry[i]["Course_Section_Owner"] == department && !courseTracking.includes(data.Report_Entry[i]["Course_Title"])) {
            courseTracking.push(data.Report_Entry[i]["Course_Title"])
            tempCourses.push({
                id: id.toString(),
                position: { x: x, y: y },
                data: { label: data.Report_Entry[i]["Course_Title"] }
            })
            if(id % 2 == 0) {
                x+=100;
            } else {
                y+=100;
            }
            id++;
        }
    }
    console.log(tempCourses)
    console.log(initialNodes)
    setNodes(tempCourses);
}
    useState(() => setCourses(), []);

    const services =  [
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

    let [ q, setQ ] = useState(1);

    return (
        <Layout>
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
          <Flow initialNodes={nodes} initialEdges={initialEdges}/>
          {/* <ReactFlow nodes={nodes} edges={initialEdges} /> */}
        </Content>
        <RequirementsSidebar />
      </Layout>
    </Layout>
    );
}

export default Dashboard;