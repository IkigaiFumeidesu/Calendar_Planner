import { useState } from "react";

function Addtask(props) {

    document.cookie += "Is it working?"

    const selectedDate = props.gethourandday.slice(2);
    const selectedyear = selectedDate.slice(0, 4);
    const selectedmonth = selectedDate.slice(4, 6);
    let selectedday = selectedDate.slice(6, 8);
    if (selectedday.length == 1) {
        selectedday = "0" + selectedday;
    }
    const selectedTime = selectedyear + "-" + selectedmonth + "-" + selectedday;

    return (
        <>
            <div className="newtask">
            <div>
                <input placeholder="Add title" required></input>
                <div>
                        <input type="date" value={selectedTime} readOnly></input>
                    <select></select>
                </div>
                    <textarea></textarea>
                    <button onClick={() => { props.componentchanger(false);}}></button>
                </div>
            </div>
        </>
    )
}
export default Addtask