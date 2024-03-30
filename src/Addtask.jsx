import { useState } from "react";
import { useRef } from "react"

function Addtask(props) {

    // Chopping the key of clicked table cell to match the input format for date 
    const selectedHour = Number(props.gethourandday.slice(0, 2)) - 10;
    const selectedDate = props.gethourandday.slice(2);
    const selectedyear = selectedDate.slice(0, 4);
    const selectedmonth = selectedDate.slice(4, 6);
    let selectedday = selectedDate.slice(6, 8);
    if (selectedday.length == 1) {
        selectedday = "0" + selectedday;
    }
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
        }
        return arrayForHoursInTheDay
    }
    // Create hours for the second select
    const createSecondOptionsForHours = () => {
        for (let i = 0; i < 24; i++) {
            arraySecondForHoursInTheDay.push(<option key={"A" +i}>{"" + i + ":00"}</option>);
        }
        return arraySecondForHoursInTheDay
    }

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

        // omitting ":00"
        let fromHourReplaced = Number(formJson.fromHour.replace(":00", ""));
        let toHourReplaced = Number(formJson.toHour.replace(":00", ""));

        // sorting hours in order
        let lowerHour = (fromHourReplaced < toHourReplaced) ? fromHourReplaced : toHourReplaced;
        let higherHour = (toHourReplaced < fromHourReplaced) ? fromHourReplaced : toHourReplaced;
        console.log(lowerHour)
        console.log(higherHour)
        // Check if cookie with the date exists 
        if (document.cookie.includes(cleanString)) {

            // get the index and create and array from date to cover the hours
            const indexOfDate = document.cookie.indexOf(cleanString) + 11;
            const extractHours = document.cookie.slice(indexOfDate, indexOfDate + 10).split("___");

            /* check algorithm for edge cases in case a user tries to create a task within a range of hours in contrary to an existing task: 
            1. searches for numbers lower than the start of set task and at the same searches for higher numbers than the start of set task
            2. searches for numbers lower than the end of our set task and at the same time searches for higher numbers than the end of set task
            3. searches for numbers within the set task
            */
            if ((lowerHour <= Number(extractHours[0]) && Number(extractHours[0]) <= higherHour) || 
                (lowerHour <= Number(extractHours[1]) && Number(extractHours[1]) <= higherHour) ||
                (lowerHour >= Number(extractHours[0]) && higherHour <= Number(extractHours[1]))
            ) {
                alert("You cannot assign a task over an existing task")
            } else {
                setCookie(formJson.title, cleanString, lowerHour, higherHour, formJson.colour, formJson.description, 1);
                props.componentchanger(false)
            }
        } else {
            setCookie(formJson.title, cleanString, lowerHour, higherHour, formJson.colour, formJson.description, 1);
            props.componentchanger(false)
        }
    }

    return (
        <>
            <div className="newTaskBackground" onClick={() => { props.addtaskbackground(false) }}></div>
            <div className="newtask">
                <form onSubmit={addEntryIntoCookie} method="post">
                    <input placeholder="Add title" required name="title" maxLength="20"></input>
                <div>
                    <input type="date" defaultValue={initialDayValue} onChange={e => setDayValue(e.target.value)} name="date"></input>
                    <select defaultValue={editedHour} name="fromHour">
                        {createOptionsForHours()}
                    </select>
                    <select defaultValue={editedHour} name="toHour">
                        {createSecondOptionsForHours()}
                    </select>
                    <select name="colour">
                        <option>red</option>
                        <option>yellow</option>
                        <option>green</option>
                        <option>blue</option>
                        <option>pink</option>
                        <option>purple</option>
                    </select>
                </div>
                    <textarea name="description"></textarea>
                    <br/>
                    <button type="submit">Make a plan!</button>
                </form>
            </div>
        </>
    )
}
export default Addtask

function setCookie(title, date, fromHour, toHour, colour, description, exdays) {

    //props are name, value for the name, and days which will always be 1 - I want a year long expiration
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expire = "expires=" + d.toDateString();

    // At first there are no cookies, so I cant split because that the length would be 1, 
    const setNewCookie = (document.cookie.at(0) == undefined) ? document.cookie : document.cookie.split("_;");
    document.cookie =
        "Task" + setNewCookie.length + "=" + "___" + title + "___" + date + "___" + fromHour + "___" +
    toHour + "___" + colour + "___" + description + "_;" + expire + ";path=/";
}