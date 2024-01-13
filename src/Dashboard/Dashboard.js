import { useState } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import { Button, Dropdown, Form, Layout, Menu, Switch, theme } from "antd";

import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import ReactFlow from 'reactflow';
import Flow from './Flow.js';
import RequirementsSidebar from './Requirements/Requirements.js';
 
import 'reactflow/dist/style.css';

var data = require('./Courses.json');

const { Header, Sider, Content } = Layout;
var data = require('./Courses.json');

function Dashboard() {

    const [collapsed, setCollapsed] = useState(false);

    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
      ];

    let [nodes, setNodes] = useState({});

    let [edges, setEdges] = useState({});

    const items = [
        
            {
                key: "1",
                label: "Humanities and Arts Department",
                onClick: () => {
                    setDepartment("Humanities and Arts Department");
                    setCourses();
                }
            },
            {
                key: "2",
                label: "Business School",
                onClick: () => {
                    setDepartment("Business School");
                    setCourses();
                }
            },
            {
                key: "3",
                label: "Aerospace Engineering Department"
            },
            {
                key: "4",
                label: "Interactive Media and Game Development Program"
            },
            {
                key: "5",
                label: "Civil, Environmental, and Architectural Engineering Department"
            },
            {
                key: "6",
                label: "Air Force Aerospace Studies (AFROTC) Department"
            },
            {
                key: "7",
                label: "Biology and Biotechnology Department"
            },
            {
                key: "8",
                label: "Chemistry and Biochemistry Department"
            },
            {
                key: "9",
                label: "Bioinformatics and Computational Biology Program"
            },
            {
                key: "10",
                label: "Biomedical Engineering Department"
            },
            {
                key: "11",
                label: "Mechanical and Materials Engineering Department"
            },
            {
                key: "12",
                label: "Robotics Engineering Department"
            },
            {
                key: "13",
                label: "Chemical Engineering Department"
            },
            {
                key: "14",
                label: "Worcester Polytechnic Institute"
            },
            {
                key: "15",
                label: "Computer Science Department"
            },
            {
                key: "16",
                label: "Mathematical Sciences Department"
            },
            {
                key: "17",
                label: "Data Science Program"
            },
            {
                key: "18",
                label: "Electrical and Computer Engineering Department"
            },
            {
                key: "19",
                label: "Social Science and Policy Studies Department"
            },
            {
                key: "20",
                label: "Undergraduate Studies Department"
            },
            {
                key: "21",
                label: "Engineering School"
            },
            {
                key: "22",
                label: "Fire Protection Engineering Department"
            },
            {
                key: "23",
                label: "Integrative & Global Studies Department"
            },
            {
                key: "24",
                label: "Graduate Studies"
            },
            {
                key: "25",
                label: "Military Science (Army ROTC) Department"
            },
            {
                key: "26",
                label: "Materials Science and Engineering Program"
            },
            {
                key: "27",
                label: "Neuroscience Program"
            },
            {
                key: "28",
                label: "Physics Department"
            },
            {
                key: "29",
                label: "Physical Education and Athletics Department"
            }
        
      ];
    
    
    const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

    

    let [department, setDepartment] = useState("Computer Science Department");


    let tempCourses  = [];
    let tempEdges = [];
    let courseTracking = [];
    let id = 1;
    let x = 0;
    let y = 0;

    let departments = [];
    let item1 = [];
    let [dropDownItems, setDropDownItems] = useState([]);
    let inc = 1;
    function getDepartments() {
        for(var i = 0; i < data.Report_Entry.length; i++) {
            if(!departments.includes(data.Report_Entry[i]["Course_Section_Owner"])) {
                departments.push(data.Report_Entry[i]["Course_Section_Owner"]);
                item1.push({
                    key: inc.toString(), 
                    label: data.Report_Entry[i]["Course_Section_Owner"],
                    // onClick: () => {
                    //     setDepartment(data.Report_Entry[i]["Course_Section_Owner"]);
                    // }
                });
                inc++;
            }
        }
        console.log(item1);
        setDropDownItems(item1);
        
    }

    function setCourses() {
    for(var i = 0; i < data.Report_Entry.length; i++) {
        // console.log(data.Report_Entry[i]["Course_Section_Owner"])
        
        console.log(department)
        if(data.Report_Entry[i]["Course_Section_Owner"] == department && !courseTracking.includes(data.Report_Entry[i]["Course_Title"])) {
            courseTracking.push(data.Report_Entry[i]["Course_Title"])
            tempCourses.push({
                id: id.toString(),
                position: { x: x, y: y },
                data: { label: data.Report_Entry[i]["Course_Title"] },
                desc: data.Report_Entry[i]["Course_Description"],
                onclick: () => {
                    alert("clicked");
                }
            });
            if(id % 2 == 0) {
                x+=100;
            } else {
                y+=100;
            }
            id++;
        }
    }

    let first = 1;
    let second = 2;


    for(var i = 0; i < tempCourses.length; i++) {

        // The text to match against
        const text = tempCourses[i].desc;

        const courseCodeRegex = /CS\s\d+/g;

        // Use the match method to find all occurrences of the pattern in the text
        const courseCodes = text.match(courseCodeRegex);
        
        // // Print the extracted course codes


        for(var j = 0; j < tempCourses.length; j++) {
            if(courseCodes != null) {
       
            for(var k = 0; k < courseCodes.length; k++) {
              
                if(tempCourses[j].data.label.match(courseCodeRegex) != null) { 
                if(tempCourses[j].data.label.match(courseCodeRegex) == courseCodes[k]) {
                    tempEdges.push({
                        id: 'e' + first.toString() + '-' + second.toString(),
                        source: tempCourses[i].id,
                        target: tempCourses[j].id
                    });
                    // console.log(tempCourses[i].data.label + " " + tempCourses[j].data.label)
                    first+=2;
                    second+=2;
                }
            }
            }
        }
            
        }
    }
    id++;
    
    setEdges(tempEdges.reverse());
    setNodes(tempCourses);
}
    useState(() => {
        getDepartments();
        setCourses();}, []);

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
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraAddOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
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
            <Dropdown
        menu={{
            items,
        }}
        placement="bottomLeft"
      >
        <Button>Choose Major</Button>
      </Dropdown>
          <Flow initialNodes={nodes} initialEdges={edges}/>
          {/* <ReactFlow nodes={nodes} edges={initialEdges} /> */}
        </Content>
        <RequirementsSidebar />
      </Layout>
    </Layout>
    );
}

export default Dashboard;