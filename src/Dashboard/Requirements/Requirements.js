import { useState } from "react";
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

const allRequirements = {
    'cs': [
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
        }
    ],
    'hua': [
        {
            label: "Seminar/Practicum",
            needed: 1,
            filled: 0
        },
        {
            label: "Depth",
            needed: 3,
            filled: 2,
        },
        {
            label: "Breadth",
            needed: 1,
            filled: 1,
        },
        {
            label: "Free Elective",
            needed: 1,
            filled: 0,
        }
    ],
    'wpe': [
        {
            label: "PE Courses",
            needed: 4,
            filled: 2
        }
    ],
    'ss': [
        {
            label: "Social Science Credits",
            needed: 2,
            filled: 1,
        }
    ],
    'iqp': [
        {
            label: 'IQP credits',
            needed: 3,
            filled: 0
        }
    ],
    'mqp': [
        {
            label: 'MQP credits',
            needed: 3,
            filled: 0
        }
    ],
    'math': [
        {
            label: "Probability",
            needed: 1,
            filled: 1
        },
        {
            label: "Statistics",
            needed: 1,
            filled: 1
        },
        {
            label: "Genreal Math",
            needed: 5,
            filled: 4
        },
    ],
    'fe': [
        {
            label: "Free Electives",
            needed: 3,
            filled: 3
        }
    ],
    'sci': [
        {
            label: "Core Sciences",
            needed: 3,
            filled: 3
        },
        {
            label: "Science Electives",
            needed: 2,
            filled: 1
        }
    ]
};



function RequirementsSidebar(switchTree) {

    const [requirements, setRequirements] = useState(allRequirements['cs'])

    const setReqCategory = (category) => {
        setRequirements(allRequirements[category])
    }
    return (
        <Sider style={{ padding: '2rem', color: "white", }}
            width="auto">
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1.5rem",
            }}>

                <b>Subject:</b>
                <Select
                    defaultValue="wpe"
                    style={{
                        height: "auto",
                        width: "12em",
                    }}
                    onChange={(value) => {
                        setReqCategory(value);
                        switchTree();
                    }}
                    options={courses}
                    className="course-select"
                />

            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
            }}>
                <b>Requirements:</b>
                <ul className="req-courses">
                    {requirements.map((req) => {
                        return <li>
                            <i>{req.label}</i>
                            <br />
                            <Progress percent={100 * (req.filled / req.needed)}
                                format={(percent) => req.filled + "/" + req.needed}
                                style={{ width: "100%", color: "white", }} />
                        </li>

                    })}
                </ul>
            </div>
        </Sider>
    )
}

export default RequirementsSidebar;