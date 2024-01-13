import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import ClassCard from "./ClassCard";
import { Pagination } from 'antd';

import data from './prod-data.json';

function DataParse({ course_code }) {

    const [currentSlide, setCurrentSlide] = useState(0);

    let classComponents = [];
    let [arraything, setArrayThing] = useState([]);
    let [numCourses, setNumCourses] = useState(1);

    useEffect(() => {
        // Call the function once on component mount
        // console.log("fired")
        for (let i = 0; i < data["Report_Entry"].length; i++) {
            // console.log(data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim());
            // console.log(data["Report_Entry"][i] && data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim(), course_code);
            if (data["Report_Entry"][i] && data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim() == course_code.trim() && data["Report_Entry"][i].Instructors !== "") {
                classComponents.push(<ClassCard key={i} index={i} />);
                // console.log("pushed");
            }
        }
        setArrayThing(classComponents);
        setNumCourses(classComponents.length);
        setCurrentSlide(0);
    }, [course_code]);

    useLayoutEffect(() => {
        // Call the function once on component mount
        // console.log("fired")
        for (let i = 0; i < data["Report_Entry"].length; i++) {
            // console.log(data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim());
            // console.log(data["Report_Entry"][i] && data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim(), course_code);
            if (data["Report_Entry"][i] && data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim() == course_code.trim() && data["Report_Entry"][i].Instructors !== "") {
                classComponents.push(<ClassCard key={i} index={i} />);
                // console.log("pushed");
            }
        }
        setArrayThing(classComponents);
        setNumCourses(classComponents.length-1);
    }, [])

    // console.log(arraything);

    return (
        <>
            {arraything[currentSlide]}
            <br></br>
            {arraything.length >= 1 ? (<Pagination simple defaultCurrent={0} defaultPageSize={1} current={currentSlide} total={numCourses} onChange={(page) => setCurrentSlide(page)} />) : (<p> Not Offered Anymore 2023-2024</p>)}
        </>
    );
}

export default DataParse;