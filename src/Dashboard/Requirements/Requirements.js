import "./Requirements.css"
import { 
    Dropdown, 
    Layout,
    Select,
    Progress  
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
      value: 'wpe',
      label: "Wellness and PE"
    },
    {
        value: 'ss',
        label: "Social Science"
    },
    {
        value: 'iqp',
        label: "IQP"
    },
    {
        value: 'fe',
        label: "Free Electives"
    },
    {
        value: 'math',
        label: "Mathematics"
    },
    {
        value: 'sci',
        label: "Science"
    },
  ];

const requirements = [
    {
        label: "4000 Courses",
        needed: 5,
        filled: 3,
    },
    {
        label: "Systems",
        needed: 1,
        filled: 0,
    },
    {
        label: "Design",
        needed: 1,
        filled: 1,
    },
    {
        label: "Theory",
        needed: 5,
        filled: 2,
    },
    {
        label: "Social Implications",
        needed: 1,
        filled: 0,
    },
];


const switchTest = () => {};

function RequirementsSidebar(switchTree) {
    return (
        <Sider style={{ padding: '2rem', color: "white",}} 
               width="auto">
            <div style={{display: "flex", 
                        flexDirection: "column", 
                        gap: "0.5rem",
                        marginBottom: "1.5rem",}}>
                
                <b>Subject:</b>
                <Select
                    defaultValue="wpe"
                    style={{
                        //width: 120,
                    }}
                    // onChange={switchTest}
                    options={courses}
                    className="course-select"
                />
            
            </div>
            <div style={{display: "flex", 
                        flexDirection: "column", 
                        gap: "0.5rem",}}>
                <b>Requirements:</b>
                <ul className="req-courses">
                    {requirements.map((req) => {
                        return <li>
                            <i>{req.label}</i>
                            <br/>
                            <Progress percent={100 * (req.filled / req.needed)}  
                                format={(percent) => req.filled + "/" + req.needed} 
                                style={{width: "100%", color: "white",}}/>
                        </li>
                    
                    })}
                </ul>
            </div>
        </Sider>
    )
}

export default RequirementsSidebar;