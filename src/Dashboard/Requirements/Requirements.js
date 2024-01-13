import { 
    Dropdown, 
    Layout,
    Select    
    }
    from 'antd';
const { Header, Content, Footer, Sider } = Layout;

 const courses = [    
    {
      value: 'cs',
      label: "Computer Science"
    },
    {
      value: 'hua',
      label: "Humanities and Arts"
    },
    {
      key: 'wpe',
      label: "Wellness and Physical Education"
    },
  ];

const switchTree = (value) => {

};

// import RequirementsSidebar from "./Requirements.js";

function RequirementsSidebar() {
    return (
        <Sider style={{ padding: '2rem', 
            }}>
            <div style={{display: "flex", 
                        flexDirection: "column", 
                        gap: "0.5rem",
                        marginBottom: "1rem",}}>
                
                Subject:
                <Select
                    defaultValue="cs"
                    style={{
                        //width: 120,
                        textWrap: "wrap",
                    }}
                    onChange={switchTree}
                    options={courses}
                />
            
            </div>
            <div style={{display: "flex", 
                        flexDirection: "column", 
                        gap: "0.5rem",
                        color: "white",}}>
                Requirements:
                <ul>
                    <li>
                        4000 courses: {0}/5
                    </li>
                    <li>
                        Systems: {0}/1
                    </li>
                </ul>
            </div>
        </Sider>
    )
}

export default RequirementsSidebar;