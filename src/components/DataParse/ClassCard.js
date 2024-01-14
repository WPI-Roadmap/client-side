import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Progress } from 'antd';
import { CodeOutlined, PlusSquareOutlined, InfoCircleOutlined, MinusCircleOutlined, MinusSquareOutlined } from '@ant-design/icons';
import profRatings from './ProfessorRating.json';
import classRatings from './CourseRatings.json';
import { useAuthState } from "react-firebase-hooks/auth";
import data from './prod-data.json';
import './ClassCard.css';
import { auth } from "../../Firebase";
import RequestUtils from "../../Utils/RequestUtils";
import { SelectKeyProvide } from "@ant-design/pro-components";

const ClassCard = ({ index, setConfettiOn }) => {

    let [user, loading] = useAuthState(auth);


    const courseCode = data["Report_Entry"][index]["Course_Title"].slice(0, data["Report_Entry"][index]["Course_Title"].indexOf(" - ")).trim();
    const professor = data["Report_Entry"][index]["Instructors"] ? data["Report_Entry"][index]["Instructors"] : "";
    const [OSCARatings, setOscarRatings] = useState([0, 0, 0]);
    //console.log(data["Report_Entry"][index]);

    let [code, setCode] = useState(0);

    const getCourseDescription = (inputString) => {
        const endIndex = inputString.toLowerCase().indexOf("recommended background");
        const firstString = inputString.slice(0, endIndex);
        const lastString = inputString.slice(endIndex,)
        return [firstString, lastString];
    }

    const getOSCARRatings = () => {
        const courseRating = classRatings[courseCode] ? classRatings[courseCode] : Math.round(Math.random() * 100);
        const profRating = profRatings[professor] ? profRatings[professor] : Math.round(Math.random() * 100);
        const projRating = 0.6 * profRating + 0.4 * courseRating;

        return [profRating, courseRating, projRating]
    }

    function getCurrentCourses() {

        RequestUtils.get("/retrieve?id=" + user.uid).then((response) => response.json())
            .then((data) => {

                let courses = data.data.courses;

                if (courses == undefined) {
                    courses = [];
                }
                for (let i = 0; i < courses.length; i++) {
                    if (courses[i].courseCode == courseCode) {
                        setCode(1);
                    }
                }
            });

    }

    function addCourse() {

        RequestUtils.get("/retrieve?id=" + user.uid).then((response) => response.json())
            .then((data) => {
                let courses = data.data.courses;

                if (courses == undefined) {
                    courses = [];
                }

                courses.push({
                    "courseCode": courseCode,
                    "grade": "N/A",
                    "term": "N/A"
                });

                let reqobj = {
                    "courses": courses
                }

                RequestUtils.post("/add?id=" + user.uid, reqobj).then((response) => {
                    setConfettiOn(true);
                    // alert("Course added!");
                    // window.location.reload();
                });


                // else {
                //     RequestUtils.post("add", user.uid, courseCode).then((response) => {
                //         alert("Course added!");
                //     });
                // }
            });
    }

    function removeCourse() {
        let reqobj = {
            course: courseCode
        }
        RequestUtils.post("/delete?id=" + user.uid, reqobj).then((response) => {
            alert("Course removed!");
            window.location.reload();
        });
    }

    useEffect(() => {
        // Call the function once on component mount
        setOscarRatings(getOSCARRatings());
        getCurrentCourses();
    }, []);


    return (
        <>

            <Card
                size="small"
                title={data["Report_Entry"][index]["Course_Title"].slice(10,).trim()}
                // + " (" + data["Report_Entry"][index]["Course_Title"].slice(0, 8).trim() + ")"
                extra={<CodeOutlined style={{ color: "white" }} />}
                actions={[<a onClick={() =>
                    code == 0 ? addCourse() : removeCourse()}>{code == 0 ? <PlusSquareOutlined /> : <MinusSquareOutlined></MinusSquareOutlined>}</a>, <a href="https://courselistings.wpi.edu" target="_blank">{<InfoCircleOutlined />}</a>]}
                bodyStyle={{
                    padding: 5,
                    lineHeight: 1,
                    margin: 0,
                }}
                headStyle={{
                    fontSize: 15,
                    color: "white",
                    background:
                        "#716868",
                }}
                style={{
                    // width: 300,
                }}
            >
                <div className="mx-3 px-3">
                    <p><b>Professor: {data["Report_Entry"][index]["Instructors"] ? data["Report_Entry"][index]["Instructors"] : "None Assigned"}</b></p>
                    <p><b>{data["Report_Entry"][index]["Offering_Period"]}</b></p>
                    {/* <p>{getCourseDescription(data["Report_Entry"][index]["Course_Description"].replace(/<\/?[^>]+(>|$)/g, " "))[0]}</p> */}
                    {/* <p>{getCourseDescription(data["Report_Entry"][index]["Course_Description"].replace(/<\/?[^>]+(>|$)/g, " "))[1]}</p> */}

                    {data["Report_Entry"][index]["Instructors"] !== "" && (
                        <div className="">
                            <p className="less-margin"><i>Professor Rating</i></p>
                            <Progress percent={OSCARatings[0]} format={(percent) => (Math.round(percent / 2) / 10) + "/5"} status="active" strokeColor="#716868" />
                            <p className="less-margin"><i>Class Rating</i></p>
                            <Progress percent={OSCARatings[1]} format={(percent) => (Math.round(percent / 2) / 10) + "/5"} status="active" strokeColor="#716868" />
                            <p className="less-margin"><i>Projected Rating</i></p>
                            <Progress percent={OSCARatings[2]} format={(percent) => (Math.round(percent / 2) / 10) + "/5"} status="active" strokeColor="#716868" />
                        </div>)}
                </div>
            </Card >
            
        </>
    );

}

export default ClassCard;