import React, { useDebugValue } from 'react';
import { useState, useRef, useEffect } from 'react'; 
import Addtask from './Addtask';

function CalendarContent(props) {

    // This state is used to render/not render a component Addtask which also returns the state update so that it can be destructed when neccessary
    const [initialaddtask, setNewTask] = useState(false);
    const [gethourandday, setHourandDay] = useState();

    // Setting the content of table
    const days1 = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weekdays1 = days1.map((day) => { return <td key={day}>{day}</td> });
    const datesofweekdays = [<td key={0}></td>];
    let contentrows = [];
    let contentkeys;
    let hours = 0;

    /* Here I want to add the dates in XX.XX format day-month into the head of the table, 
    I use keys of the delivered array to slice them and revert them to get the individual dates of each day*/
    for (let zz = 0; zz < props.daterow.length; zz++) {
        contentkeys = props.daterow[zz].key.slice(4);
        if (contentkeys[0] == "0") {
            contentkeys = contentkeys.slice(1);
            if (contentkeys.length == 2) {
                contentkeys = contentkeys[1] + "." + contentkeys[0];
            } else {
                contentkeys = contentkeys[1] + contentkeys[2] + "." + contentkeys[0];
            }
        } else {
            if (contentkeys.length == 3) {
                contentkeys = contentkeys[2] + "." + contentkeys[0] + contentkeys[1];
            } else {
                contentkeys = contentkeys[2] + contentkeys[3] + "." + contentkeys[0] + contentkeys[1];
            }
        }
        datesofweekdays.push(<td key={props.daterow[zz].key}>{contentkeys}</td>)
    }

    // Here I am creating rows and cells for each day and each hour with special keys
    for (let p = 10; p < 34; p++) { // So I want to create keys here in a special way so that I can use them later on
        let displayhours = hours + ":00";
        let day0 = "";
        let day1 = p + props.daterow[0].key;
        let day2 = p + props.daterow[1].key;
        let day3 = p + props.daterow[2].key;
        let day4 = p + props.daterow[3].key;
        let day5 = p + props.daterow[4].key;
        let day6 = p + props.daterow[5].key;
        let day7 = p + props.daterow[6].key;
        contentrows.push(
            <tr key={p}>
                <td key={day0}>{displayhours}</td>
                <td key={day1} onClick={() => { setNewTask(true); setHourandDay(day1) }}></td>
                <td key={day2} onClick={() => { setNewTask(true); setHourandDay(day2) }}></td>
                <td key={day3} onClick={() => { setNewTask(true); setHourandDay(day3) }}></td>
                <td key={day4} onClick={() => { setNewTask(true); setHourandDay(day4) }}></td>
                <td key={day5} onClick={() => { setNewTask(true); setHourandDay(day5) }}></td>
                <td key={day6} onClick={() => { setNewTask(true); setHourandDay(day6) }}></td>
                <td key={day7} onClick={() => { setNewTask(true); setHourandDay(day7) }}></td>
            </tr>
        )
        hours++
    }

    // Getting all the currently used keys in the week
    const usedKeys = [];
    for (let i = 0; i < 7; i++) {
        usedKeys.push(props.daterow[i].key);
    }

    // state for controlling TaskDetails component
    const [initialTask, setTask] = useState(false);
    const [initialTitle, setTitle] = useState();
    const [initialDescription, setDescription] = useState();
    const [initialCookie, setCookie] = useState();

    //const idkwhat = [contentrows]
    //console.log(contentrows[0])
    console.log(initialCookie)
    console.log(document.cookie)
    return (
        <>
            {initialTask == true && <TaskDetails displaytask={setTask} displaytitle={initialTitle} displaydescription={initialDescription} displaycookie={initialCookie} />}
            {initialaddtask == true && <Addtask componentchanger={setNewTask} gethourandday={gethourandday} addtaskbackground={setNewTask} />}
            <div className="tcontent">
            <table className="tablecontent">
                <thead>
                    <tr>
                        {datesofweekdays}
                    </tr>
                    <tr>
                        {weekdays1}
                    </tr>
                </thead>
            </table>
            <div className="kok">
                    <table id="tablebordercontent">
                        <tbody>
                    {contentrows }
                        </tbody>
                    </table>
                    {document.cookie.includes("Task") == true && <DisplayAllTasks usedKeys={usedKeys} displaytask={setTask}
                        displaytitle={setTitle} displaydescription={setDescription} initialcookie={setCookie} />}
                </div>
            </div>
        </>
    )
}

export default CalendarContent;


function DisplayAllTasks(props) {
    console.log(document.cookie)
    // every cookie ends with _; in order to iterate I have to split them
    const cookieArray = document.cookie.split("_;");
    const allTasksArray = [];
    for (let i = 0; i < cookieArray.length; i++) {

        // each cookie gets then again split into another array so that I can compare its date value with a passing array of keys (props)
        const splitArray = cookieArray[i].toString().split("___");

        // if this props array has the date value, it will create the task
        if (props.usedKeys.includes(splitArray[2])) {

            // elements of an array to be converted from string to number
            const firstHourInput = Number(splitArray[3]);
            const secondHourInput = Number(splitArray[4]);

            // find the index of the date in the keys array and display it
            const indexofDay = props.usedKeys.indexOf(splitArray[2]) + 1;

            // style based on values received from reading the cookie
            const taskStyle = {
                backgroundColor: splitArray[5],
                position: "absolute",
                overflow: "hidden",
                width: 153,
                outline: "1px solid grey",

                // Abs because user can input eg. 9 and 19 (positive result) or 19 and 9 (negative result), +1 is for the result to not be a 0 != 40*0 
                height: 40.7 * Math.abs(firstHourInput - secondHourInput) + 40.7, 

                // Searching for the lower value between these 2 submitted
                top: 126.5 / 23 * firstHourInput + "vh",

                // find the index of the date in the keys array and display it
                left: 0 + (indexofDay * 9.89) - 9.89 + "vw",
            };
            allTasksArray.push(
                <div key={i} style={taskStyle} onClick={() => { props.displaytask(true); props.displaytitle(splitArray[1]); props.displaydescription(splitArray[6]);props.initialcookie(splitArray[0]) }}>
                    <p>{splitArray[1]}</p>
                </div>)
        }
    }

    return (
        <>
            <div className="Taskdiv">
                {allTasksArray}
            </div>
        </>
    )
}

function TaskDetails(props) {

    const deleteCookie = () => {


        document.cookie = "" + props.displaycookie + ";" + "expires=Thu, 01 Jan 1970 00:00:00 UTC; path =/;";
    }

    return (
        <>
            <div className="taskdetailsbackground" onClick={() => {props.displaytask(false) } }></div>
            <div className="taskdetails">
                <h2>{props.displaytitle}</h2>
                <hr/>
                <p>{props.displaydescription}</p>
                <button onClick={() => { deleteCookie(); props.displaytask(false) }}>Delete this task!</button>
                <button onClick={() => { props.displaytask(false) }}>Hide the details!</button>
            </div>
        </>
    )
} 