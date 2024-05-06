import React from 'react';

function TaskDetails(props) {

    const deleteTask = () => {

        // Removing clicked task by using the index passed in props
        const existingTasksArray = JSON.parse(localStorage.getItem("Tasks"));
        existingTasksArray.splice(props.makeAnotherPlan[1], 1);
        localStorage.setItem("Tasks", JSON.stringify(existingTasksArray));

        // Same as above, but no convertion to JSON needed
        const existingDatesArray = localStorage.getItem("Date").split("_");
        existingDatesArray.splice(props.makeAnotherPlan[1], 1);
        localStorage.setItem("Date", existingDatesArray.join("_"));

        // For every 1 element in existingTasksArray there are 2 in existingTaskDetailsArray - hence (say props is 0), 0 * 2 = 0, and 0 * 2 + 1 = 1, so splice(0,1)
        const existingTaskDetailsArray = JSON.parse(localStorage.getItem("TaskDetails"));
        existingTaskDetailsArray.splice(props.makeAnotherPlan[1] * 2, 2);
        localStorage.setItem("TaskDetails", JSON.stringify(existingTaskDetailsArray));
    }
    const temp = props.makeAnotherPlan[0].date.split("-");
    return (
        <>
            <div className="task-details_background" onClick={() => { props.setTaskDetails(false) }}></div>
            <div className="task-details_div">
                <button className="task-details_cancel" onClick={() => { props.setTaskDetails(false) }}>X</button>
                <div className="task-details_header">
                    <h1>{temp[2] + "." + temp[1]}</h1>
                    <h3>{props.makeAnotherPlan[0].title}</h3>
                </div>
                <div className="task-details_header">
                    <h4>Time: {props.makeAnotherPlan[0].fromHour + ":00" + " - " + props.makeAnotherPlan[0].toHour + ":00"}</h4>
                </div>
                <div className="task-details_description_div">
                    <p>Description:</p>
                    <hr />
                    <p>{props.makeAnotherPlan[0].description}</p>
                </div>
                <hr />

                <div className="task-details_bottom">
                    <button className="task-details_buttons" onClick={() => { deleteTask(); props.setTaskDetails(false) }}>Delete this task!</button>
                    <button className="task-details_buttons" onClick={() => { props.setTaskDetails(false) }}>Hide the details!</button>
                </div>
            </div>
        </>
    )
}
export default TaskDetails;