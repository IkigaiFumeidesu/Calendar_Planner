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
        row1: [],
        row2: [],
        row3: [],
        row4: [],
        row5: [],
        row6: [],
        rowCreation: [],
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
            tablerows.row1.push(<td className="previousmonth" key={rowkeys} onClick={() => { setDifferentRow(tablerows.row1); }}>{firstrowprevious}</td>);
            firstrowprevious++
        }
        rowkeys = yearstring + monthstringcurrent + date;
        tablerows.row1.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row1); }}>{date}</td>)
        date++

    } else if (firstday == 1) { // Condition if the month starts on Monday

        firstrowprevious = numberofdays[datesofprevious] - 6;
        for (let fr = 0; fr < 7; fr++) {
            rowkeys = previousyear + monthstringprevious + firstrowprevious;
            tablerows.row1.push(<td className="previousmonth" key={rowkeys} onClick={() => { setDifferentRow(tablerows.row1); }}>{firstrowprevious}</td>);
            firstrowprevious++
        }

    } else { // Solution for the rest of the week

        firstrowprevious = numberofdays[datesofprevious] - firstday + 2;
        for (let fr = 0; fr < firstday - 1; fr++) {
            rowkeys = previousyear + monthstringprevious + firstrowprevious;
            tablerows.row1.push(<td className="previousmonth" key={rowkeys} onClick={() => { setDifferentRow(tablerows.row1); }}>{firstrowprevious}</td>);
            firstrowprevious++
        }
        for (let fr = 0; fr < 8 - firstday; fr++) {
            rowkeys = yearstring + monthstringcurrent + date;
            tablerows.row1.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row1); }}>{date}</td>);
            date++;
        }
    }

    // I needed to add onClick event to all other dates so that I could display the table row in the table content 

    for (let i = 0; i < 7; i++) {
        rowkeys = yearstring + monthstringcurrent + date;
        tablerows.row2.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row2); }}>{date}</td>)
        date++
    }
    for (let i = 0; i < 7; i++) {
        rowkeys = yearstring + monthstringcurrent + date;
        tablerows.row3.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row3); }}>{date}</td>)
        date++
    }
    for (let i = 0; i < 7; i++) {
        rowkeys = yearstring + monthstringcurrent + date;
        tablerows.row4.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row4); }}>{date}</td>)
        date++
    }
    if ((monthtablenumber - date) >= 7) { // with first 3 rows are guaranteed to be filled this checks whether there is still enough dates or not
        for (let i = 0; i < 7; i++) {
            rowkeys = yearstring + monthstringcurrent + date;
            tablerows.row5.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row5); }}>{date}</td>)
            date++
        }
        for (; date <= monthtablenumber; date++) {
            rowkeys = yearstring + monthstringcurrent + date;
            tablerows.row6.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row6); }}>{date}</td>)
        }
    } else {
        for (; date <= monthtablenumber; date++) {
            rowkeys = yearstring + monthstringcurrent + date;
            tablerows.row5.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row5); }}>{date}</td>)
        }
    }

    // Next month passed into string

    let monthstringnext = (initialMonthNumber + 2).toString();
    if (monthstringnext.length == 1) {
        monthstringnext = "0" + monthstringnext;
    }

    // Filling whatever empty space there is in the last 2 rows (last 2 arrays)

    let lastrownext = 1;
    let lastrow = tablerows.row5.length;
    let lastlastrow = tablerows.row6.length;

    if (lastrow <= 7) { // If there is less elements in the 4th array than 7 fill it out with the dates of the next month
        for (; lastrow < 7; lastrow++) {
            rowkeys = yearstring + monthstringnext + lastrownext;
            tablerows.row5.push(<td className="nextmonth" key={rowkeys} onClick={() => { setDifferentRow(tablerows.row5); }}>{lastrownext}</td>)
            lastrownext++
        }
        for (; lastlastrow < 7; lastlastrow++) { // and then fill out whole 5th array with the dates of the next month
            rowkeys = yearstring + monthstringnext + lastrownext;
            tablerows.row6.push(<td className="nextmonth" key={rowkeys} onClick={() => { setDifferentRow(tablerows.row6); }}>{lastrownext}</td>)
            lastrownext++
        }
    } else {
        for (; lastlastrow < 7; lastlastrow++) { // or just fill out the rest of the 5th array with the dates of the next month
            rowkeys = yearstring + monthstringnext + lastrownext;
            tablerows.row6.push(<td key={rowkeys} onClick={() => { setDifferentRow(tablerows.row6); }}>{lastrownext}</td>)
            lastrownext++
        }
    }

    // Here I am getting the todays date and finding it in the array of all arrays (rows) so that I can display the week (array) its in
    
    const interactiverows = () => {
    const alldates = [...tablerows.row1, ...tablerows.row2, ...tablerows.row3, ...tablerows.row4, ...tablerows.row5, ...tablerows.row6];
    const todaysdate = currentdate.getDate();
        if (tablerows.row3[6].key.slice(6) >= todaysdate) {
            if (tablerows.row2[6].key.slice(6) < todaysdate) {
                return tablerows.row3
            } else if (tablerows.row1[6].key.slice(6) < todaysdate) {
                return tablerows.row2
            } else {
                return tablerows.row1
            }
        } else {
            if (tablerows.row5[0].key.slice(6) > todaysdate) {
                return tablerows.row4
            } else if (tablerows.row6[0].key.slice(6) > todaysdate) {
                return tablerows.row5
            } else {
                return tablerows.row6
            }
        }
    };

    // This was a bit problematic, since the initial state is the only thing I need to get, even though it updates I need to preserve the initial so that I can call it 

    const [daterow, setDifferentRow] = useState(interactiverows);
    const [preserveinitial, setWhatever] = useState(daterow)

    return (
        <>
            <div className="pagetop">
            

                <span className="cal">Calendar</span>

                <button className="todaybutton" type="button" onClick={() => { // here I am resetting all states to initial ones so that I can get back to beginning
                    setMonth(months[currentdate.getMonth()]);
                    setMonthNumber(currentdate.getMonth());
                    setYearNumber(currentdate.getFullYear());
                    setDifferentRow(preserveinitial)
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
                        <tr>{tablerows.row1}</tr>
                        <tr>{tablerows.row2}</tr>
                        <tr>{tablerows.row3}</tr>
                        <tr>{tablerows.row4}</tr>
                        <tr>{tablerows.row5}</tr>
                        <tr>{tablerows.row6}</tr>
                </tbody>
            </table>
            <div className="tcontent">
                    <CalendarContent daterow={daterow} />
            </div>
            <div className="secondside">

            </div>
            </div>
        </>
    )
}


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