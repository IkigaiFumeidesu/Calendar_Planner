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
export default setTask;