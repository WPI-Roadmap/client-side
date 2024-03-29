import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ClassCard from "./ClassCard";
import { Pagination } from 'antd';

import data from './prod-data.json';

function DataParse({ course_code, setConfettiOn}) {

    const [currentSlide, setCurrentSlide] = useState(0);

    let classComponents  = [];
    let [arraything, setArrayThing] = useState([]);// [450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460

    useEffect(() => {
        // Call the function once on component mount
        console.log("fired")
        for (let i = 0; i < data["Report_Entry"].length; i++) {
            // console.log(data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim());
            if (data["Report_Entry"][i] && data["Report_Entry"][i]["Course_Title"].slice(0, data["Report_Entry"][i]["Course_Title"].indexOf(" - ")).trim() == course_code.trim() && data["Report_Entry"][i].Instructors != "") {
                classComponents.push(<ClassCard key={i} index={i} setConfettiOn={setConfettiOn} />);
                console.log("pushed");
            }
        }
        setArrayThing(classComponents);
    }, [course_code]);

    console.log(arraything);

    return (
        <>
           {arraything[currentSlide]}
            {/* {classComponents.map((value) => (
                <ClassCard key={value} index={value} />
            ))} */}
            <br></br>
            {arraything.length > 0 && <Pagination simple defaultCurrent={0} defaultPageSize={1} current={currentSlide} total={arraything.length - 1} onChange={(page, pageSize) => setCurrentSlide(page)} />}
        </>
    );
}

export default DataParse;