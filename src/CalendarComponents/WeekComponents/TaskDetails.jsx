import React from 'react';
import deleteTask from './deleteTask';
function TaskDetails(props) {

    const HourToAndFrom = props.makeAnotherPlan[0].date.split("-");
    return (
        <>
            <div className="task-details_background" onClick={() => { props.setTaskDetails(false) }}></div>
            <div className="task-details_div">
                <button className="task-details_cancel" onClick={() => { props.setTaskDetails(false) }}>X</button>
                <div className="task-details_header">
                    <h1>{HourToAndFrom[2] + "." + HourToAndFrom[1]}</h1>
                    <h3>{props.makeAnotherPlan[0].title}</h3>
                </div>
                <div className="task-details_header">
                    <h4>Time: {props.makeAnotherPlan[0].fromHour + ":00" + " - " + (props.makeAnotherPlan[0].toHour + 1) + ":00"}</h4>
                </div>
                <div className="task-details_description_div">
                    <p>Description:</p>
                    <hr />
                    <p>{props.makeAnotherPlan[0].description}</p>
                </div>
                <hr />

                <div className="task-details_bottom">
                    <button className="task-details_buttons" onClick={() => { deleteTask(props.makeAnotherPlan); props.setTaskDetails(false) }}>Delete this task!</button>
                    <button className="task-details_buttons" onClick={() => { props.setTaskDetails(false) }}>Hide the details!</button>
                </div>
            </div>
        </>
    )
}
export default TaskDetails;