import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Progress } from 'antd';
import { CodeOutlined, PlusSquareOutlined, InfoCircleOutlined } from '@ant-design/icons';

import data from './prod-data.json';
import profRatings from './ProfessorRating.json';
import classRatings from './CourseRatings.json';
import './ClassCard.css';

const ClassCard = ({ index }) => {

    const courseCode = data["Report_Entry"][index]["Course_Title"].slice(0, data["Report_Entry"][index]["Course_Title"].indexOf(" - ")).trim();
    const professor = data["Report_Entry"][index]["Instructors"] ? data["Report_Entry"][index]["Instructors"] : "";
    const [OSCARatings, setOscarRatings] = useState([0, 0, 0]);
    //console.log(data["Report_Entry"][index]);

    const getCourseDescription = (inputString) => {
        const endIndex = inputString.toLowerCase().indexOf("recommended background");
        const firstString = inputString.slice(0, endIndex);
        const lastString = inputString.slice(endIndex,)
        return [firstString, lastString];
    }

    const getOSCARRatings = () => {
        // const temp = [Math.round(Math.random() * 100), Math.round(Math.random() * 100), 0];
        // temp[2] = 0.6 * temp[0] + 0.4 * temp[1];
        // return temp;
        const courseRating = classRatings[courseCode] ? classRatings[courseCode] : Math.round(Math.random() * 100);
        const profRating = profRatings[professor] ? profRatings[professor] : Math.round(Math.random() * 100);
        const projRating = 0.6 * profRating + 0.4 * courseRating;

        return [profRating, courseRating, projRating]
    }

    useEffect(() => {
        setOscarRatings(getOSCARRatings());
    }, []);


    return (
        <>

            <Card
                size="small"
                title={data["Report_Entry"][index]["Course_Title"].slice(10,).trim()}
                // + " (" + data["Report_Entry"][index]["Course_Title"].slice(0, 8).trim() + ")"
                extra={<CodeOutlined style={{ color: "white" }} />}
                actions={[<a href="#">{<PlusSquareOutlined />}</a>, <a href="https://courselistings.wpi.edu" target="_blank">{<InfoCircleOutlined />}</a>]}
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
                    width: 300,
                }}
            >
                <p><b>Professor: {data["Report_Entry"][index]["Instructors"] ? data["Report_Entry"][index]["Instructors"] : "None Assigned"}</b></p>
                <p><b>{data["Report_Entry"][index]["Offering_Period"]}</b></p>
                {/* <p>{getCourseDescription(data["Report_Entry"][index]["Course_Description"].replace(/<\/?[^>]+(>|$)/g, " "))[0]}</p> */}
                {/* <p>{getCourseDescription(data["Report_Entry"][index]["Course_Description"].replace(/<\/?[^>]+(>|$)/g, " "))[1]}</p> */}

                {data["Report_Entry"][index]["Instructors"] !== "" && (
                    <div>
                        <p className="less-margin"><i>Professor Rating</i></p>
                        <Progress percent={OSCARatings[0]} format={(percent) => (Math.round(percent / 2) / 10) + "/5"} status="active" strokeColor="#716868" />
                        <p className="less-margin"><i>Class Rating</i></p>
                        <Progress percent={OSCARatings[1]} format={(percent) => (Math.round(percent / 2) / 10) + "/5"} status="active" strokeColor="#716868" />
                        <p className="less-margin"><i>Projected Rating</i></p>
                        <Progress percent={OSCARatings[2]} format={(percent) => (Math.round(percent / 2) / 10) + "/5"} status="active" strokeColor="#716868" />
                    </div>)}
            </Card >
        </>
    );

}

export default ClassCard;