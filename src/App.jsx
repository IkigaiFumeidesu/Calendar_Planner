import './App.css'
import ProfilePicture from './assets/profile-picture.svg'
import React, { useState } from 'react'
import { useRef, setState } from 'react';
// Top of the page
function App() {
    return (
        <>
        <Calendar/>
        </>
    )
}
export default App

export function Calendar() {

    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const currentdate = new Date();
    const weekdays = days.map((day) => { return <td key={day}><strong>{day}</strong></td> });

    // Nastavení základních hodnot pro Mìsíc, jeho èíslo a rok
    // currentdate.getFullYear()
    const [initialMonth, setMonth] = useState(months[currentdate.getMonth()]);
    const [initialMonthNumber, setMonthNumber] = useState(currentdate.getMonth());
    const [initialYearNumber, setYearNumber] = useState(currentdate.getFullYear());
    
    // Change to the previous month and update the element

    const previousmonth = () => {
        if (initialMonthNumber == 0) {
            setMonth(months[initialMonthNumber + 11]);
            setMonthNumber(11); 
            setYearNumber(initialYearNumber - 1);
        } else {
            setMonth(months[initialMonthNumber - 1]);
            setMonthNumber(initialMonthNumber - 1);
        }  
    };

    // Change to the next month and update the element

    const nextmonth = () => {
        if (initialMonthNumber == 11) {
            setMonth(months[initialMonthNumber - 11]);
            setMonthNumber(0);
            setYearNumber(initialYearNumber + 1);
        } else {
            setMonth(months[initialMonthNumber + 1]);
            setMonthNumber(initialMonthNumber + 1);
        }
    };


    // Solution to solve the leap year = 28 and 29th of February

    const numberofdays = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
    const leapyear = initialYearNumber % 4;
    if (leapyear == 0) {
        numberofdays.splice(1, 1, 29);
    }

    // Passing props and variables to set a date to 1.XX.XXXX to get the number of the day (0-6) to know when one month ends and other starts

    const daysoftheweek = days;
    const monthtablenumber = numberofdays[initialMonthNumber];
    const currentMonth = new Date();
    currentMonth.setFullYear(initialYearNumber, initialMonthNumber, 1);
    const firstday = currentMonth.getDay();

    // Object to hold an arrays of dates

    const tablerows = {
        row0: [],
        rowCreation: [],
        row1: [],
        row2: [],
        row3: [],
        row4: [],
        row5: [],
    };

    // When we reach January, the array element index is 0, so by subtracting -1 to get the previous month,
    // we are out of the array bounds, below is the solution for that + we are getting the number of the previous year

    let previousyear = "";
    let datesofprevious = initialMonthNumber - 1;
    if (datesofprevious == -1) {
        datesofprevious = 11;
        previousyear = initialYearNumber - 1;
    } else {
        previousyear = initialYearNumber;
    }

    // Preparing to set each key of every date to XXXX.XX.?? year-month(2 numbers), and whatever date

    let yearstring = initialYearNumber.toString();
    previousyear.toString();
    let monthstringprevious = initialMonthNumber.toString();
    if (monthstringprevious.length == 1) {
        monthstringprevious = "0" + monthstringprevious;
    }
    if (monthstringprevious == "00") {
        monthstringprevious = "12"
    }
    let monthstringcurrent = (initialMonthNumber + 1).toString();
    if (monthstringcurrent.length == 1) {
        monthstringcurrent = "0" + monthstringcurrent;
    }
    let rowkeys = "";
    let date = 1;   // Date of the first day of the next month
    let firstrowprevious;

    // Here is the solution to the first row of the calendar, where JS gives Sunday 0 as its according to JS the start of the week
    // Since the workweed is Mo-Su I need to check which day is the starting day of the month and get the dates of the previous month to fill out table row

    if (firstday == 0) { // Condition if the month starts on Sunday

        firstrowprevious = numberofdays[datesofprevious] - 5;
        for (let fr = 0; fr < 6; fr++) {
            rowkeys = previousyear + monthstringprevious + firstrowprevious;
            tablerows.row0.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++
        }
        rowkeys = yearstring + monthstringcurrent + date;
        tablerows.row0.push(<td key={rowkeys}>{date}</td>)
        date++

    } else if (firstday == 1) { // Condition if the month starts on Monday

        firstrowprevious = numberofdays[datesofprevious] - 6;
        for (let fr = 0; fr < 7; fr++) {
            rowkeys = previousyear + monthstringprevious + firstrowprevious;
            tablerows.row0.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++
        }

    } else { // Solution for the rest of the week

        firstrowprevious = numberofdays[datesofprevious] - firstday + 2;
        for (let fr = 0; fr < firstday - 1; fr++) {
            rowkeys = previousyear + monthstringprevious + firstrowprevious;
            tablerows.row0.push(<td className="previousmonth" key={rowkeys}>{firstrowprevious}</td>);
            firstrowprevious++
        }
        for (let fr = 0; fr < 8 - firstday; fr++) {
            rowkeys = yearstring + monthstringcurrent + date;
            tablerows.row0.push(<td key={rowkeys}>{date}</td>);
            date++;
        }
    }

    // A for loop to get all the remaining dates of the current month into arrays of 7 elements (7 dates)

    for (; date <= monthtablenumber; date++) {
        rowkeys = yearstring + monthstringcurrent + date;
        tablerows.rowCreation.push(<td key={rowkeys}>{date}</td>)
    }
    tablerows.row1 = tablerows.rowCreation.slice(0, 7);
    tablerows.row2 = tablerows.rowCreation.slice(7, 14);
    tablerows.row3 = tablerows.rowCreation.slice(14, 21);
    tablerows.row4 = tablerows.rowCreation.slice(21, 28);
    tablerows.row5 = tablerows.rowCreation.slice(28, 31);

    // Next month passed into string

    let monthstringnext = (initialMonthNumber + 2).toString();
    if (monthstringnext.length == 1) {
        monthstringnext = "0" + monthstringnext;
    }

    // Filling whatever empty space there is in the last 2 rows (last 2 arrays)

    let lastrownext = 1;
    let lastrow = tablerows.row4.length;
    let lastlastrow = tablerows.row5.length;

    if (lastrow <= 7) { // If there is less elements in the 4th array than 7 fill it out with the dates of the next month
        for (; lastrow < 7; lastrow++) {
            rowkeys = yearstring + monthstringnext + lastrownext;
            tablerows.row4.push(<td className="nextmonth" key={rowkeys}>{lastrownext}</td>)
            lastrownext++
        }
        for (; lastlastrow < 7; lastlastrow++) { // and then fill out whole 5th array with the dates of the next month
            rowkeys = yearstring + monthstringnext + lastrownext;
            tablerows.row5.push(<td className="nextmonth" key={rowkeys}>{lastrownext}</td>)
            lastrownext++
        }
    } else {
        for (; lastlastrow < 7; lastlastrow++) { // or just fill out the rest of the 5th array with the dates of the next month
            rowkeys = yearstring + monthstringnext + lastrownext;
            tablerows.row5.push(<td key={rowkeys}>{lastrownext}</td>)
            lastrownext++
        }
    }

    const idkwhat = [...tablerows.row0, ...tablerows.rowCreation, ...tablerows.row5];
    console.log(idkwhat)
    const [test1, settest] = useState();




    return (
        <>
            <div className="pagetop">


                <span className="cal">Calendar</span>

                <button className="todaybutton" type="button" onClick={() => {
                    setMonth(months[currentdate.getMonth()]);
                    setMonthNumber(currentdate.getMonth());
                    setYearNumber(currentdate.getFullYear());
                }}>Today</button>

                <ul className="ultoppage">
                    <li className="litopinline"><button className="topbutton">Week</button></li>
                    <li className="litopinline"><button className="topbutton">Month</button></li>
                    <li className="litopinline"><button className="topbutton">Year</button></li>
                </ul>

                <input></input>

                {/*Icon for a change between white / black background*/}

                <div className="svg">

                    <svg className="changeofbg">
                        <circle cx="40" cy="20" r="10" stroke="black" strokeWidth="3" fill="black">Can't Load SVG</circle>
                    </svg>
                    <svg className="changeofbg">
                        <circle cx="0" cy="20" r="10" stroke="black" strokeWidth="3" fill="white">Can't Load SVG</circle>
                    </svg>

                    <div className="profilediv">
                        <img src={ProfilePicture} alt="Profile" className="profile" />
                    </div>

                </div>

            </div>
            <hr className="hrmargin"></hr>
            <div className="calendarbody">
            <table id="calendartable">
                <thead>
                    <tr>
                        <th id="monthsetting" colSpan="4">{initialMonth}</th>
                        <th colSpan="1">{initialYearNumber}</th>
                        <th id="previous" onClick={previousmonth}>&larr;</th>
                        <th id="next" onClick={nextmonth}>&rarr;</th>
                    </tr>
                    <tr>
                        {weekdays}
                    </tr>
                </thead>
                <tbody>
                        <tr>{tablerows.row0}</tr>
                        <tr>{tablerows.row1}</tr>
                        <tr>{tablerows.row2}</tr>
                        <tr>{tablerows.row3}</tr>
                        <tr>{tablerows.row4}</tr>
                        <tr>{tablerows.row5}</tr>
                </tbody>
            </table>
            <div className="tcontent">
                    <CalendarContent tablerow={tablerows} />
            </div>
            <div className="secondside">

            </div>
            </div>
        </>
    )
}


function CalendarContent(props) {

    const days1 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"];
    const weekdays1 = days1.map((day) => { return <td key={day}>{day}</td> });
    let contentrows = [];
    const sharekeys = props.tablerow;
    console.log(sharekeys);

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
                        {weekdays1}
                    </tr>
                </thead>
                <tbody className="tablebordercontent">
                    
                </tbody>
            </table>
        </>
    )
}