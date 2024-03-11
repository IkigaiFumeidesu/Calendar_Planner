import { useRef } from "react"
import CalendarContent from "./CalendarContent"

function DisplayUI(props) {
    if (props.displayinitial === "displayweek") {
        return (
            <>
                <CalendarContent daterow={props.daterow} />
            </>
        )
    } else if (props.displayinitial === "displaymonth") {
        return (
            <>
                <MonthContent tablerows={props.tablerows} weekdays={props.weekdays} />
            </>
        )
    } else {
        return (
            <>
                <YearContent days={props.days} months={props.months} numberofdays={props.numberofdays} initialYearNumber={props.initialYearNumber} />
            </>
        )
    }
}

function MonthContent(props) {


    return (
        <>
            <div className="tcontent">
                <table className="tablemonthcontent">
                    <thead>
                        <tr>{props.weekdays}</tr>
                    </thead>
                    <tbody>
                        <tr>{props.tablerows.row1}</tr>
                        <tr>{props.tablerows.row2}</tr>
                        <tr>{props.tablerows.row3}</tr>
                        <tr>{props.tablerows.row4}</tr>
                        <tr>{props.tablerows.row5}</tr>
                        <tr>{props.tablerows.row6}</tr>
                    </tbody>
                </table>
            </div>
        </>


    )
}

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

    // Object to hold an arrays of dates

    const tablerows = {
        row1: [],
        row2: [],
        row3: [],
        row4: [],
        row5: [],
        row6: [],
        rowCreation: [],
    };

    // one runtime per render, to get the start of the chain - calendar

    if (firstday == 0) { // Condition if the month starts on Sunday

        firstrowprevious = props.numberofdays[11] - 5;
        for (let fr = 0; fr < 6; fr++) {
            rowkeys = previousyear + 12 + firstrowprevious;
            tablerows.row1.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++
        }
        rowkeys = currentyear + 1 + date;
        tablerows.row1.push(<td key={rowkeys}>{date}</td>)
        date++

    } else if (firstday == 1) { // Condition if the month starts on Monday

        firstrowprevious = props.numberofdays[11] - 6;
        for (let fr = 0; fr < 7; fr++) {
            rowkeys = previousyear + 12 + firstrowprevious;
            tablerows.row1.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++
        }

    } else { // Solution for the rest of the week

        firstrowprevious = props.numberofdays[11] - firstday + 2;
        for (let fr = 0; fr < firstday - 1; fr++) {
            rowkeys = previousyear + 12 + firstrowprevious;
            tablerows.row1.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++
        }
        for (let fr = 0; fr < 8 - firstday; fr++) {
            rowkeys = currentyear + 1 + date;
            tablerows.row1.push(<td key={rowkeys}>{date}</td>);
            date++;
        }
    }
    
    // Here I will create all 12 months with the same function, inputting different variables as the useRef gets updated
    
    const createYearTable = (a) => {
        const test = a;
        const displaymonth = props.months[ref.current];
        const displayweek = props.days.map((day) => { return <td key={day}>{day}</td> })
        tablerows.row2.push(<td key={rowkeys}>{date}</td>);
        date++
        rowref.current = tablerows.row2;
        ref.current++
        return (
            <>
                <table>
                    <thead>
                        <tr>
                            <td>{displaymonth}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>{displayweek}</tr>
                        <tr>{tablerows.row1}</tr>
                        <tr>{tablerows.row2}</tr>
                    </tbody>
                </table>   
            </>
        )
    }
    


    return (
        <>
            <div className="tcontent">
                {createYearTable()}
                {createYearTable(rowref.current)}
            </div>
        </>
    )
}
export default DisplayUI