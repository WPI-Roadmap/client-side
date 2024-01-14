import { useEffect, useState } from "react";
import "./Requirements.css"
import {
    Dropdown,
    Layout,
    Select,
    Progress,
}
    from 'antd';
import RequestUtils from "../../../Utils/RequestUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../Firebase";
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

const CSRequirements = {
    "systems": [
        "CS 3013",
        "CS 4516",
        "CS 4513",
        "CS 4515"
    ],
    "design": [
        "CS 3733",
        "CS 3431",
        "CS 3041",
        "CS 4233"
    ],
    "theory": [
        "CS 3133",
        "CS 4123",
        "CS 4533",
        "CS 4120",
        "CS 4536"
    ],
    "socImps" : [
        "CS 3043",
        "GOV 2314",
        "GOV 2315",
        "IMGD 2000",
        "IMGD 2001",
        "RBE 3100"
    ]
};


const colors = [
    {
        value: "plain",
        label: "Plain"
    },
    {
        value: "level",
        label: "Level"
    },
    {
        value: "tot",
        label: "Total Rating"
    },
    {
        value: "prof",
        label: "Professor Rating"
    },
    {
        value: "course",
        label: "Course Rating"
    },
    {
        value: "area",
        label: "Area"
    },
    {
        value: "diff",
        label: "Difficulty"
    },
]

const depNames = {
    "cs": "Computer Science Department",
    "hua": "Humanities and Arts Department",
    "wpe": "Physical Education and Athletics Department",
    "ss": "Social Science and Policy Studies Department",
    "math": "Mathematical Sciences Department",
    // need iqp, mqp, fe, sci
}


function RequirementsSidebar({changeDepartment, changeColorSchema, className="", userCourses}) {
    let [user, loading] = useAuthState(auth);

    let [subject, setSubject] = useState('cs');

    // CS Req array
    let [csReqs, setCSReqs] = useState([0,0,0,0,0]);
    let [huaReqs, setHUAReqs] = useState([0,0,0,0]);
    let [wpeReqs, setWPEReqs] = useState([0]);
    let [ssReqs, setSSReqs] = useState([0]);
    let [iqpReqs, setIQPReqs] = useState([0]);
    let [mqpReqs, setMQPReqs] = useState([0]);
    let [mathReqs, setMathReqs] = useState([0,0,0]);
    let [feReqs, setFEReqs] = useState([0]);
    let [sciReqs, setSciReqs] = useState([0,0]);
    
    function addReq() {
        let temp = csReqs;
        for(let i = 0; i < userCourses.length; i++) {
            const courseNum = userCourses[i].courseCode.match(/\d+/)[0];
            if(courseNum.length === 4 && courseNum.substring(0, 1) === "4") {
                temp[0] += 1;
            }
            if(CSRequirements["systems"].includes(userCourses[i].courseCode)) {
                temp[1] += 1;
            }
            if(CSRequirements["design"].includes(userCourses[i].courseCode)) {
                temp[2] += 1;
            }
            if(CSRequirements["theory"].includes(userCourses[i].courseCode)) {
                temp[3] += 1;
            } 
            if(CSRequirements["socImps"].includes(userCourses[i].courseCode)) {
                temp[4] += 1;
            } 
        }
        setCSReqs(temp);
    }
    
    const getAllRequirements = () => { return {
    'cs': [
        {
            label: "4000-Level Courses",
            needed: 5,
            filled: csReqs[0],
        },
        {
            label: "Systems",
            needed: 1,
            filled: csReqs[1],
        },
        {
            label: "Design",
            needed: 1,
            filled: csReqs[2],
        },
        {
            label: "Theory",
            needed: 5,
            filled: csReqs[3],
        },
        {
            label: "Social",
            needed: 1,
            filled: csReqs[4],
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
            label: "General Math",
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
}};
    let allRequirements = getAllRequirements();

    const [requirements, setRequirements] = useState(allRequirements['cs'])

    function getAllCourses() {
        // RequestUtils.get("/retrieve?id=" + user.uid).then((response) => response.json())
        // .then((data) => {
        //     console.log("Test")
        //     let courses = data.data.courses;
        //     if(courses == undefined) {
        //         courses = [];
        //     }
        //     let temp = [];
        //     for(let i = 0; i < courses.length; i++) {
        //         console.log(courses[i]);
        //         temp.push(courses[i].courseCode);
        //     }
        //     console.log(temp);
        // });
    }

    useEffect(() => {
        if(user) {
            addReq();
            allRequirements = getAllRequirements()
            setRequirements(allRequirements[subject])
            console.log(requirements);
        }

    }, [subject, userCourses]);



    return (
        <Sider className={className} style={{ paddingTop: '0.5rem', paddingLeft: '1.8rem', paddingRight: '1.8rem', color: "white", }}
            width="auto">
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1.5rem",
            }}>

                <h2 style={{ marginTop: 5, marginBottom: 5 }}>Subject</h2>
                <Select
                    defaultValue="cs"
                    style={{
                        height: "auto",
                        width: "12em",
                    }}
                    onChange={(value) => {
                        changeDepartment(depNames[value]);
                        setSubject(value);
                    }}
                    options={courses}
                    className="course-select"
                />

            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1.5rem",
            }}>
                <h2 style={{ marginTop: 5, marginBottom: 5 }}>Color Schema</h2>
                <Select
                    defaultValue="tot"
                    style={{
                        height: "auto",
                        width: "12em",
                    }}
                    onChange={(value) => {
                        changeColorSchema(value)
                    }}
                    options={colors}
                    className="color-select"
                />
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
            }}>
                <h2 style={{ marginTop: 5, marginBottom: 5 }}>Requirements</h2>

                <ul className="req-courses" style={{ marginLeft: 5 }}>
                    {requirements.map((req) => {
                        return <li>
                            {req.label}
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