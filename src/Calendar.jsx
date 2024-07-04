import React, { useRef, useState } from 'react';
import './Calendar.scss';
import ProfilePicture from './assets/profile-picture.svg';
import AddTask from './CalendarComponents/AddTask';
import WeekContent from './CalendarComponents/WeekContent';
import MonthContent from './CalendarComponents/MonthContent';
import YearContent from './CalendarComponents/YearContent';
import LoginComponent from './CalendarComponents/LoginComponent';
import PublicHolidayAPI from './CalendarComponents/PublicHolidayAPI';
import getInitialWeek from './CalendarComponents/getInitialWeek';
import changeToPreviousMonth from './CalendarComponents/changeToPreviousMonth';
import changeToNextMonth from './CalendarComponents/changeToNextMonth';
import checkIfUserIsLogged from './CalendarComponents/checkIfUserIsLogged';
import changeBackground from './CalendarComponents/changeBackground';
import searchAlgorithm from './CalendarComponents/searchAlgorithm';
import SearchUserInput from './CalendarComponents/SearchUserInput';

export function Calendar(props) {

    // If storage exists, leave it be, if not change null to empty string, otherwise searchAlgorithm function will produce an error running .include() on null 
    localStorage.getItem("TaskDetails") === null && localStorage.setItem("TaskDetails", "");
    localStorage.getItem("Date") === null && localStorage.setItem("Date", "");
    localStorage.getItem("Tasks") === null && localStorage.setItem("Tasks", "");

    const [initialPublicHoliday, setPublicHoliday] = useState("");

    const daysOfTheWeekArray = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const monthsOfTheYearArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const namesOfTheDays = daysOfTheWeekArray.map((day) => { return <td key={day}><strong>{day}</strong></td> });

    // Setting up default values for year, month and its number
    const [initialMonthName, setMonthName] = useState( monthsOfTheYearArray[currentDate.getMonth()]);
    const [initialMonthNumber, setMonthNumber] = useState(currentDate.getMonth());
    const [initialYearNumber, setYearNumber] = useState(currentDate.getFullYear());

    // Decide whether its leap year or not = 28/29th February
    const numberOfDaysInMonthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    initialYearNumber % 4 === 0 && (numberOfDaysInMonthArray[1] = 29);

    // Set a date to 1.XX.XXXX format to get the number of the day (0-6) 
    const numberOfDaysInMonth = numberOfDaysInMonthArray[initialMonthNumber];
    const changeDate = new Date();
    changeDate.setFullYear(initialYearNumber, initialMonthNumber, 1);
    const firstDayNumber = changeDate.getDay();

    // Object to hold an arrays of dates
    const monthRowsObject = {
        firstRow: [],
        secondRow: [],
        thirdRow: [],
        fourthRow: [],
        fifthRow: [],
        sixthRow: [],
    };

    // When we reach January, the array index of January is 0, so by subtracting -1 to get the previous month, we are out of the array bounds
    // if that happens, index should instead be 11 = (December) and we also need to subtract 1 from initialYearNumber
    let previousYear = initialYearNumber;
    let previousMonthNumber = initialMonthNumber - 1;
    if (previousMonthNumber === -1) {
        previousMonthNumber = 11;
        previousYear = initialYearNumber - 1;
    } 

    // Preparing to set each key of every date to XXXX-??-?? year-month-date format
    let previousMonth = initialMonthNumber;
    previousMonth === 0 && (previousMonth = 12);
    let currentMonth = initialMonthNumber + 1;

    // iterator variables
    let dateUsedAsKey;
    let previousMonthDates;

    // Date counter of the first day of month to be rendered
    let dateCounter = 1; 

    // JS gives Sunday 0 as its according to JS the start of the week, my week starts with monday so I need to check it 

    if (firstDayNumber === 0) {    // Condition if the month starts on Sunday

        // Ex. 31 dates are in previous month 31 - 5 is 26 but starting from 26 to 31, there are 6 numbers, thats why i < 6, it starts at 0
        previousMonthDates = numberOfDaysInMonthArray[previousMonthNumber] - 5;
        createDatesPreviousMonth(6);
        // To the 6 dates from previous month, I need to add 1 from the month to be displayed
        createDatesThisMonth(0, 1, monthRowsObject.firstRow)

    } else if (firstDayNumber === 1) {    // Condition if the month starts on Monday

        // Ex. 31 dates are in previous month 31 - 6 is 25 but starting from 25 to 31, there are 7 numbers, therefore the whole first row 
        previousMonthDates = numberOfDaysInMonthArray[previousMonthNumber] - 6;
        createDatesPreviousMonth(7);

    } else {    // Solution for the rest of the week

        // Ex. 31 dates are in previous month 31 - 4 + 2 = 29, therefore 3 numbers, +2 because I omitted 2 cases, Mo and Su
        previousMonthDates = numberOfDaysInMonthArray[previousMonthNumber] - firstDayNumber + 2;
        createDatesPreviousMonth(firstDayNumber - 1);
        // i starts at 0, therefore range from 0 to 8 is 9 numbers, because I added 2 before
        createDatesThisMonth(0, 8 - firstDayNumber, monthRowsObject.firstRow)
    }
    // I need to add onClick event to all other dates so that the user can switch weeks simply by just clicking on a date 
    createDatesThisMonth(0, 7, monthRowsObject.secondRow);
    createDatesThisMonth(0, 7, monthRowsObject.thirdRow);
    createDatesThisMonth(0, 7, monthRowsObject.fourthRow);

    // First 4 rows are guaranteed to be filled, now I need to check if the month ends in 5th or 6th row and fill it with dates respectively
    if (numberOfDaysInMonth - dateCounter >= 7) { 
        createDatesThisMonth(0, 7, monthRowsObject.fifthRow);
        createDatesThisMonth(dateCounter, numberOfDaysInMonth + 1, monthRowsObject.sixthRow);
    } else {
        createDatesThisMonth(dateCounter, numberOfDaysInMonth + 1, monthRowsObject.fifthRow);
    }
    // Ex. April - initialMonthNumber would return 3, so to get the next month - May I need to add 2
    let nextMonth = initialMonthNumber + 2;
    nextMonth === 13 && (nextMonth = 1);

    // Filling 5th and 6th arrays so that both contain 7 elements
    let dateOfNextMonth = 1;
    let numberOfDatesFifthRow = monthRowsObject.fifthRow.length;
    let numberOfDatesSixthRow = monthRowsObject.sixthRow.length;

    // When I update month to January I also need to up the year parameter
    let nextYearString = initialYearNumber;
    nextMonth === 1 && (nextYearString = initialYearNumber + 1);

    // If there is less elements in the 5th array than 7 fill it out with the dates of the next month
    createDatesNextMonth(numberOfDatesFifthRow, 7, monthRowsObject.fifthRow);
    // And then fill out whole 6th array with the dates of the next month
    createDatesNextMonth(numberOfDatesSixthRow, 7, monthRowsObject.sixthRow);

    // Functions to create all dates
    function createDatesPreviousMonth(number) {
        for (let i = 0; i < number; i++) {
            dateUsedAsKey = previousYear + "-" + previousMonth + "-" + previousMonthDates;
            monthRowsObject.firstRow.push(<td className="calendar-table_previousM" key={dateUsedAsKey} onClick={() => {
                setDifferentWeek(monthRowsObject.firstRow); setDisplayDifferent("displayweek");
            }}>{previousMonthDates}</td>);
            previousMonthDates++;
        }
    }
    function createDatesThisMonth(from, number, row) {
        for (let i = from; i < number; i++) {
            dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
            row.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(row); setDisplayDifferent("displayweek"); }}>{dateCounter}</td>);
            dateCounter++;
        }
    }
    function createDatesNextMonth(from, number, row) {
        for (let i = from; i < number; i++) {
            dateUsedAsKey = nextYearString + "-" + nextMonth + "-" + dateOfNextMonth;
            row.push(<td className="calendar-table_nextM" key={dateUsedAsKey} onClick={() => { setDifferentWeek(row);; setDisplayDifferent("displayweek"); }}>{dateOfNextMonth}</td>);
            dateOfNextMonth++;
        }
    }

    // Using the second State to preserve the initialWeek even if it gets updated, so that the user can back to it
    const [initialWeek, setDifferentWeek] = useState(getInitialWeek(currentDate,monthRowsObject));
    const [preserveInitial, setDontUse] = useState(initialWeek);

    // These are states which I use to display the week as initial and then to change the body depending on what the user wants to display
    const [displayInitial, setDisplayDifferent] = useState("displayweek");
    const [preservedisplay, setDisplayback] = useState(displayInitial);

    // State to decide if Login component should render or not
    const [userNotLogged, setUserIsLogged] = useState(false);

    // This is the default setting for the user I want to hold this setting so that it doesnt go back to normal when the site refreshes
    if (localStorage.getItem("Background") === null || localStorage.getItem("Background") === "background=#FDFDFD") {
        document.body.style.backgroundColor = "#FDFDFD";
        document.body.style.color = "#181818";
        localStorage.setItem("Background", "background=#FDFDFD");
    } else {
        document.body.style.backgroundColor = "#181818";
        document.body.style.color = "#FDFDFD";
        localStorage.setItem("Background", "background=#181818");
    }

    const [initialBackground, setBackground] = useState("");
    const whiteBackground = [<circle cx="40" cy="20" r="10" stroke="black" strokeWidth="3" fill="black">Can't Load SVG</circle>,
        <circle cx="0" cy="20" r="10" stroke="black" strokeWidth="3" fill="white">Can't Load SVG</circle>];

    const blackBackground = [<circle cx="40" cy="20" r="10" stroke="white" strokeWidth="3" fill="white">Can't Load SVG</circle>,
        <circle cx="0" cy="20" r="10" stroke="white" strokeWidth="3" fill="black">Can't Load SVG</circle>];
    // States for the appearance and disappearance of Addtask component and passing todays date + current hour to it as a default value
    const [initialAddTask, setNewTask] = useState(false);
    const getHourAndDay = currentDate.getHours() + "-" + currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();

    // States for the apperance and disappearance of SearchUserInput component
    const [initialSearch, setSearch] = useState(false); 

    // useRef to hold the corresponding values for each task
    const searchResult = useRef();

    return (
        <>
        {initialSearch === true && <SearchUserInput setSearch={setSearch} searchResult={searchResult.current} />}
        {initialAddTask === true && <AddTask setNewTask={setNewTask} getHourAndDay={getHourAndDay} />}
        {userNotLogged === true && <LoginComponent dontDisplayUI={setUserIsLogged} />}
        {props.initialCountry !== "" && <PublicHolidayAPI initialCountry={props.initialCountry} initialYearNumber={initialYearNumber} setPublicHoliday={setPublicHoliday} />}

        <div className="page-top">
            
            <span>Calendar</span>

            <div className="page-top_divbuttons">
                <button type="button" onClick={() => {
                    setMonthName( monthsOfTheYearArray[currentDate.getMonth()]);
                    setMonthNumber(currentDate.getMonth());
                    setYearNumber(currentDate.getFullYear());
                    setDifferentWeek(preserveInitial);
                    setDisplayDifferent(preservedisplay);
                }}>Today</button>

                <ul className="page-top_ul">
                    <li> <button id="page-top_ul_liF" onClick={() => {setDisplayDifferent(preservedisplay) } }>Week</button> </li>
                    <li> <button onClick={() => {setDisplayDifferent("displaymonth") } }>Month</button> </li>
                    <li> <button id="page-top_ul_liL" onClick={() => {setDisplayDifferent("displayyear") } }>Year</button> </li>
                </ul>
            </div>

                <form onSubmit={(e) => {
                    e.preventDefault(); searchAlgorithm(searchResult, e.target, setSearch,
                        numberOfDaysInMonthArray, setYearNumber, setMonthNumber, setMonthName, monthsOfTheYearArray, setDifferentWeek)
                }} method="post">
                <input id="page-top_input" type="search" placeholder="Search for.." name="input" minLength="3" maxLength="15"></input>
                <button className="page-top_search_button" type="submit">Search</button>
            </form>

            {/*Icon for a change between white / black background line 249*/}
            <div className="page-top_svg_div">
                    <div onClick={() => changeBackground(setBackground)}>
                    <svg>
                        {document.body.style.backgroundColor === "rgb(253, 253, 253)" ? whiteBackground[0] : blackBackground[0]}
                    </svg>
                    <svg>
                        {document.body.style.backgroundColor === "rgb(253, 253, 253)" ? whiteBackground[1] : blackBackground[1]}
                    </svg>
                </div>
                <div className="page-top_user_div" onClick={() => checkIfUserIsLogged(setUserIsLogged)}>
                    <img src={ProfilePicture} alt="Profile"/>
                </div>
            </div>
        </div>

        <hr className="page-divide_hr"></hr>
        <div className="page-content">
            <div className="page-left_side">
                <table className="calendar-table">
                    <thead>
                        <tr>
                            <th className="calendar-table_month" colSpan="4">{initialMonthName}</th>
                            <th colSpan="1">{initialYearNumber}</th>
                                <th className="calendar-table_arrow" onClick={() => {
                                    displayInitial !== "displayyear" ?
                                        changeToPreviousMonth(setMonthName, setMonthNumber, setYearNumber, initialMonthNumber, monthsOfTheYearArray, initialYearNumber) :
                                        setYearNumber(initialYearNumber - 1);
                                }}>&larr;</th>
                                <th className="calendar-table_arrow" onClick={() => {
                                    displayInitial !== "displayyear" ?
                                        changeToNextMonth(setMonthName, setMonthNumber, setYearNumber, initialMonthNumber, monthsOfTheYearArray, initialYearNumber) :
                                        setYearNumber(initialYearNumber + 1);
                                }}>&rarr;</th>
                        </tr>
                        <tr>
                            {namesOfTheDays}
                        </tr>
                    </thead>
                    <tbody className="calendar-table_body">
                        <tr>{monthRowsObject.firstRow}</tr>
                        <tr>{monthRowsObject.secondRow}</tr>
                        <tr>{monthRowsObject.thirdRow}</tr>
                        <tr>{monthRowsObject.fourthRow}</tr>
                        <tr>{monthRowsObject.fifthRow}</tr>
                        <tr>{monthRowsObject.sixthRow}</tr>
                    </tbody>
                </table>
                <div>
                    <button className="create-switch_button" onClick={() => { setNewTask(true) }}>Create a new Plan</button>
                    <button className="create-switch_button">Other Overlays</button>
                </div>
            </div>
            {displayInitial === "displayweek" && <WeekContent initialWeek={initialWeek} initialPublicHoliday={initialPublicHoliday} />}
            {displayInitial === "displaymonth" && <MonthContent monthRowsObject={monthRowsObject} namesOfTheDays={namesOfTheDays} setDisplayDifferent={setDisplayDifferent} setDifferentWeek={setDifferentWeek} />}
            {displayInitial === "displayyear" && <YearContent daysOfTheWeekArray={daysOfTheWeekArray} monthsOfTheYearArray={monthsOfTheYearArray} numberOfDaysInMonthArray={numberOfDaysInMonthArray} initialYearNumber={initialYearNumber} />}
        </div>
        </>
    )
}
export default Calendar