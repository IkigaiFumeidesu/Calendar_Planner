import React from 'react';

function DisplayAllTasks(props) {

    // Retrieving data from storage to loop through it
    const existingTasksArray = JSON.parse(localStorage.getItem("Tasks"));
    const existingDatesArray = localStorage.getItem("Date").split("_");
    const displayedTasksArray = [];
    const existingArrayLength = existingDatesArray.length;
    const contentCellObject = props.contentCellSize;

    for (let i = 0; i < existingArrayLength; i++) {

        // If this props array has the date value, it will create the task
        if (props.usedKeys.includes(existingDatesArray[i])) {

            // Find the index of the date in the keys array and display it
            const indexOfDay = props.usedKeys.indexOf(existingDatesArray[i]) + 1;

            // Style based on received values
            const taskStyle = {
                backgroundColor: existingTasksArray[i].colour,
                position: "absolute",
                overflow: "hidden",
                width: contentCellObject.width - 1.6,
                zIndex: 1,
                height: contentCellObject.height * (existingTasksArray[i].toHour - existingTasksArray[i].fromHour) + contentCellObject.height - 0.8,
                top: contentCellObject.height * existingTasksArray[i].fromHour - 0.8,
                right: (7 - indexOfDay) * contentCellObject.width,
                border: "0.1px solid grey"
            }
            displayedTasksArray.push(
                <div key={i} style={taskStyle} onClick={() => {
                    props.setTaskDetails(true); props.setAnotherPlan([existingTasksArray[i], i,]);
                }}>
                    <p>{existingTasksArray[i].title}</p>
                </div>);
        }
    }

    return (
        <>
            <div className="display_all_task_div">
                {displayedTasksArray}
            </div>
        </>
    )
}
export default DisplayAllTasks;