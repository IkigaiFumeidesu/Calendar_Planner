import { useState, useEffect, useRef } from 'react'; 
import DisplayAllTasks from './WeekComponents/DisplayAllTasks';
import TaskDetails from './WeekComponents/TaskDetails';
import AddTask from './AddTask';
function WeekContent(props) {

    // This state is used to render/not render a component Addtask which also returns the state update so that it can be deconstructed when neccessary
    const [initialAddTask, setNewTask] = useState(false);
    const [getHourAndDay, setHourAndDay] = useState();

    // Setting the content of table
    const daysAndTimeArray = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const calendarTableHeader = daysAndTimeArray.map((day) => { return <td key={day}>{day}</td> });

    // First element is below Time table header cell and it needs to be empty, hence why the array starts with an empty element
    const datesOfTheWeek = [<td key={-1}>Time</td>];

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
                <td className="week-content_cells_td" key={i + "-" + usedKeys[0]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[0]) }}></td>
                <td className="week-content_cells_td" key={i + "-" + usedKeys[1]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[1]) }}></td>
                <td className="week-content_cells_td" key={i + "-" + usedKeys[2]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[2]) }}></td>
                <td className="week-content_cells_td" key={i + "-" + usedKeys[3]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[3]) }}></td>
                <td className="week-content_cells_td" key={i + "-" + usedKeys[4]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[4]) }}></td>
                <td className="week-content_cells_td" key={i + "-" + usedKeys[5]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[5]) }}></td>
                <td className="week-content_cells_td" key={i + "-" + usedKeys[6]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[6]) }}></td>
            </tr>
        );
    }
    // State to get the size of an element before updating the state
    const [initialState, setNewComponent] = useState(false);
    const contentCellSize = useRef("");
    useEffect(() => {
        contentCellSize.current = document.querySelector(".week-content_cells_td").getBoundingClientRect();
        setNewComponent(true)
    }, []);

    // state for controlling TaskDetails component
    const [initialTaskDetails, setTaskDetails] = useState(false);
    const [makeAnotherPlan, setAnotherPlan] = useState();

    return (
        <>
            {initialTaskDetails === true && <TaskDetails setTaskDetails={setTaskDetails} makeAnotherPlan={makeAnotherPlan}/>}
            {initialAddTask === true && <AddTask setNewTask={setNewTask} getHourAndDay={getHourAndDay} />}
            <div className="week-content">
                <table className="week-content_header_table">
                    <thead>
                        <tr>
                            {calendarTableHeader}
                        </tr>
                        <tr>
                            {datesOfTheWeek}
                        </tr>
                        <tr id="week-content_header_holiday">
                        </tr>
                    </thead>
                </table>
                <div className="week-content_cells_div">
                    <table id="week-content_cells_table">
                        <tbody>
                            {contentrows}
                        </tbody>
                    </table>
                    {(initialState === true && localStorage.getItem("Date").includes("_") === true) &&
                        <DisplayAllTasks usedKeys={usedKeys} setTaskDetails={setTaskDetails} setAnotherPlan={setAnotherPlan} contentCellSize={contentCellSize.current} />}
                </div>
            </div>
        </>
    )
}
export default WeekContent;