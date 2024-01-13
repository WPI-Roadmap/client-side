import './index.css';
import { 
    Dropdown, 
    Layout }
    from 'antd';
const { Header, Content, Footer, Sider } = Layout;

 const items = [    
    {
      key: '1',
      label: "Humanities and Arts"
    },
    {
      key: '2',
      label: "Wellness and Physical Education"
    },
    {
      key: '3',
      label: "Social Science"
    },
  ];

// import RequirementsSidebar from "./Requirements.js";

function RequirementsSidebar() {
    return (
        <>
        <Sider style={{
              display: "flex",
              gap: "2rem"
            }}
            width={200}>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                Subject:
                <Dropdown
                    menu={{
                    items,
                    }}
                    placement="bottomLeft"
                ></Dropdown>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                Requirements:
                <ul>
                    <li>
                        4000 courses: {4000}/5
                    </li>
                    <li>
                        Systems: {0}/1
                    </li>
                </ul>
            </div>
        </Sider>
        </>
    )
}

export default RequirementsSidebar;