import { useState} from "react";

function Addtask(props) {

    // Clicked cell return a key X:00-XXXX-??-??
    const selectedCellArray = props.getHourAndDay.split("-");
    const shiftedHour = selectedCellArray.shift() + ":00";

    // To set the default value for input type date it needs to be in set format, I cannot enter one digit values without zeroes
    selectedCellArray[1].length === 1 && (selectedCellArray[1] = "0" + selectedCellArray[1]);
    selectedCellArray[2].length === 1 && (selectedCellArray[2] = "0" + selectedCellArray[2]);

    // Default value for date input and for manipulation of onChange action by user
    const [initialDayValue, setDayValue] = useState(selectedCellArray.join("-"));

    // Arrays for hours
    const arrayForHoursInTheDay = [];
    const arraySecondForHoursInTheDay = [];

    // Create hours for the first and second select 
    for (let i = 0; i < 24; i++) {
        arrayForHoursInTheDay.push(<option key={"A" + i}>{i + ":00"}</option>);
        arraySecondForHoursInTheDay.push(<option key={"B" + i}>{i + ":00"}</option>);
    }

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

        // Replacing basic colours to a different pallete
        switch (objectForm.colour) {
            case "Red":
                objectForm.colour = "rgb(213, 0, 0)";
                break;
            case "Yellow":
                objectForm.colour = "rgb(246, 191, 38)";
                break;
            case "Green":
                objectForm.colour = "rgb(51, 182, 121)";
                break;
            case "Pink":
                objectForm.colour = "rgb(230, 124, 115)";
                break;
            case "Purple":
                objectForm.colour = "rgb(142, 36, 170)";
                break;
            default: 
                objectForm.colour = "rgb(3, 155, 229)";
        }

        // Check if cookie with the date exists 
        if (localStorage.getItem("Date").includes(objectForm.date + "_")) {

            // get the index and create and array from date to cover the hours
            const existingTaskArray = JSON.parse(localStorage.getItem("Tasks"));
            let newDateArray = localStorage.getItem("Date").split("_");

            let taskFromHour;
            let taskToHour;
            let indexFoundDate;

            // Recursion loop, will end when the searched date is no longer present in the newDateArray 
            for (let i = 10; i !== -1;) {

                // Get index, get corresponding fromHours and toHours values, then shorten the string for it to be tested again
                indexFoundDate = newDateArray.indexOf(objectForm.date);
                taskFromHour = existingTaskArray[indexFoundDate].fromHour;
                taskToHour = existingTaskArray[indexFoundDate].toHour;
                newDateArray = newDateArray.slice(indexFoundDate + 1);

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

    return (
        <>
            <div className="newTaskBackground" onClick={() => { props.setNewTask(false) }}></div>
            <div className="newtask">
                <h3 className="h3newTask">Create a Plan</h3>
                <form onSubmit={addEntryIntoStorage} method="post">
                    <input placeholder="Add title" className="newTaskInput" required name="title" maxLength="20"></input>
                <div>
                    <input type="date"  defaultValue={initialDayValue} onChange={e => setDayValue(e.target.value)} name="date"></input>
                    <select defaultValue={shiftedHour} name="fromHour">
                            {arrayForHoursInTheDay}
                    </select>
                    <select defaultValue={shiftedHour} name="toHour">
                            {arraySecondForHoursInTheDay}
                    </select>
                    <select name="colour">
                        <option>Blue</option>
                        <option>Yellow</option>
                        <option>Green</option>
                        <option>Red</option>
                        <option>Pink</option>
                        <option>Purple</option>
                    </select>
                </div>
                    <br/>
                    <textarea name="description" rows="7" cols="32"></textarea>
                    <br/>
                    <button type="submit">Make a plan!</button>
                </form>
            </div>
        </>
    )
}
export default Addtask


function setTask(objectForm) {

    localStorage.setItem("Date", localStorage.getItem("Date") + objectForm.date + "_");

    // Converting Task Array consisting of objects into an array and storing it locally
    if (localStorage.getItem("Tasks") === "") {
        localStorage.setItem("Tasks", JSON.stringify([objectForm]));
    } else {
        const addObjectIntoStorage = JSON.parse(localStorage.getItem("Tasks"));
        addObjectIntoStorage.push(objectForm);
        localStorage.setItem("Tasks", JSON.stringify(addObjectIntoStorage));
    }
    // Converting properties of an object into an array and storing it locally
    if (localStorage.getItem("TaskDetails") === "") {
        localStorage.setItem("TaskDetails", JSON.stringify([objectForm.title, objectForm.description]));
    } else {
        const addObjectPropsIntoStorage = JSON.parse(localStorage.getItem("TaskDetails"));
        addObjectPropsIntoStorage.push(objectForm.title);
        addObjectPropsIntoStorage.push(objectForm.description);
        localStorage.setItem("TaskDetails", JSON.stringify(addObjectPropsIntoStorage));
    }
}