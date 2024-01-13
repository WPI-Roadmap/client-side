import { useState } from "react";
import { useNavigate } from "react-router";
import data from './prod-data.json';


const SingleClass = ({ index }) => {
    //console.log(data["Report_Entry"][index]);

    const getCourseDescription = (inputString) => {
        const endIndex = inputString.toLowerCase().indexOf("recommended background");
        const firstString = inputString.slice(0, endIndex);
        const lastString = inputString.slice(endIndex,)
        return [firstString, lastString];
    }

    return (
        <>
            <h1>Class Code: {data["Report_Entry"][index]["Course_Title"].slice(0, 8)}</h1>
            <h1>Class Name: {data["Report_Entry"][index]["Course_Title"].slice(10,)}</h1>
            <h2>Professor: {data["Report_Entry"][index]["Instructors"] ? data["Report_Entry"][index]["Instructors"] : "None Assigned"}</h2>
            <h3>When: {data["Report_Entry"][index]["Offering_Period"]}</h3>

            <p>Description: {getCourseDescription(data["Report_Entry"][index]["Course_Description"].replace(/<\/?[^>]+(>|$)/g, " "))[0]}</p>
            <p>{getCourseDescription(data["Report_Entry"][index]["Course_Description"].replace(/<\/?[^>]+(>|$)/g, " "))[1]}</p>
        </>
    );

}
function DataParse({ index }) {

    const classComponents = [];

    // Loop through indices 450 to 500
    for (let i = 450; i <= 500; i++) {
        if (data["Report_Entry"][i]["Instructional_Format"] === "Laboratory") {
            continue;
        }
        classComponents.push(<SingleClass key={i} index={i} />);
    }

    return (
        <>
            {classComponents}
        </>
    );
}

export default DataParse;