
function MonthContent(props) {

    const monthTasksCounter = [];
    const countPlansArray = [];
    let counterForKeys = 0;

    // Counting all plans with a given date 
    const countTasks = (count, row, index) => {

        const customStyle = {
            position: "absolute",
            zIndex: 2,
            top: (18 + 14 * row) + "vh",
            left: (28 + 10.65 * index) + "vw",
        };
        monthTasksCounter.push(<h3 style={customStyle} key={counterForKeys}>{count + " Task(s)"}</h3>);
        counterForKeys++;
    };
    const localDateStored = localStorage.getItem("Date");

    // Checking if any used date in a given month corresponds with one stored in localStorage
    for (let i = 0; i < 7; i++) {
        countPlansArray[0] = Array.from(localDateStored.matchAll(props.monthRowsObject.firstRow[i].key)).length; 
        countPlansArray[1] = Array.from(localDateStored.matchAll(props.monthRowsObject.secondRow[i].key)).length; 
        countPlansArray[2] = Array.from(localDateStored.matchAll(props.monthRowsObject.thirdRow[i].key)).length;
        countPlansArray[3] = Array.from(localDateStored.matchAll(props.monthRowsObject.fourthRow[i].key)).length; 
        countPlansArray[4] = Array.from(localDateStored.matchAll(props.monthRowsObject.fifthRow[i].key)).length;
        countPlansArray[5] = Array.from(localDateStored.matchAll(props.monthRowsObject.sixthRow[i].key)).length; 
        for (let p = 0; p < 6; p++) {
            countPlansArray[p] !== 0 && countTasks(countPlansArray[p], p, i);
        }
    }

    return (
        <>
            <div className="month-content_div">
                {monthTasksCounter !== 0 && <CountTasks monthtasks={monthTasksCounter} />}
                <table className="month-content_table">
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