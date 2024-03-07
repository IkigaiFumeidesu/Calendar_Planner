import React from 'react';

function CalendarContent(props) {

    // Setting the content of table 

    const days1 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weekdays1 = days1.map((day) => { return <td key={day}>{day}</td> });
    let contentrows = [];
    const datesofweekdays = [];
    let contentkeys;

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
                contentkeys = contentkeys[3] + contentkeys[2] + "." + contentkeys[1] + contentkeys[0];
            }
        }
        datesofweekdays.push(<td key={props.daterow[zz].key}>{contentkeys}</td>)
    }

    // Here I am creating rows and cells for each day and each hour with special keys

    for (let p = 0; p < 24; p++) {
        contentrows.push(
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }



    return (
        <>
            <table className="tablecontent">
                <thead>
                    <tr>
                        {datesofweekdays}
                    </tr>
                </thead>
                <tbody className="tablebordercontent">

                    <tr>
                        {weekdays1}
                    </tr>
                    <tr>

                    </tr>
                </tbody>
            </table>

        </>
    )
}

export default CalendarContent;