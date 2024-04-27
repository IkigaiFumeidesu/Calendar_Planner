import { useState, useContext } from "react";
import { useRef } from "react"

function Addtask(props) {

    // Chopping the key of clicked table cell to match the input format for date 
    const selectedHour = Number(props.getHourAndDay.slice(0, 2)) - 10;
    const selectedDate = props.getHourAndDay.slice(2);
    const selectedyear = selectedDate.slice(0, 4);
    const selectedmonth = selectedDate.slice(4, 6);
    let selectedday = selectedDate.slice(6, 8);
    if (selectedday.length == 1) {
        selectedday = "0" + selectedday;
    };
    const selectedByUser = selectedyear + "-" + selectedmonth + "-" + selectedday;

    // Default values for both selects
    const editedHour = "" + selectedHour + ":00";

    // Default value for date input and for manipulation of onChange action by user
    const [initialDayValue, setDayValue] = useState(selectedByUser);

    // Arrays for hours
    const arrayForHoursInTheDay = [];
    const arraySecondForHoursInTheDay = [];

    // Create hours for the first select 
    const createOptionsForHours = () => {
        for (let i = 0; i < 24; i++) {
            arrayForHoursInTheDay.push(<option key={i}>{"" + i + ":00"}</option>);
        };
        return arrayForHoursInTheDay;
    };
    // Create hours for the second select
    const createSecondOptionsForHours = () => {
        for (let i = 0; i < 24; i++) {
            arraySecondForHoursInTheDay.push(<option key={"A" + i}>{"" + i + ":00"}</option>);
        };
        return arraySecondForHoursInTheDay;
    };

    function addEntryIntoCookie(e) {

        // Preventing the form to refresh on submit
        e.preventDefault();

        // Gathering data from entries and pushing it into an object
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        // replacing "-" from the input format to nothing - I need this to compare it with the keys 
        const replacedString = formJson.date.replace(/-/g, "");

        // days end with 01-09 so I am accounting for it by removing 0
        const cleanString = "" + replacedString.slice(0, 6) + replacedString[6].replace(0, "") + replacedString[7];

        // omitting "_" in the title and description of task, because I need this character for the slicing of a cookie
        const regex = /_/g;
        const title = formJson.title.replace(regex, "");
        if (title == "") {
            alert("Please set a title without special characters");
            return
        };

        let description = formJson.description.replace(regex, "");
        if (description.length == 0) {
            description = " ";
        };

        // omitting ":00"
        const fromHourReplaced = Number(formJson.fromHour.replace(":00", ""));
        const toHourReplaced = Number(formJson.toHour.replace(":00", ""));

        // sorting hours in order
        const lowerHour = (fromHourReplaced < toHourReplaced) ? fromHourReplaced : toHourReplaced;
        const higherHour = (toHourReplaced < fromHourReplaced) ? fromHourReplaced : toHourReplaced;

        // Check if cookie with the date exists 
        if (localStorage.getItem("Cookies").includes(cleanString)) {

            // get the index and create and array from date to cover the hours
            let newCookieString = localStorage.getItem("Cookies");
            let indexOfDate;
            let extractHours;
            let indexOfTwoNumbers;

            // This loops through the cookie string in order to catch every task associated with given date
            for (let i = 10; i !== -1;) {

                // get the first index, then take the part from date - to second hour number, use these hour numbers and then shorten the string and test it again
                indexOfTwoNumbers = newCookieString.indexOf(cleanString);
                indexOfDate = newCookieString.slice(indexOfTwoNumbers, indexOfTwoNumbers + 21);
                extractHours = indexOfDate.split("___");
                newCookieString = newCookieString.slice(indexOfTwoNumbers + 10);

                /* check algorithm for edge cases in case a user tries to create a task within a range of hours in contrary to an existing task: 
                1. searches for numbers lower than the start of set task and at the same searches for higher numbers than the start of set task
                2. searches for numbers lower than the end of our set task and at the same time searches for higher numbers than the end of set task
                3. searches for numbers within the set task
                */
                if ((lowerHour <= Number(extractHours[1]) && Number(extractHours[1]) <= higherHour) ||
                    (lowerHour <= Number(extractHours[2]) && Number(extractHours[2]) <= higherHour) ||
                    (lowerHour >= Number(extractHours[1]) && higherHour <= Number(extractHours[2]))
                ) {
                    alert("You cannot assign a task over an existing task");
                    return
                } else if (newCookieString.includes(cleanString)) {

                } else {
                    localStorage.setItem("Date", localStorage.getItem("Date") + cleanString + "___");
                    localStorage.setItem("TaskDetails", localStorage.getItem("TaskDetails") + title + "___" + description + "___");
                    setCookie(title, cleanString, lowerHour, higherHour, formJson.colour, description);
                    props.componentchanger(false);
                    return
                };
            };
        } else {
            localStorage.setItem("Date", localStorage.getItem("Date") + cleanString + "___");
            localStorage.setItem("TaskDetails", localStorage.getItem("TaskDetails") + title + "___" + description + "___");
            setCookie(title, cleanString, lowerHour, higherHour, formJson.colour, description);
            props.componentchanger(false);
            return

        };
    };

    return (
        <>
            <div className="newTaskBackground" onClick={() => { props.addtaskbackground(false) }}></div>
            <div className="newtask">
                <h3 className="h3newTask">Create a Plan</h3>
                <form onSubmit={addEntryIntoCookie} method="post">
                    <input placeholder="Add title" className="newTaskInput" required name="title" maxLength="20"></input>
                <div>
                    <input type="date"  defaultValue={initialDayValue} onChange={e => setDayValue(e.target.value)} name="date"></input>
                    <select defaultValue={editedHour} name="fromHour">
                        {createOptionsForHours()}
                    </select>
                    <select defaultValue={editedHour} name="toHour">
                        {createSecondOptionsForHours()}
                    </select>
                    <select name="colour">
                        <option>indianred</option>
                        <option>orange</option>
                        <option>lightgreen</option>
                        <option>deepskyblue</option>
                        <option>lightpink</option>
                        <option>mediumpurple</option>
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


function setCookie(title, date, fromHour, toHour, colour, description) {

    // At first there are no cookies, so I cant split because that the length would be 1, 
    const setNewCookie = (localStorage.getItem("Cookies").at(0) == undefined) ? "" : localStorage.getItem("Cookies").split("_;");
    let checkNewCookie = setNewCookie.length;

    // in case a "cookie"" gets deleted, the cookie with checkNewCookie default value would keep rewriting, so I need to up its value
    while (localStorage.getItem("Cookies").includes("=" + "Task" + checkNewCookie)) {
        checkNewCookie++;
    };
    localStorage.setItem("Cookies", localStorage.getItem("Cookies") + "=" + "Task" + checkNewCookie + "=" + "___" + title + "___" + date + "___" + fromHour + "___" +
        toHour + "___" + colour + "___" + description + "_;");
}