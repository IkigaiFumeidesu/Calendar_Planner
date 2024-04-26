import { useRef } from "react"
import CalendarContent from "./CalendarContent"

function DisplayUI(props) {
    if (props.displayinitial === "displayweek") {
        return (
            <>
                <CalendarContent initialWeek={props.initialWeek} />
            </>
        );
    } else if (props.displayinitial === "displaymonth") {
        return (
            <>
                <MonthContent tablerows={props.tablerows} weekdays={props.weekdays} setdisplay={props.setdisplay} setrow={props.setrow} />
            </>
        );
    } else {
        return (
            <>
                <YearContent days={props.days} months={props.months} numberofdays={props.numberofdays} initialYearNumber={props.initialYearNumber} />
            </>
        );
    };
};

function MonthContent(props) {

    const monthTasksCounter = [];
    let counterForKeys = 0;

    // function to count Tasks at a given day
    const countTasks = (key, row, index) => {

        const count = [...localStorage.getItem("Cookies").matchAll(key + "_", "i")];
        const customStyle = {
            position: "absolute",
            zIndex: 2,
            top: (18 + 14 * row) + "vh",
            left: (28 + 10.65 * index) + "vw",
        };
        monthTasksCounter.push(<h3 style={customStyle} key={counterForKeys}>{count.length !== 0 && count.length + " Task(s)"}</h3>)
        counterForKeys++;
    };

    // check if any day of the month corresponds with cookies
    for (let i = 0; i < 7; i++) {
        if (localStorage.getItem("Cookies").includes(props.tablerows.row1[i].key)) {
            countTasks(props.tablerows.row1[i].key, 0, i)
        };
        if (localStorage.getItem("Cookies").includes(props.tablerows.row2[i].key)) {
            countTasks(props.tablerows.row2[i].key, 1, i)
        };
        if (localStorage.getItem("Cookies").includes(props.tablerows.row3[i].key)) {
            countTasks(props.tablerows.row3[i].key, 2, i)
        };
        if (localStorage.getItem("Cookies").includes(props.tablerows.row4[i].key)) {
            countTasks(props.tablerows.row4[i].key, 3, i)
        };
        if (localStorage.getItem("Cookies").includes(props.tablerows.row5[i].key)) {
            countTasks(props.tablerows.row5[i].key, 4, i)
        };
        if (localStorage.getItem("Cookies").includes(props.tablerows.row6[i].key)) {
            countTasks(props.tablerows.row6[i].key, 5, i)
        };
    };

    return (
        <>
            <div className="tcontent">
                {monthTasksCounter !== 0 && <CountTasks monthtasks={monthTasksCounter} />}
                <table className="tablemonthcontent">
                    <thead>
                        <tr>{props.weekdays}</tr>
                    </thead>
                    <tbody>
                        <tr onClick={() => { props.setdisplay("displayweek"); props.setrow(props.tablerows.row1) }}>{props.tablerows.row1}</tr>
                        <tr onClick={() => { props.setdisplay("displayweek"); props.setrow(props.tablerows.row2) }}>{props.tablerows.row2}</tr>
                        <tr onClick={() => { props.setdisplay("displayweek"); props.setrow(props.tablerows.row3) }}>{props.tablerows.row3}</tr>
                        <tr onClick={() => { props.setdisplay("displayweek"); props.setrow(props.tablerows.row4) }}>{props.tablerows.row4}</tr>
                        <tr onClick={() => { props.setdisplay("displayweek"); props.setrow(props.tablerows.row5) }}>{props.tablerows.row5}</tr>
                        <tr onClick={() => { props.setdisplay("displayweek"); props.setrow(props.tablerows.row6) }}>{props.tablerows.row6}</tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

function CountTasks(props) {

    return (
        <>
            {props.monthtasks}
        </>
    );
};
function YearContent(props) {

    // I am setting useRef to help me render each month by slowly ugprading its value to 12, but when any other component would get rendered,
    // Ref would get updated into infinity, thats why I want it to be set to 0 so that I dont go above the bounds of my props.months array

    const ref = useRef();
    ref.current = 0; 
    const rowref = useRef();
    rowref.current = "";

    // I want to get the initial date of the first year so that I can work with it to display the full year

    const currentyear = props.initialYearNumber.toString(); // passed year so that update to previous or next year is automatic
    const startoftheyear = new Date();
    startoftheyear.setFullYear(currentyear, ref.current, 1);
    const firstday = startoftheyear.getDay();
    const previousyear = (currentyear - 1).toString();
    let firstrowprevious;
    let rowkeys;
    let date = 1;
    let whichrow;

    // Constructor for objects to hold an arrays of dates
    function MonthDates(row1, row2, row3, row4, row5, row6, rowCreation) {
        this.row1 = row1;
        this.row2 = row2;
        this.row3 = row3;
        this.row4 = row4;
        this.row5 = row5;
        this.row6 = row6;
        this.rowCreation = rowCreation;
    };

    // I want my objects to be in one
    const Objects = {};
    for (let x = 0; x < 12; x++) {
        Objects[x] = { name: new MonthDates([], [], [], [], [], [], []) };
    };

    // one runtime per render, to get the start of the chain - calendar
    if (firstday == 0) { // Condition if the month starts on Sunday

        firstrowprevious = props.numberofdays[11] - 5;
        for (let fr = 0; fr < 6; fr++) {
            rowkeys = previousyear + 12 + firstrowprevious;
            Objects[0].name.row1.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++
        };
        rowkeys = currentyear + 1 + date;
        Objects[0].name.row1.push(<td key={rowkeys}>{date}</td>);
        date++;

    } else if (firstday == 1) { // Condition if the month starts on Monday

        firstrowprevious = props.numberofdays[11] - 6;
        for (let fr = 0; fr < 7; fr++) {
            rowkeys = previousyear + 12 + firstrowprevious;
            Objects[0].name.row1.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++;
        };

    } else { // Solution for the rest of the week

        firstrowprevious = props.numberofdays[11] - firstday + 2;
        for (let fr = 0; fr < firstday - 1; fr++) {
            rowkeys = previousyear + 12 + firstrowprevious;
            Objects[0].name.row1.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++;
        };
        for (let fr = 0; fr < 8 - firstday; fr++) {
            rowkeys = currentyear + 1 + date;
            Objects[0].name.row1.push(<td key={rowkeys}>{date}</td>);
            date++;
        };
    };

    // Here I will create all 12 months with the same function, inputting different variables as the useRef gets updated
    
    const createYearTable = (Month) => {

        const displaymonth = props.months[ref.current];
        const displayweek = props.days.map((day) => { return <td key={day}>{day}</td> });
        let nextdate;

        // passing rows between objects (aka months), condition is to exclude January AND I also wanted to change the style per say

        if (Month != Objects[0].name) { // So in the case the 5th row is when the month ends I want to get the number at the start of the array
            if (whichrow == true) {

                let p = 1;
                let z = (Objects[ref.current - 1].name.row5[0].key).slice(-2); // Im getting the date at the first position of the array
                for (let i = 0; i < 7; i++) {
                    if (Objects[ref.current - 1].name.row5[i].key == (currentyear + (ref.current + 1) + p)) {
                        Month.row1.push(<td key={Objects[ref.current - 1].name.row5[i].key}>{p}</td>);
                        p++;   // when the key is equal to the first day of the month I want to push that date and others into the array
                    } else {
                        Month.row1.push(<td key={Objects[ref.current - 1].name.row5[i].key} className="previousmonth">{z}</td>);
                        z++;   // with the gotten date I want to push that date and increase it until I encounter a key which equals to the first day of the month
                    };
                };
                date = date - 7; // -7 because of what nextdate number is, if the month doesnt extend beyond 5th row
            } else {

                let p = 1;
                let z = (Objects[ref.current - 1].name.row6[0].key).slice(-2); // here I am doing the same thing, but for the 6th row instead of 5th
                for (let i = 0; i < 7; i++) {
                    if (Objects[ref.current - 1].name.row6[i].key == (currentyear + (ref.current + 1) + p)) {
                        Month.row1.push(<td key={Objects[ref.current - 1].name.row6[i].key}>{p}</td>);
                        p++; // same logic is applied here but with the 6th row
                    } else {
                        Month.row1.push(<td key={Objects[ref.current - 1].name.row6[i].key} className="previousmonth">{z}</td>);
                        z++;
                    };
                };
            };
        };

        // Just filling array with all the dates of the month

        for (; date <= props.numberofdays[ref.current]; date++) {
            rowkeys = currentyear + (ref.current + 1) + date;
            Month.rowCreation.push(<td key={rowkeys}>{date}</td>);
        };

        Month.row2 = Month.rowCreation.slice(0, 7);
        Month.row3 = Month.rowCreation.slice(7, 14);
        Month.row4 = Month.rowCreation.slice(14, 21);
        Month.row5 = Month.rowCreation.slice(21, 28);
        Month.row6 = Month.rowCreation.slice(28, 31);

        // For the dates of the next month to fill up row 5 and 6

        nextdate = 1;
        let lastrow = Month.row5.length;
        let lastlastrow = Month.row6.length;

        // This right here is to check whether I want to import row 5 or row 6 into the next month's row 1

        if (lastlastrow > 0) {
            whichrow = false;
        } else {
            whichrow = true;
        };
        for (; lastrow < 7; lastrow++) {
            rowkeys = currentyear + (ref.current + 2) + nextdate;
            Month.row5.push(<td className="nextmonth" key={rowkeys} >{nextdate}</td>);
            nextdate++
        };
        for (; lastlastrow < 7; lastlastrow++) {
            rowkeys = currentyear + (ref.current + 2) + nextdate;
            Month.row6.push(<td className="nextmonth" key={rowkeys}>{nextdate}</td>);
            nextdate++
        };

        // date gets to the point where its mroe than the number of days in the current month, so I want to make it so that it
        // gets the number which is equal to the total number of days which I took from the other month to fill rows 5 and 6
        // then I set the nextdate back to 1 and increase ref.current

        date = nextdate;
        nextdate = 1;
        ref.current++;
        return (
            <>
                <table className="yearlytable">
                    <thead>
                        <tr>
                            <td colSpan="7"><strong>{displaymonth}</strong></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>{displayweek}</tr>
                        <tr>{Month.row1}</tr>
                        <tr>{Month.row2}</tr>
                        <tr>{Month.row3}</tr>
                        <tr>{Month.row4}</tr>
                        <tr>{Month.row5}</tr>
                        <tr>{Month.row6}</tr>
                    </tbody>
                </table>
            </>
        );
    };


    return ( // I humbly present, the ugliest code ever known to man
        <>
            <div className="yearcontent">
                <div className="monthflexbox">
                    <div className="monthdiv">
                        {createYearTable(Objects[0].name)}
                    </div>
                    <div className="monthdiv">
                        {createYearTable(Objects[1].name)}
                    </div>
                    <div className="monthdiv">
                        {createYearTable(Objects[2].name)} 
                    </div>
                </div>
                <div className="monthflexbox">
                    <div className="monthdiv">
                        {createYearTable(Objects[3].name)}     
                    </div>
                    <div className="monthdiv">
                        {createYearTable(Objects[4].name)}
                    </div>
                    <div className="monthdiv">
                        {createYearTable(Objects[5].name)}
                    </div>
                </div>
                <div className="monthflexbox">
                    <div className="monthdiv">
                        {createYearTable(Objects[6].name)}
                    </div>
                    <div className="monthdiv">
                        {createYearTable(Objects[7].name)}
                    </div>
                    <div className="monthdiv">
                        {createYearTable(Objects[8].name)}
                    </div>
                </div>
                <div className="monthflexbox">
                    <div className="monthdiv">
                        {createYearTable(Objects[9].name)}
                    </div>
                    <div className="monthdiv">
                        {createYearTable(Objects[10].name)}
                    </div>
                    <div className="monthdiv">
                        {createYearTable(Objects[11].name)}
                    </div>
                </div>
            </div>
        </>
    )
}
export default DisplayUI