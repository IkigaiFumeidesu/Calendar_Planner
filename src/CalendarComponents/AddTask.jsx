import { useState, useEffect } from "react";
import addEntryIntoStorage from "./addEntryIntoStorage";

function AddTask(props) {

    // Clicked cell return a key X:00-XXXX-??-??
    const selectedCellArray = props.getHourAndDay.split("-");
    const shiftedHour = selectedCellArray.shift() + ":00";

    // To set the default value for input type date it needs to be in set format, I cannot enter one digit values without zeroes
    selectedCellArray[1].length === 1 && (selectedCellArray[1] = "0" + selectedCellArray[1]);
    selectedCellArray[2].length === 1 && (selectedCellArray[2] = "0" + selectedCellArray[2]);

    // Default value for date input and for manipulation of onChange action by user
    const [initialDayValue, setDayValue] = useState(selectedCellArray.join("-"));
    const arrayForHoursInTheDay = [];
    const arraySecondForHoursInTheDay = [];

    // Create hours for the first and second select 
    for (let i = 0; i < 24; i++) {
        arrayForHoursInTheDay.push(<option key={"A" + i}>{i + ":00"}</option>);
        arraySecondForHoursInTheDay.push(<option key={"B" + i}>{i + ":00"}</option>);
    }
    // Default and future choice of the user on colour selection
    let changeColour = "rgb(3, 155, 229)";
    let changeElement;
    useEffect(() => {
        changeElement = document.getElementById("add-task_circle_blue");
    }, []);
    function changeSvgStyle(colour, id) {

        // Change the style of the unselected svg
        changeElement.setAttribute("r", 9);
        changeElement.style.outlineColor = "transparent";

        // Change the style of newly selected svg
        changeElement = document.getElementById(id);
        changeElement.setAttribute("r", 10);
        changeElement.style.outlineColor = "black";
        changeColour = colour;
    }

    return (
        <>
            <div className="add-task_background" onClick={() => { props.setNewTask(false) }}></div>
            <div className="add-task_div">
                <button className="add-task_cancel" onClick={() => { props.setNewTask(false) }}>X</button>
                <h3>Create a Plan</h3>
                <hr/>
                <form onSubmit={(e) => { e.preventDefault(); addEntryIntoStorage(changeColour, e.target, props.setNewTask); }} method="post">
                    <div className="add-task_context">
                        <div>
                            <div>
                                <label htmlFor="add-task_title">&#10067;</label>
                            </div>
                            <input placeholder="Add a title.."  required id="add-task_title" name="title" maxLength="15" autoFocus></input>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="add-task_date">&#128197;</label>
                            </div>
                            <input type="date" id="add-task_date" defaultValue={initialDayValue} onChange={e => setDayValue(e.target.value)} name="date"></input>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="add-task_selects">&#128337;</label>
                            </div>
                            <select defaultValue={shiftedHour} name="fromHour" id="add-task_selects">
                                    {arrayForHoursInTheDay}
                            </select>
                            <p className="add-task_between_selects">-</p>
                            <select defaultValue={shiftedHour} name="toHour" id="add-task_selectss">
                                    {arraySecondForHoursInTheDay}
                            </select>
                        </div>
                        <div className="add-task_colours">
                            <div>
                                <span>&#127912; </span>
                            </div>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(213, 0, 0)", e.target.id) }}
                                        id="add-task_circle_red" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(213, 0, 0)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(246, 191, 38)", e.target.id) }}
                                        id="add-task_circle_yellow" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(246, 191, 38)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(51, 182, 121)", e.target.id) }}
                                        id="add-task_circle_green" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(51, 182, 121)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(3, 155, 229)", e.target.id) }}
                                        id="add-task_circle_blue" cx="0.7vw" cy="2.3vh" r="10" fill="rgb(3, 155, 229)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(230, 124, 115)", e.target.id) }}
                                        id="add-task_circle_pink" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(230, 124, 115)" />
                                </svg>
                            </span>
                            <span>
                                <svg width="1.5vw" height="4vh">
                                    <circle onClick={(e) => { changeSvgStyle("rgb(142, 36, 170)", e.target.id) }}
                                        id="add-task_circle_purple" cx="0.7vw" cy="2.3vh" r="9" fill="rgb(142, 36, 170)" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="add-task_textarea">
                        <textarea name="description" rows="5" cols="32" placeholder="Describe it.."></textarea>
                        <button type="submit">Submit the plan!</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default AddTask