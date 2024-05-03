import { useState, useRef, useEffect } from 'react'; 
import Addtask from './Addtask';

function CalendarContent(props) {

    // This state is used to render/not render a component Addtask which also returns the state update so that it can be deconstructed when neccessary
    const [initialAddTask, setNewTask] = useState(false);
    const [getHourAndDay, setHourAndDay] = useState();

    // Setting the content of table
    const daysAndTimeArray = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const calendarTableHeader = daysAndTimeArray.map((day) => { return <td key={day}>{day}</td> });

    // First element is below Time table header cell and it needs to be empty, hence why the array starts with an empty element
    const datesOfTheWeek = [<td key={0}></td>];

    // Here I want to add the dates in XX.XX format day-month into the head of the table, I use keys of the delivered array to get the dates
    for (let i = 0; i < 7; i++) {
        let contentkeys = props.initialWeek[i].key.split("-");
        datesOfTheWeek.push(<td key={props.initialWeek[i].key}>{contentkeys[2] + "." + contentkeys[1]}</td>);
    }

    const usedKeys = [props.initialWeek[0].key, props.initialWeek[1].key, props.initialWeek[2].key,
    props.initialWeek[3].key, props.initialWeek[4].key, props.initialWeek[5].key, props.initialWeek[6].key];
    const contentrows = [];

    // Here I am creating rows and cells for each day and each hour with special keys
    for (let i = 0; i < 24; i++) { 
        contentrows.push(
            <tr key={i}>
                <td key={""}>{i + ":00"}</td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[0]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[0]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[1]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[1]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[2]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[2]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[3]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[3]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[4]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[4]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[5]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[5]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[6]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[6]) }}></td>
            </tr>
        );
    }

    // state for controlling TaskDetails component
    const [initialTaskDetails, setTaskDetails] = useState(false);
    const [makeAnotherPlan, setAnotherPlan] = useState();

    return (
        <>
            {initialTaskDetails === true && <TaskDetails setTaskDetails={setTaskDetails} makeAnotherPlan={makeAnotherPlan}/>}
            {initialAddTask === true && <Addtask setNewTask={setNewTask} getHourAndDay={getHourAndDay} />}
            <div className="tcontent">
                <table className="tablecontent">
                    <thead>
                        <tr>
                            {datesOfTheWeek}
                        </tr>
                        <tr>
                            {calendarTableHeader}
                        </tr>
                    </thead>
                </table>
                <div className="kok">
                    <table id="tablebordercontent">
                        <tbody>
                            {contentrows}
                        </tbody>
                    </table>
                    {localStorage.getItem("Date").includes("_") === true && <DisplayAllTasks usedKeys={usedKeys} setTaskDetails={setTaskDetails} setAnotherPlan={setAnotherPlan}/>}
                </div>
            </div>
        </>
    )
}

export default CalendarContent;


function DisplayAllTasks(props) {

    // Retrieving data from storage to be loop through
    const existingTasksArray = JSON.parse(localStorage.getItem("Tasks"));
    const existingDatesArray = localStorage.getItem("Date").split("_");

    const displayedTasksArray = [];
    const existingArrayLength = existingDatesArray.length;

    for (let i = 0; i < existingArrayLength; i++) { 

        // if this props array has the date value, it will create the task
        if (props.usedKeys.includes(existingDatesArray[i])) {

            // find the index of the date in the keys array and display it
            const indexOfDay = props.usedKeys.indexOf(existingDatesArray[i]) + 1;

            // style based on values received from reading the cookie
            const taskStyle = {
                backgroundColor: existingTasksArray[i].colour,
                position: "absolute",
                overflow: "hidden",
                width: 153,
                outline: "1px solid grey",

                // Abs because user can input eg. 9 and 19 (positive result) or 19 and 9 (negative result), +1 is for the result to not be a 0 != 40*0 
                height: 40.7 * Math.abs(existingTasksArray[i].fromHour - existingTasksArray[i].toHour) + 40.7, 

                // Searching for the lower value between these 2 submitted
                top: 126.5 / 23 * existingTasksArray[i].fromHour + "vh",

                // find the index of the date in the keys array and display it
                left: 0 + (indexOfDay * 9.89) - 9.89 + "vw",
            }
            displayedTasksArray.push(
                <div key={i} id="taskindex" style={taskStyle} onClick={() => {
                    props.setTaskDetails(true); props.setAnotherPlan([existingTasksArray[i], i]);
                }}>
                    <p>{existingTasksArray[i].title}</p>
                </div>);
        }
    }

    return (
        <>
            <div className="Taskdiv">
                {displayedTasksArray}
            </div>
        </>
    )
}

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
 
    return (
        <>
            <div className="taskdetailsbackground" onClick={() => { props.setTaskDetails(false) }}></div>
            <div className="taskdetails">
                <h2>{props.makeAnotherPlan[0].title}</h2>
                <hr />
                <p>{props.makeAnotherPlan[0].description}</p>
                <button onClick={() => { deleteTask(); props.setTaskDetails(false) }}>Delete this task!</button>
                <button onClick={() => { props.setTaskDetails(false) }}>Hide the details!</button>
            </div>
        </>
    )
}