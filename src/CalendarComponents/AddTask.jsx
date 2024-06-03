import { useState, useRef, useEffect } from "react";
import setTask from "./setTask";
function AddTask(props) {

    // Clicked cell return a key X:00-XXXX-??-??
    const selectedCellArray = props.getHourAndDay.split("-");
    const shiftedHour = selectedCellArray.shift() + ":00";

    // To set the default value for input type date it needs to be in set format, I cannot enter one digit values without zeroes
    selectedCellArray[1].length === 1 && (selectedCellArray[1] = "0" + selectedCellArray[1]);
    selectedCellArray[2].length === 1 && (selectedCellArray[2] = "0" + selectedCellArray[2]);

    // Default value for date input and for manipulation of onChange action by user
    const [initialDayValue, setDayValue] = useState(selectedCellArray.join("-"));
    const arrayForHoursInTheDay = [];
    const arraySecondForHoursInTheDay = [];

    // Create hours for the first and second select 
    for (let i = 0; i < 24; i++) {
        arrayForHoursInTheDay.push(<option key={"A" + i}>{i + ":00"}</option>);
        arraySecondForHoursInTheDay.push(<option key={"B" + i}>{i + ":00"}</option>);
    }
    // Default and future choice of the user on colour selection
    const changeColour = useRef("rgb(3, 155, 229)");
    const changeElement = useRef("");
    useEffect(() => {
        changeElement.current = document.getElementById("add-task_circle_blue");
    }, []);
    function addEntryIntoStorage(e) {

        // Preventing the form to refresh on submit
        e.preventDefault();

        // Gathering data from entries and pushing it into an object
        const submittedForm = e.target;
        const dataForm = new FormData(submittedForm);
        const objectForm = Object.fromEntries(dataForm.entries());

        // If the user didnt fill out the title OR if they removed "required" from their client side 
        if (objectForm.title === "") {
            alert("Please dont leave the title empty");
            return
        }

        // Getting the date into the same format as used in Calendar.jsx
        objectForm.date[8] === "0" && (objectForm.date = objectForm.date.slice(0, 8) + objectForm.date.slice(9));
        objectForm.date[5] === "0" && (objectForm.date = objectForm.date.slice(0, 5) + objectForm.date.slice(6));

        const fromHourReplaced = Number(objectForm.fromHour.replace(":00", ""));
        const toHourReplaced = Number(objectForm.toHour.replace(":00", ""));

        // sorting hours in order
        objectForm.fromHour = (fromHourReplaced < toHourReplaced) ? fromHourReplaced : toHourReplaced;
        objectForm.toHour = (toHourReplaced < fromHourReplaced) ? fromHourReplaced : toHourReplaced;
        objectForm.colour = changeColour.current;

        // Check if cookie with the date exists 
        if (localStorage.getItem("Date").includes(objectForm.date + "_")) {

            // get the index and create and array from date to cover the hours
            const existingTaskArray = JSON.parse(localStorage.getItem("Tasks"));
            const newDateArray = localStorage.getItem("Date").split("_");
            let taskFromHour;
            let taskToHour;
            let indexFoundDate;

            // Recursion loop, will end when the searched date is no longer present in the newDateArray 
            for (let i = 10; i !== -1;) {

                // Get index, get corresponding fromHours and toHours values, then shorten the string for it to be tested again
                indexFoundDate = newDateArray.indexOf(objectForm.date);
                taskFromHour = existingTaskArray[indexFoundDate].fromHour;
                taskToHour = existingTaskArray[indexFoundDate].toHour;
                newDateArray.splice(0, indexFoundDate + 1);
                existingTaskArray.splice(0, indexFoundDate + 1);
                /* 
                Check algorithm for edge cases in case a user tries to create a task with hours set in a contrary to an existing task: 
                1. Checks if a new task starts out of an existing task BUT ends within it
                2. Checks if a new task ends out of an existing task BUT starts within it 
                3. Checks if a new task starts AND ends within an existing task - 
                */
                if ((objectForm.fromHour <= taskFromHour && taskFromHour <= objectForm.toHour) ||
                    (objectForm.fromHour <= taskToHour && taskToHour <= objectForm.toHour) ||
                    (objectForm.fromHour >= taskFromHour && objectForm.toHour <= taskToHour)
                ) {
                    alert("You cannot assign a task over an existing task");
                    return
                } else if (newDateArray.includes(objectForm.date)) {

                } else {
                    setTask(objectForm);
                    props.setNewTask(false);
                    return
                }
            }
        } else {
            setTask(objectForm);
            props.setNewTask(false);
            return
        }
    }
    function changeSvgStyle(colour, id) {

        // Change the style of the unselected svg
        changeElement.current.setAttribute("r", 9);
        const changePrevious = changeElement.current.style.outlineColor = "transparent";

        // Change the style of newly selected svg
        changeElement.current = document.getElementById(id);
        changeElement.current.setAttribute("r", 10);
        const changeNext = changeElement.current.style.outlineColor = "black";
        changeColour.current = colour;
    }

    return (
        <>
            <div className="add-task_background" onClick={() => { props.setNewTask(false) }}></div>
            <div className="add-task_div">
                <button className="add-task_cancel" onClick={() => { props.setNewTask(false) }}>X</button>
                <h3>Create a Plan</h3>
                <hr/>
                <form onSubmit={addEntryIntoStorage} method="post">
                    <div className="add-task_context">
                        <div>
                            <div>
                                <label htmlFor="add-task_title">&#10067;</label>
                            </div>
                            <input placeholder="Add a title.."  required id="add-task_title" name="title" maxLength="15" autoFocus></input>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="add-task_date">&#128197;</label>
                            </div>
                            <input type="date" id="add-task_date" defaultValue={initialDayValue} onChange={e => setDayValue(e.target.value)} name="date"></input>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="add-task_selects">&#128337;</label>
                            </div>
                            <select defaultValue={shiftedHour} name="fromHour" id="add-task_selects">
                                    {arrayForHoursInTheDay}
                            </select>
                            <p className="add-task_between_selects">-</p>
                            <select defaultValue={shiftedHour} name="toHour" id="add-task_selectss">
                                    {arraySecondForHoursInTheDay}
                            </select>
                        </div>
                        <div className="add-task_colours">
                            <div>
                                <span>&#127912; </span>
                            </div>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(213, 0, 0)", e.target.id) }}
                                        id="add-task_circle_red" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(213, 0, 0)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(246, 191, 38)", e.target.id) }}
                                        id="add-task_circle_yellow" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(246, 191, 38)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(51, 182, 121)", e.target.id) }}
                                        id="add-task_circle_green" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(51, 182, 121)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(3, 155, 229)", e.target.id) }}
                                        id="add-task_circle_blue" cx="0.7vw" cy="2.3vh" r="10" fill="rgb(3, 155, 229)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(230, 124, 115)", e.target.id) }}
                                        id="add-task_circle_pink" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(230, 124, 115)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(142, 36, 170)", e.target.id) }}
                                        id="add-task_circle_purple" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(142, 36, 170)" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="add-task_textarea">
                        <textarea name="description" rows="5" cols="32" placeholder="Describe it.."></textarea>
                        <button type="submit">Submit the plan!</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default AddTask