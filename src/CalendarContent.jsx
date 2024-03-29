import React from 'react';
import { useState } from 'react'; 
import Addtask from './Addtask';

function CalendarContent(props) {

    // This state is used to render/not render a component Addtask which also returns the state update so that it can be destructed when neccessary

    const [initialaddtask, setNewTask] = useState(false);
    const [gethourandday, setHourandDay] = useState();

    // Setting the content of table

    const days1 = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weekdays1 = days1.map((day) => { return <td key={day}>{day}</td> });
    let contentrows = [];
    const datesofweekdays = [<td key={0}></td>];
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

    for (let p = 10; p < 34; p++) { // So I want to create keys here in a special way so that I can use them later on, its ugly tho I am ngl
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
    console.log(props.daterow)
    if (document.cookie.includes("title")) {
        
    }

    return (
        <>
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
                <tbody >
                    {contentrows }
                </tbody>
            </table>
                </div>
            </div>
        </>
    )
}

export default CalendarContent;