import { useState, useRef, useEffect } from 'react'; 
import Addtask from './Addtask';

function CalendarContent(props) {

    // This state is used to render/not render a component Addtask which also returns the state update so that it can be deconstructed when neccessary
    const [initialAddTask, setNewTask] = useState(false);
    const [getHourAndDay, setHourAndDay] = useState();

    // Setting the content of table
    const daysAndTimeArray = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const calendarTableHeader = daysAndTimeArray.map((day) => { return <td key={day}>{day}</td> });

    // First element is below Time table header cell and it needs to be empty, hence why the array starts with an empty element
    const datesOfTheWeek = [<td key={0}></td>];

    /* Here I want to add the dates in XX.XX format day-month into the head of the table, I use keys of the delivered array to get the dates*/
    for (let i = 0; i < 7; i++) {
        let contentkeys = props.initialWeek[i].key.split("-");
        datesOfTheWeek.push(<td key={props.initialWeek[i].key}>{contentkeys[2] + "." + contentkeys[1]}</td>);
    }

    const contentrows = [];
    const usedKeys = [props.initialWeek[0].key, props.initialWeek[1].key, props.initialWeek[2].key,
    props.initialWeek[3].key, props.initialWeek[4].key, props.initialWeek[5].key, props.initialWeek[6].key];

    // Here I am creating rows and cells for each day and each hour with special keys
    for (let i = 0; i < 24; i++) { 
        contentrows.push(
            <tr key={i}>
                <td key={""}>{i + ":00"}</td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[0]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[0]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[1]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[1]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[2]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[2]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[3]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[3]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[4]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[4]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[5]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[5]) }}></td>
                <td className="tablecontentdetail" key={i + "-" + usedKeys[6]} onClick={() => { setNewTask(true); setHourAndDay(i + "-" + usedKeys[6]) }}></td>
            </tr>
        );
    }

    // DEV NOTE FINISHED WITH CODE UNTIL THIS POINT
    // state for controlling TaskDetails component
    const [initialTask, setTask] = useState(false);
    const [initialTitle, setTitle] = useState();
    const [initialDescription, setDescription] = useState();
    const [initialCookie, setCookie] = useState();
    const [initialCookieDate, setCookieDate] = useState();

    return (
        <>
            {initialTask === true && <TaskDetails displaytask={setTask} displaytitle={initialTitle} displaydescription={initialDescription}
                displaycookie={initialCookie} cookiedate={initialCookieDate} />}
            {initialAddTask === true && <Addtask setNewTask={setNewTask} getHourAndDay={getHourAndDay} />}
            <div className="tcontent">
                <table className="tablecontent">
                    <thead>
                        <tr>
                            {datesOfTheWeek}
                        </tr>
                        <tr>
                            {calendarTableHeader}
                        </tr>
                    </thead>
                </table>
                <div className="kok">
                    <table id="tablebordercontent">
                        <tbody>
                            {contentrows}
                        </tbody>
                    </table>
                    {localStorage.getItem("Cookies").includes("Task") === true && <DisplayAllTasks usedKeys={usedKeys} displaytask={setTask}
                        displaytitle={setTitle} displaydescription={setDescription} initialcookie={setCookie} cookiedate={setCookieDate} />}
                </div>
            </div>
        </>
    );
};

export default CalendarContent;


function DisplayAllTasks(props) {

    // every cookie ends with _; in order to iterate I have to split them
    const cookieArray = localStorage.getItem("Cookies").split("_;");
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
                <div key={i} id="taskindex" style={taskStyle} onClick={() => {
                    props.displaytask(true); props.displaytitle(splitArray[1]); props.displaydescription(splitArray[6]);
                    props.initialcookie(splitArray[0]); props.cookiedate(splitArray[2]);
                }}>
                    <p>{splitArray[1]}</p>
                </div>)
        };
    };

    return (
        <>
            <div className="Taskdiv">
                {allTasksArray}
            </div>
        </>
    );
};

function TaskDetails(props) {

    const deleteCookie = () => {

        // Cleaning the String =Task?= from "=", because I will use "=" to split the array
        const cleanCookie = props.displaycookie.replace(/["="]/g, "");
        const cookieArray = localStorage.getItem("Cookies").split("=");

        // Getting the index of clicked Cookie to get the corresponding elements positions in all localStorages
        const cookieIndex = cookieArray.indexOf(cleanCookie);
        const replaceCookie = "=" + cookieArray[cookieIndex] + "=" + cookieArray[cookieIndex + 1];
        localStorage.setItem("Cookies", localStorage.getItem("Cookies").replace(replaceCookie, ""));
        localStorage.setItem("TaskDetails", localStorage.getItem("TaskDetails").replace(props.displaytitle + "___" + props.displaydescription + "___", ""));
        localStorage.setItem("Date", localStorage.getItem("Date").replace(props.cookiedate + "___", ""));
    }

    return (
        <>
            <div className="taskdetailsbackground" onClick={() => { props.displaytask(false) }}></div>
            <div className="taskdetails">
                <h2>{props.displaytitle}</h2>
                <hr />
                <p>{props.displaydescription}</p>
                <button onClick={() => { deleteCookie(); props.displaytask(false) }}>Delete this task!</button>
                <button onClick={() => { props.displaytask(false) }}>Hide the details!</button>
            </div>
        </>
    );
};