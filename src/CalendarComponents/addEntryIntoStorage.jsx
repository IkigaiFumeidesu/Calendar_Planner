import setTask from "./setTask";

function addEntryIntoStorage(changeColour, submittedForm, setNewTask) {

    // Gathering data from entries and pushing it into an object
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
    objectForm.colour = changeColour;

    if (localStorage.getItem("Date").includes(objectForm.date + "_")) {

        // get the index and create and array from date to cover the hours
        const existingTaskArray = JSON.parse(localStorage.getItem("Tasks"));
        const newDateArray = localStorage.getItem("Date").split("_");

        // Recursion loop, will end when the searched date is no longer present in the newDateArray 
        for (let i = 10; i !== -1;) {

            // Get index, get corresponding fromHours and toHours values, then shorten the string for it to be tested again
            const indexFoundDate = newDateArray.indexOf(objectForm.date);
            const taskFromHour = existingTaskArray[indexFoundDate].fromHour;
            const taskToHour = existingTaskArray[indexFoundDate].toHour;
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
                setNewTask(false);
                return
            }
        }
    } else {
        setTask(objectForm);
        setNewTask(false);
        return
    }
}
export default addEntryIntoStorage