import { useState } from "react";
import { useRef } from "react"

function Addtask(props) {

    
    const selectedHour = Number(props.gethourandday.slice(0, 2)) - 10;
    const selectedDate = props.gethourandday.slice(2);
    const selectedyear = selectedDate.slice(0, 4);
    const selectedmonth = selectedDate.slice(4, 6);
    let selectedday = selectedDate.slice(6, 8);
    if (selectedday.length == 1) {
        selectedday = "0" + selectedday;
    }
    const selectedByUser = selectedyear + "-" + selectedmonth + "-" + selectedday;

    const editedHour = "" + selectedHour + ":00";

    const [initialDayValue, setDayValue] = useState(selectedByUser);
    const arrayForHoursInTheDay = [];
    let addZerosToHours;

    const createOptionsForHours = () => {
        for (let i = 0; i < 24; i++) {
            arrayForHoursInTheDay.push(<option key={i}>{addZerosToHours = "" + i + ":00"}</option>);
        }
        return arrayForHoursInTheDay
    }

    function addEntryIntoCookie(e) {

        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        setCookie(formJson.title, formJson.date, formJson.hour, formJson.colour, formJson.description, 1);
        props.componentchanger(false)
    }


    return (
        <>
            <div className="newTaskBackground" onClick={() => { props.addtaskbackground(false) }}></div>
            <div className="newtask">
                <form onSubmit={addEntryIntoCookie} method="post">
                    <input placeholder="Add title" required name="title"></input>
                <div>
                    <input type="date" defaultValue={initialDayValue} onChange={e => setDayValue(e.target.value)} name="date"></input>
                    <select defaultValue={editedHour} name="hour">
                        {createOptionsForHours()}
                    </select>
                    <select name="colour">
                        <option>Red</option>
                        <option>Yellow</option>
                        <option>Green</option>
                        <option>Blue</option>
                        <option>Pink</option>
                        <option>Purple</option>
                    </select>
                </div>
                    <textarea name="description"></textarea>
                    <br/>
                    <button type="submit"></button>
                </form>
            </div>
        </>
    )
}
export default Addtask

function setCookie(title, date, hour, colour, description, exdays) {

    //props are name, value for the name, and days which will always be 1 - I want a year long expiration
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expire = "expires=" + d.toDateString();
    const setNewCookie = document.cookie.split(";");
    document.cookie = "title" + setNewCookie.length + "=" + title + "," + date + "," + hour + "," + colour + "," + description + ";" + expire + ";path=/";
    console.log(setNewCookie)
}