import React, { useRef, useState, useMemo, useEffect } from 'react';
import './App.scss';
import DisplayUI from './DisplayComponents';
import ProfilePicture from './assets/profile-picture.svg';
import Addtask from './Addtask';

// Top of the page
export function Calendar() {

    // If storage exists, leave it be, if not change null to empty string, otherwise searchAlgorithm function will produce an error running .include() on null 
    localStorage.getItem("TaskDetails") === null && localStorage.setItem("TaskDetails", "");
    localStorage.getItem("Date") === null && localStorage.setItem("Date", "");
    localStorage.getItem("Tasks") === null && localStorage.setItem("Tasks", "");

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
            monthRowsObject.firstRow.push(<td className="calendar-table_previousM" key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.firstRow) }}>{previousMonthDates}</td>);
            previousMonthDates++;
        }
    }
    function createDatesThisMonth(from, number, row) {
        for (let i = from; i < number; i++) {
            dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
            row.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(row) }}>{dateCounter}</td>);
            dateCounter++;
        }
    }
    function createDatesNextMonth(from, number, row) {
        for (let i = from; i < number; i++) {
            dateUsedAsKey = nextYearString + "-" + nextMonth + "-" + dateOfNextMonth;
            row.push(<td className="calendar-table_nextM" key={dateUsedAsKey} onClick={() => { setDifferentWeek(row); }}>{dateOfNextMonth}</td>);
            dateOfNextMonth++;
        }
    }

    // Here I am getting the today's date and finding it in the array of all arrays (rows) so that I can display the week (array) its in
    const getInitialWeek = () => {
        const todaysDate = currentDate.getDate();

        // If this condition is met, then I know that the date is in the first 3 rows
        if (Number(monthRowsObject.thirdRow[6].key.split("-")[2]) >= todaysDate) { 
            if (Number(monthRowsObject.secondRow[6].key.split("-")[2]) < todaysDate) { 
                return monthRowsObject.thirdRow;

            } else if (Number(monthRowsObject.firstRow[0].key.split("-")[2]) < Number(monthRowsObject.firstRow[6].key.split("-")[2]) ||
                Number(monthRowsObject.secondRow[0].key.split("-")[2]) <= todaysDate) {

                return monthRowsObject.secondRow;
            } else {
                return monthRowsObject.firstRow;
            }
        } else {
            if (Number(monthRowsObject.fifthRow[0].key.split("-")[2]) > todaysDate) { 
                return monthRowsObject.fourthRow;

            } else if (Number(monthRowsObject.sixthRow[0].key.split("-")[2]) < Number(monthRowsObject.sixthRow[6].key.split("-")[2]) ||
                Number(monthRowsObject.fifthRow[6].key.split("-")[2]) >= todaysDate) {

                // Here is the logic: if the first element in the row is LOWER than the last one, it means the month has ended on the previous one 
                // If it wouldnt have ended, the first element will belong to the current month and therefore will be bigger 
                return monthRowsObject.fifthRow;
            } else {
                return monthRowsObject.sixthRow;
            }
        }
    }

    // Using the second State to preserve the initialWeek even if it gets updated, so that the user can back to it
    const [initialWeek, setDifferentWeek] = useState(getInitialWeek);
    const [preserveInitial, setDontUse] = useState(initialWeek);

    // These are states which I use to display the week as initial and then to change the body depending on what the user wants to display
    const [displayInitial, setDisplayDifferent] = useState("displayweek");
    const [preservedisplay, setDisplayback] = useState(displayInitial);

    // *Below are 2 functions for arrows - 2 onClicks*

    // Change to the previous month and update the element
    const changeToPreviousMonth = () => {
        if (initialMonthNumber === 0) {
            setMonthName(monthsOfTheYearArray[initialMonthNumber + 11]);
            setMonthNumber(11);
            setYearNumber(initialYearNumber - 1);
        } else {
            setMonthName(monthsOfTheYearArray[initialMonthNumber - 1]);
            setMonthNumber(initialMonthNumber - 1);
        }
    }

    // Change to the next month and update the element
    const changeToNextMonth = () => {
        if (initialMonthNumber === 11) {
            setMonthName(monthsOfTheYearArray[initialMonthNumber - 11]);
            setMonthNumber(0);
            setYearNumber(initialYearNumber + 1);
        } else {
            setMonthName(monthsOfTheYearArray[initialMonthNumber + 1]);
            setMonthNumber(initialMonthNumber + 1);
        }
    }

    // State to decide if Login component should render or not
    const [userNotLogged, setUserIsLogged] = useState(false);

    // If user has already logged in, cookie with the name "name" is present therefore I dont need to log the user again
    const checkIfUserIsLogged = () => {
        if (document.cookie.includes("name")) {
            alert("You are logged in.");
            return
        } else {
            setUserIsLogged(true);
        }
    }

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

    // this just changes the background from white to black 
    const changeBackground = () => {
        if (document.body.style.backgroundColor === "rgb(253, 253, 253)") {
            document.body.style.backgroundColor = "#181818";
            document.body.style.color = "#FDFDFD";
            localStorage.setItem("Background", "background=#181818");
            setBackground("B");

        } else {
            document.body.style.backgroundColor = "#FDFDFD";
            document.body.style.color = "#181818";
            localStorage.setItem("Background", "background=#FDFDFD");
            setBackground("W");

        }
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

    function searchAlgorithm(e) {   

        // Preventing the form to refresh on submit
        e.preventDefault();

        // Gathering data from entries and pushing it into an object
        const formInput = e.target;
        const formData = new FormData(formInput);
        const searchObject = Object.fromEntries(formData.entries());

        // Cleansing the input off of blank spaces
        searchObject.input = searchObject.input.trim();

        // Condition to catch if the user would try to remove minLength from the client side, or would input less characters
        if (searchObject.input.length <= 2) {
            alert("Please enter at least 3 symbols");
            const searchInput = document.getElementById("page-top_input").value = "";
            return
        }
        if (localStorage.getItem("TaskDetails") === "") {
            alert("There are no plans");
            const searchInput = document.getElementById("page-top_input").value = "";
            return
        }
        const localTaskDetailsArray = JSON.parse(localStorage.getItem("TaskDetails"));

        // Check if the storage has a plan with the given input
        if (localTaskDetailsArray.join(" ").includes(searchObject.input)) {

            const localDateArray = localStorage.getItem("Date").split("_");
            let detailIndex;
            let extractedDate, extractedMonth, extractedYear, extractedDay;
            let createKey;
            let endOfMonth;
            let p = 0;
            const displayDetails = [];
            const extractedDateArray = [];

            for (let i = 0; i !== -1; i++) {
                // Recursion loop for scanning elements for hits - if includes returns true
                for (let s = 0; s !== -1;) {
                    if (localTaskDetailsArray[s].includes(searchObject.input)) {
                        detailIndex = s;
                        s= -1;
                    } else {
                        s++;
                    }
                }

                // I always want to display the title of the plan and its corresponding date, but hits can come from description as well
                // Logic: if hit came from title aka, indexes 0,2,4.. the date can be found using the condition below, since there are 2 elements in TaskDetails and 1 in Date
                if (detailIndex % 2 === 0) {

                    // Hit is in the title, to get the date I just need to divide the index 
                    extractedDate = localDateArray[detailIndex / 2];
                    searchInputDisplay(extractedDate, detailIndex);

                    // Shortening the Array for the next loop, +2 because I am splicing out the title AND the description of that one particular plan
                    localTaskDetailsArray.splice(0, detailIndex + 2);
                    // For every 2 elements in TaskDetails, there is one in Date, therefore I need to divide the index and add 1 to include that element as well
                    localDateArray.splice(0, detailIndex / 2 + 1);

                } else {

                    // Hit is in the description, I need to jump to title element and divide by 2 to get the equivalent Date
                    extractedDate = localDateArray[(detailIndex - 1) / 2];
                    searchInputDisplay(extractedDate, detailIndex - 1);

                    // Shortening the Array for the next loop, +1 because splice(0,1) slices out 1 element, so to include it, I need to add 1 to the index
                    localTaskDetailsArray.splice(0, detailIndex + 1);
                    // For every 2 elements in TaskDetails, there is one in Date, I am jumping to title, dividing it and adding one to include the description element
                    localDateArray.splice(0, (detailIndex - 1) / 2 + 1); 
                }
                function searchInputDisplay(extractedDate, index) {

                    const dateArray = extractedDate.split("-");
                    // I need to store the values for each individual hit, because otherwise when the button is clicked it would apply all the values from the latest loop
                    // I also created a button with an ID corresponding to the loop i variable so that it matches the passed values in the array
                    extractedDateArray.push(...dateArray);
                    displayDetails.push(<div className="search-div_plan_creation" key={p++}>
                        <h3>{dateArray[2] + "." + dateArray[1]}</h3>
                        <p>{localTaskDetailsArray[index]}</p>
                        <button id={i} onClick={(e) => { showTheWeek(e.target.id) }}>Show me</button>
                    </div>)
                }
                function showTheWeek(id) {

                    // here I am rewriting the values from the last hit to the one I have stored for the button by his ID
                    extractedDay = Number(extractedDateArray[id * 3 + 2]);
                    extractedMonth = Number(extractedDateArray[id * 3 + 1]);
                    extractedYear = Number(extractedDateArray[id * 3]);
                    const replaceDaterow = [];

                    // Just checking if its leap year, otherwise its not essential to change February
                    endOfMonth = numberOfDaysInMonthArray[extractedMonth - 1];
                    if (endOfMonth == 28 && extractedYear % 4 == 0) {
                        endOfMonth = 29;
                    }
                    // Setting states to re-render the calendar and "jump" from one month or even year if necessary
                    setYearNumber(extractedYear);
                    setMonthNumber(extractedMonth - 1);
                    setMonthName(monthsOfTheYearArray[extractedMonth - 1]);

                    // Here I am looking at the day the month starts, since JS week starts with Sunday, I need to adjust it accordingly to mine
                    const adjustDate = new Date();
                    adjustDate.setFullYear(extractedYear, extractedMonth - 1, 1);
                    const day = adjustDate.getDay() === 0 ? 6 : adjustDate.getDay() - 1;

                    // The idea here is that, no matter on which day the month starts, carrying whatever number I can filter the date into a corresponding row
                    // Depending on which row it is, I can also see if that row is going to be fully packed with dates of the month or, if perhaps dates from different months will mix
                    if (1 <= extractedDay && extractedDay <= (7 - day)) {
                        createRow(1, 7 - day)

                    } else if ((7 - day + 1) <= extractedDay && extractedDay <= (14 - day)) {
                        createRow(7 - day + 1, 14 - day);

                    } else if ((14 - day + 1) <= extractedDay && extractedDay <= (21 - day)) {
                        createRow(14 - day + 1, 21 - day);

                    } else if ((21 - day + 1) <= extractedDay && extractedDay <= (28 - day)) {
                        createRow(21 - day + 1, 28 - day);

                    // Here I need to extra check whether the length of the array isnt more than 7, this could happen for cases when day = 5,6 creating array of 8 or 9th elements
                    } else if ((28 - day + 1) <= extractedDay && extractedDay <= endOfMonth && endOfMonth - (28 - day + 1) <= 7) {
                        createRow(28 - day + 1, endOfMonth);

                    // This one takes care of that special case mentioned above
                    } else if ((35 - day + 1) <= extractedDay && extractedDay <= endOfMonth) {
                        createRow(35 - day + 1, endOfMonth);
                    }
                    function createRow(start, end) {

                        // If the plan's week is within the month's dates - from start to end, I will just fill it with dates of the month
                        if (start + 6 - end === 0) {
                            for (let i = start; start <= end; start++) {
                                createKey = extractedYear + "-" + extractedMonth + "-" + start;
                                replaceDaterow.push(<td key={createKey}>{start}</td>);
                            }
                            // if the plan's week is NOT within the month's dates only, then I have to fill only a specific amount of dates of the month
                        } else {
                            for (let i = start; start <= end; start++) {
                                createKey = extractedYear + "-" + extractedMonth + "-" + start;
                                replaceDaterow.push(<td key={createKey}>{start}</td>);
                            }
                        }

                        // If the plan's week is in the first row - dates of that month mixes with the previous month
                        let replaceDaterowNumber = replaceDaterow.length;
                        if (replaceDaterow[replaceDaterowNumber - 1].key.split("-")[2] < 8) {

                            // -1 because I subtracted -1 already to get the elements position in the numberOfDaysInMonthArray array, now I need the previous one
                            endOfMonth = extractedMonth - 1 === 0 ? numberOfDaysInMonthArray[extractedMonth + 11] : numberOfDaysInMonthArray[extractedMonth - 1];

                            // If we're in January, we're at the end of the array, to get Dec, I need to update the number to 12 and subtract 1 from year
                            if (extractedMonth === 1) {
                                extractedMonth = 12;
                                extractedYear--;
                            }
                            // Filling the array of dates from previous month
                            for (let i = replaceDaterowNumber; i < 7; i++) {
                                createKey = extractedYear + "-" + extractedMonth + "-" + endOfMonth;
                                replaceDaterow.unshift(<td key={createKey}>{endOfMonth}</td>);
                                endOfMonth--;
                            }
                         // if the plan's week is in the later rows (5th, 6th) - dates mixes with the next month
                        } else {
                            // +2 because I already subtracted -1 when I reached the numberOfDaysInMonthArray array
                            extractedMonth = extractedMonth + 1 === 13 ? 1 : extractedMonth + 1;
                            extractedYear = extractedMonth === 1 ? extractedYear + 1 : extractedYear;
                            let date = 1;

                            for (let i = replaceDaterowNumber; i < 7; i++) {
                                createKey = extractedYear + "-" + extractedMonth + "-" + date;
                                replaceDaterow.push(<td key={createKey}>{date}</td>);
                                date++;
                            }
                        }
                        // Updating the state of passed array - calendarContext
                        setDifferentWeek(replaceDaterow);
                    }
                }
                // Here I will look at the sliced out array and look if there are any more hits, if true the loop will continue
                if (localTaskDetailsArray.join("-").includes(searchObject.input)) {

                } else {
                    // If there are no more hits, loop ends, results are displayed and search input is cleaned
                    const searchInput = document.getElementById("page-top_input").value = "";
                    searchResult.current = displayDetails;
                    setSearch(true);
                    return
                }
            }
        } else {
            // If no results are found, empty out the input, return a message
            const searchInput = document.getElementById("page-top_input").value = "";
            searchResult.current = "There are no results for your search.";
            setSearch(true);
        }
    }

    return (
        <>
        {initialSearch === true && <SearchUserInput setSearch={setSearch} searchResult={searchResult.current} />}
        {initialAddTask === true && <Addtask setNewTask={setNewTask} getHourAndDay={getHourAndDay} />}
        {userNotLogged === true && <Login dontDisplayUI={setUserIsLogged} /> }

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
                    <li><button onClick={() => {setDisplayDifferent(preservedisplay) } }>Week</button></li>
                    <li><button onClick={() => {setDisplayDifferent("displaymonth") } }>Month</button></li>
                    <li><button onClick={() => {setDisplayDifferent("displayyear") } }>Year</button></li>
                </ul>
            </div>

            <form onSubmit={searchAlgorithm} method="post">
                <input id="page-top_input" type="search" placeholder="Search for.." name="input" minLength="3" maxLength="15"></input>
                <button className="page-top_search_button" type="submit">Search</button>
            </form>

            {/*Icon for a change between white / black background line 249*/}
            <div className="page-top_svg_div">
                <div onClick={changeBackground}>
                    <svg>
                        {document.body.style.backgroundColor === "rgb(253, 253, 253)" ? whiteBackground[0] : blackBackground[0]}
                    </svg>
                    <svg>
                        {document.body.style.backgroundColor === "rgb(253, 253, 253)" ? whiteBackground[1] : blackBackground[1]}
                    </svg>
                </div>
                <div className="page-top_user_div" onClick={checkIfUserIsLogged}>
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
                            <th className="calendar-table_arrow" onClick={changeToPreviousMonth}>&larr;</th>
                            <th className="calendar-table_arrow" onClick={changeToNextMonth}>&rarr;</th>
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
            <DisplayUI displayInitial={displayInitial}
                initialWeek={initialWeek}

                monthRowsObject={monthRowsObject} namesOfTheDays={namesOfTheDays} setDisplayDifferent={setDisplayDifferent} setDifferentWeek={setDifferentWeek} 
                    
                daysOfTheWeekArray={daysOfTheWeekArray} monthsOfTheYearArray={monthsOfTheYearArray}
                numberOfDaysInMonthArray={numberOfDaysInMonthArray} initialYearNumber={initialYearNumber} />
        </div>
        </>
    )
}
export default Calendar

function Login(props) {
    function checkUserInput(e) {

        // Preventing the form to refresh on submit
        e.preventDefault(); 

        // Gathering data from entries and pushing it into an object
        const form = e.target; 
        const formData = new FormData(form); 
        const formJson = Object.fromEntries(formData.entries()); 

        // I wanted to allow special characters like èìøšáøíé etc. "^\\pL+$" is from the XRegExp lib
        const regex = /["^\\pL+$"\s\d\(^\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\;\:\"\\\/\<\>\?\.\,\°\´)]/g;
        formJson.name = formJson.name.replace(regex, "");

        // This works in 2 ways, first to catch if user gave invalid input, and also if user removed "required" from ´their client side
        if (formJson.name == "") {
            alert("Please enter a name");
            return
        }

        // Here I am setting the cookie and destroying the component 
        setCookie(formJson.name);
        props.dontDisplayUI(false);
    }

    return (
        <>
            <div className="login-div_background" onClick={() => { props.dontDisplayUI(false) }}></div>
            <div className="login-div">
                <div>
                    <button className="login-div_cancel" onClick={() => { props.dontDisplayUI(false) }}>X</button>
                    <img src={ProfilePicture} className="login-div_profile_pic"></img>
                </div>
                <h2>Sign up:</h2>
                <form method="post" onSubmit={checkUserInput}>
                    <label htmlFor="login-div_username">Name: </label>
                    <input id="login-div_username" name="name" type="text" required maxLength="20" placeholder="..."></input>
                    <label htmlFor="login-div_password">Password: </label>
                    <input id="login-div_password" name="password" type="password" required maxLength="40" placeholder="..."></input>
                    <br/>
                    <button className="login-div-register" type="submit">Submit my registration!</button>
                </form>
                <br/>
            </div>
        </>
    )
}

function setCookie(cvalue) {

    // Expiration time is set to one year
    const dateToChange = new Date();
    dateToChange.setTime(dateToChange.getTime() + (24 * 60 * 60 * 1000 ));
    let expire = "expires=" + dateToChange.toDateString();
    document.cookie = "Name=" + cvalue + "_;_" + expire + ";path=/";
}


function SearchUserInput(props) {

    return (
        <>
            <div className="search-div">
                <button className="search-div_cancel" onClick={() => { props.setSearch(false) }}>X</button>
                <h2>Search results:</h2>
                <div className="search-div_results">{props.searchResult}</div>
                <button className="search-div_hide_button" onClick={() => { props.setSearch(false) }}>Hide the search results!</button>
            </div>
        </>
    )
}