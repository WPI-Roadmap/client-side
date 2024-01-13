// dataProcessor.js

async function processData(data) {
    try {
        // Specify the keys to retain
        const keysToRetain = [
            "Course_Title",
            "Subject",
            "Instructors",
            "Academic_Level",
            "Course_Section_Start_Date",
            "Section_Status",
            "Delivery_Mode",
            "Credits",
            "Section_Details",
            "Enrolled_Capacity",
            "Meeting_Day_Patterns",
            "Course_Section_End_Date"
        ];

        // Process the data to retain only specified keys
        const processedData = {
            "Entries": data.Entries.map(entry => {
                const processedEntry = {};
                keysToRetain.forEach(key => {
                    if (entry[key] !== undefined) {
                        processedEntry[key] = entry[key];
                    }
                });
                return processedEntry;
            })
        };

        console.log("processedData: ", processedData);
        console.log(JSON.stringify(processedData, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

export default processData;
