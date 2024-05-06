import React from "react";

function MonthContent(props) {

    const monthTasksCounter = [];
    let counterForKeys = 0;

    // Counting all plans with a given date 
    const countTasks = (key, row, index) => {

        const count = [...localDateStored.matchAll(key + "_", "i")];
        const customStyle = {
            position: "absolute",
            zIndex: 2,
            top: (18 + 14 * row) + "vh",
            left: (28 + 10.65 * index) + "vw",
        };
        monthTasksCounter.push(<h3 style={customStyle} key={counterForKeys}>{count.length !== 0 && count.length + " Task(s)"}</h3>)
        counterForKeys++;
    };
    const localDateStored = localStorage.getItem("Date");

    // Checking if any used date in a given month corresponds with one stored in localStorage
    for (let i = 0; i < 7; i++) {
        localDateStored.includes(props.monthRowsObject.firstRow[i].key) && countTasks(props.monthRowsObject.firstRow[i].key, 0, i);
        localDateStored.includes(props.monthRowsObject.secondRow[i].key) && countTasks(props.monthRowsObject.secondRow[i].key, 1, i);
        localDateStored.includes(props.monthRowsObject.thirdRow[i].key) && countTasks(props.monthRowsObject.thirdRow[i].key, 2, i);
        localDateStored.includes(props.monthRowsObject.fourthRow[i].key) && countTasks(props.monthRowsObject.fourthRow[i].key, 3, i);
        localDateStored.includes(props.monthRowsObject.fifthRow[i].key) && countTasks(props.monthRowsObject.fifthRow[i].key, 4, i);
        localDateStored.includes(props.monthRowsObject.sixthRow[i].key) && countTasks(props.monthRowsObject.sixthRow[i].key, 5, i);
    }

    return (
        <>
            <div className="tcontent">
                {monthTasksCounter !== 0 && <CountTasks monthtasks={monthTasksCounter} />}
                <table className="tablemonthcontent">
                    <thead>
                        <tr>{props.namesOfTheDays}</tr>
                    </thead>
                    <tbody>
                        <tr onClick={() => { props.setDisplayDifferent("displayweek"); props.setDifferentWeek(props.monthRowsObject.firstRow) }}>{props.monthRowsObject.firstRow}</tr>
                        <tr onClick={() => { props.setDisplayDifferent("displayweek"); props.setDifferentWeek(props.monthRowsObject.secondRow) }}>{props.monthRowsObject.secondRow}</tr>
                        <tr onClick={() => { props.setDisplayDifferent("displayweek"); props.setDifferentWeek(props.monthRowsObject.thirdRow) }}>{props.monthRowsObject.thirdRow}</tr>
                        <tr onClick={() => { props.setDisplayDifferent("displayweek"); props.setDifferentWeek(props.monthRowsObject.fourthRow) }}>{props.monthRowsObject.fourthRow}</tr>
                        <tr onClick={() => { props.setDisplayDifferent("displayweek"); props.setDifferentWeek(props.monthRowsObject.fifthRow) }}>{props.monthRowsObject.fifthRow}</tr>
                        <tr onClick={() => { props.setDisplayDifferent("displayweek"); props.setDifferentWeek(props.monthRowsObject.sixthRow) }}>{props.monthRowsObject.sixthRow}</tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}
function CountTasks(props) {

    return (
        <>
            {props.monthtasks}
        </>
    )
}
export default MonthContent