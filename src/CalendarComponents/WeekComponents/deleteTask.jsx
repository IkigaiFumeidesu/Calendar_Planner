
function deleteTask(makeAnotherPlan) {

    /*
        DEV NOTE
        It would be better to manipulate data stored in database and not store it in localStorage
    */

    // Removing clicked task by using the index passed in props
    const existingTasksArray = JSON.parse(localStorage.getItem("Tasks"));
    existingTasksArray.splice(makeAnotherPlan[1], 1);
    localStorage.setItem("Tasks", JSON.stringify(existingTasksArray));

    // Same as above, but no convertion to JSON needed
    const existingDatesArray = localStorage.getItem("Date").split("_");
    existingDatesArray.splice(makeAnotherPlan[1], 1);
    localStorage.setItem("Date", existingDatesArray.join("_"));

    // For every 1 element in existingTasksArray there are 2 in existingTaskDetailsArray - hence (say props is 0), 0 * 2 = 0, and 0 * 2 + 1 = 1, so splice(0,1)
    const existingTaskDetailsArray = JSON.parse(localStorage.getItem("TaskDetails"));
    existingTaskDetailsArray.splice(makeAnotherPlan[1] * 2, 2);
    localStorage.setItem("TaskDetails", JSON.stringify(existingTaskDetailsArray));
}
export default deleteTask