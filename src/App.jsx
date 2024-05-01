import React, { useRef, useState, useMemo } from 'react';
import './App.css';
import DisplayUI from './DisplayComponents';
import ProfilePicture from './assets/profile-picture.svg';
import Addtask from './Addtask';

// Top of the page
export function Calendar() {

    // if storage exists, leave it be, if not change null to empty string, otherwise searchAlgorithm function will produce an error running .include() on null 
    localStorage.setItem("TaskDetails", localStorage.getItem("TaskDetails") == null ? "" : localStorage.getItem("TaskDetails"));
    localStorage.setItem("Date", localStorage.getItem("Date") == null ? "" : localStorage.getItem("Date"));
    localStorage.setItem("Cookies", localStorage.getItem("Cookies") == null ? "" : localStorage.getItem("Cookies"));

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
    if (initialYearNumber % 4 === 0) {
        numberOfDaysInMonthArray[1] = 29;
    }

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
    if (previousMonth === 0) {
        previousMonth = 12;
    }
    let currentMonth = initialMonthNumber + 1;

    // iterator variables
    let dateUsedAsKey;
    let previousMonthDates;

    // Date counter of the first day of month to be rendered
    let dateCounter = 1; 

    // Here is the solution to the first row of the calendar, where JS gives Sunday 0 as its according to JS the start of the week
    // Since the workweek is Mo-Su, I need to check which day is the starting day of the month and get the dates of the previous month to fill out the rest of the row

    // Condition if the month starts on Sunday
    if (firstDayNumber === 0) { 

        // Ex. 31 dates are in previous month 31 - 5 is 26 but starting from 26 to 31, there are 6 numbers, thats why i < 6, it starts at 0
        previousMonthDates = numberOfDaysInMonthArray[previousMonthNumber] - 5;
        for (let i = 0; i < 6; i++) {
            dateUsedAsKey = previousYear + "-" + previousMonth + "-" + previousMonthDates;
            monthRowsObject.firstRow.push(<td className="previousmonth" key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.firstRow) }}>{previousMonthDates}</td>);
            previousMonthDates++;
        }
        // To the 6 dates from previous month, I need to add 1 from the month to be displayed
        dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
        monthRowsObject.firstRow.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.firstRow) }}>{dateCounter}</td>);
        dateCounter++;

    // Condition if the month starts on Monday
    } else if (firstDayNumber === 1) { 

        // Ex. 31 dates are in previous month 31 - 6 is 25 but starting from 25 to 31, there are 7 numbers, therefore the whole first row 
        previousMonthDates = numberOfDaysInMonthArray[previousMonthNumber] - 6;
        for (let i = 0; i < 7; i++) {
            dateUsedAsKey = previousYear + "-" + previousMonth + "-" + previousMonthDates;
            monthRowsObject.firstRow.push(<td className="previousmonth" key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.firstRow) }}>{previousMonthDates}</td>);
            previousMonthDates++;
        }

    // Solution for the rest of the week
    } else { 

        // Ex. 31 dates are in previous month 31 - 4 + 2 = 29, therefore 3 numbers, +2 because I omitted 2 cases, Mo and Su
        previousMonthDates = numberOfDaysInMonthArray[previousMonthNumber] - firstDayNumber + 2;
        for (let i = 0; i < firstDayNumber - 1; i++) {
            dateUsedAsKey = previousYear + "-" + previousMonth + "-" + previousMonthDates;
            monthRowsObject.firstRow.push(<td className="previousmonth" key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.firstRow) }}>{previousMonthDates}</td>);
            previousMonthDates++;
        }

        //  i starts at 0, therefore range from 0 to 8 is 9 numbers, because I added 2 before
        for (let i = 0; i < 8 - firstDayNumber; i++) {
            dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
            monthRowsObject.firstRow.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.firstRow) }}>{dateCounter}</td>);
            dateCounter++;
        }
    }
    
    // I need to add onClick event to all other dates so that the user can switch weeks simply by just clicking on a date 
    for (let i = 0; i < 7; i++) {
        dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
        monthRowsObject.secondRow.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.secondRow) }}>{dateCounter}</td>);
        dateCounter++;
    }
    for (let i = 0; i < 7; i++) {
        dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
        monthRowsObject.thirdRow.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.thirdRow) }}>{dateCounter}</td>);
        dateCounter++;
    }
    for (let i = 0; i < 7; i++) {
        dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
        monthRowsObject.fourthRow.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.fourthRow) }}>{dateCounter}</td>);
        dateCounter++;
    }

    // First 4 rows are guaranteed to be filled, now I need to check if the month ends in 5th or 6th row and fill it with dates respectively
    if (numberOfDaysInMonth - dateCounter >= 7) { 
        for (let i = 0; i < 7; i++) {
            dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
            monthRowsObject.fifthRow.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.fifthRow) }}>{dateCounter}</td>);
            dateCounter++;
        }
        for (; dateCounter <= numberOfDaysInMonth; dateCounter++) {
            dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
            monthRowsObject.sixthRow.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.sixthRow) }}>{dateCounter}</td>);
        }
    } else {
        for (; dateCounter <= numberOfDaysInMonth; dateCounter++) {
            dateUsedAsKey = initialYearNumber + "-" + currentMonth + "-" + dateCounter;
            monthRowsObject.fifthRow.push(<td key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.fifthRow) }}>{dateCounter}</td>);
        }
    }

    // Ex. April - initialMonthNumber would return 3, so to get the next month - May I need to add 2
    let nextMonth = initialMonthNumber + 2;
    if (nextMonth === 13) {
        nextMonth = 1;
    }

    // Filling 5th and 6th arrays so that both contain 7 elements
    let dateOfNextMonth = 1;
    let numberOfDatesFifthRow = monthRowsObject.fifthRow.length;
    let numberOfDatesSixthRow = monthRowsObject.sixthRow.length;

    // When I update month to January I also need to up the year parameter
    let nextYearString = initialYearNumber;
    if (nextMonth === 1) {
        nextYearString = initialYearNumber + 1;
    }

    // If there is less elements in the 5th array than 7 fill it out with the dates of the next month
    for (; numberOfDatesFifthRow < 7; numberOfDatesFifthRow++) {
        dateUsedAsKey = nextYearString + "-" + nextMonth + "-" + dateOfNextMonth;
        monthRowsObject.fifthRow.push(<td className="nextmonth" key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.fifthRow); }}>{dateOfNextMonth}</td>);
        dateOfNextMonth++;
    }

    // And then fill out whole 6th array with the dates of the next month
    for (; numberOfDatesSixthRow < 7; numberOfDatesSixthRow++) { 
        dateUsedAsKey = nextYearString + "-" + nextMonth + "-" + dateOfNextMonth;
        monthRowsObject.sixthRow.push(<td className="nextmonth" key={dateUsedAsKey} onClick={() => { setDifferentWeek(monthRowsObject.sixthRow); }}>{dateOfNextMonth}</td>);
        dateOfNextMonth++;
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
    };

    // Using the second State to preserve the initialWeek even if it gets updated, so that the user can back to it
    const [initialWeek, setDifferentWeek] = useState(getInitialWeek);
    const [preserveInitial, setDontUse] = useState(initialWeek);
    console.log(initialWeek)
    // These are states which I use to display the week as initial and then to change the body depending on what the user wants to display
    const [displayinitial, setDisplayDifferent] = useState("displayweek");
    const [preservedisplay, setDisplayback] = useState(displayinitial);

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
    };

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
    };

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
    };

    // This is the default setting for the user I want to hold this setting so that it doesnt go back to normal when the site refreshes
    if (localStorage.getItem("Background") === null || localStorage.getItem("Background") === "background=#FDFDFD") {
        document.body.style.backgroundColor = "#FDFDFD";
        document.body.style.color = "#181818";
        localStorage.setItem("Background", "background=#FDFDFD");
    } else {
        document.body.style.backgroundColor = "#181818";
        document.body.style.color = "#FDFDFD";
        localStorage.setItem("Background", "background=#181818");
    };

    // this just changes the background from white to black 
    const changeBackground = () => {
        if (document.body.style.backgroundColor === "rgb(253, 253, 253)") {
            document.body.style.backgroundColor = "#181818";
            document.body.style.color = "#FDFDFD";
            localStorage.setItem("Background", "background=#181818");
        } else {
            document.body.style.backgroundColor = "#FDFDFD";
            document.body.style.color = "#181818";
            localStorage.setItem("Background", "background=#FDFDFD");
        }
    };
    // DEV NOTE - HERE REFRACTURING ENDED
    // states for the appearance and disappearance of Addtask component and passing todays date + current hour to it as a default value
    const [initialAddTask, setNewTask] = useState(false);
    const adjustMonth = currentDate.getMonth() + 1;
    const getHourAndDay = currentDate.getHours() + 10 + "" + currentDate.getFullYear() + ((adjustMonth.toString().length === 1) ? "0" + adjustMonth : adjustMonth) + currentDate.getDate();

    // states for the apperance and disappearance of SearchUserInput component
    const [initialSearch, setSearch] = useState(false);

    // useRef to hold the corresponding values for each task
    const searchResult = useRef();
    const [renderId, setRenderId] = useState("");
    function searchAlgorithm(e) {   

        // Preventing the form to refresh on submit
        e.preventDefault();

        // Gathering data from entries and pushing it into an object
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        // cleansing the input of a character I use and of blank spaces
        const inputByUser = formJson.input.trim().replace(/[_]/g, "");

        // in case the user would manually remove minLength, there is still the condition
        if (inputByUser.length <= 2) {
            alert("Please enter at least 3 accepted letters");
            const searchInput = document.getElementById("searchinput").value = "";
            return
        }

        // check if the storage has a plan with the given input
        if (localStorage.getItem("TaskDetails").includes(inputByUser)) {

            // dateArray stores the dates = keys that are used in the YYYYMMDD format
            let dateArray = localStorage.getItem("Date").split("___");
            // arrayDetails stores the title and description 
            let arrayDetails = localStorage.getItem("TaskDetails").split("___"); 
            let detailIndex;
            let slicedDate, slicedMonth, slicedYear, slicedDay;
            let createkey;
            let endOfMonth;
            let p = 0;
            let displayDetails = [];
            let replaceDaterow = [];
            const slicedDateArray = [];
            const slicedMonthArray = [];
            const slicedYearArray = [];
            const slicedDayArray = [];

            for (let i = 0; i !== -1; i++) {

                // Loop through each element in an array and scan it for hits, have to go back to string to not be dependent on words starting with input
                for (let s = 0; s !== -1;) {
                    if (arrayDetails[s].toString().includes(inputByUser)) {
                        detailIndex = s;
                        s= -1;
                    } else {
                        s++;
                    }
                }

                // This function sets up hits with dates and titles and buttons
                function searchInputDisplay(thedate, index) {

                    slicedDate = thedate;
                    // slice out the Month and check if it starts with 0 or not, if yes slice only the number behind it and remove -1 so that I can get a number of days from the same named array
                    slicedMonth = slicedDate[4] == 0 ? Number(slicedDate[5]) - 1 : Number(slicedDate.slice(4, 6)) - 1;
                    slicedYear = Number(slicedDate.slice(0, 4));
                    slicedDay = slicedDate.slice(6);

                    // I need to store the values for each individual hit, because otherwise when the button is clicked it will apply all values from the latest hit
                    // I also created a button with an ID corresponding to the loop i variable so that it matches the passed values in the arrays below
                    slicedDateArray.push(slicedDate);
                    slicedMonthArray.push(slicedMonth);
                    slicedYearArray.push(slicedYear);
                    slicedDayArray.push(slicedDay);
                    displayDetails.push(<div className="searchResult" key={p++}>
                        <h3 className="searchH2">{slicedDay + "." + (slicedDate[4] == 0 ? slicedDate[5] : slicedDate.slice(4, 6))}</h3>
                        <p>{arrayDetails[index]}</p>
                        <button id={i} onClick={(e) => { showTheWeek(e.target.id) }}>Display</button></div>)
                };

                function showTheWeek(id) {

                    // here I am rewriting the values from the last hit to the one I have stored for the button by his ID
                    slicedDate = slicedDateArray[id];
                    slicedMonth = slicedMonthArray[id];
                    slicedYear = slicedYearArray[id];
                    slicedDay = slicedDayArray[id];

                    // Just checking if its leap year, otherwise its not essential to change February
                    endOfMonth = numberOfDaysInMonthArray[slicedMonth];
                    if (endOfMonth == 28 && Number(slicedDate[0, 4]) % 4 == 0) {
                        endOfMonth = 29;
                    }
                    // setting states to re-render the calendar and "jump" from one month or even year if necessary
                    setYearNumber(slicedYear);
                    setMonthNumber(slicedMonth);
                    setMonthName( monthsOfTheYearArray[slicedMonth]);

                    // I need to splice the Daterow, otherwise it will keep on growing every single time someone clicks the button
                    replaceDaterow.splice(0, 7);
                    const d = new Date();
                    d.setFullYear(slicedYear, slicedMonth, 1);
                    // Here I am looking at the day the month starts, since JS week starts with Sunday, I need to adjust it accordingly to mine
                    const day = d.getDay() == 0 ? 6 : d.getDay() - 1;

                    // The idea here is that, no matter on which day the month starts, carrying whatever number I can filter the date into a corresponding row
                    // Depending on which row it is, I can also see if that row is going to be fully packed with dates of the month or, if perhaps dates from different months will mix
                    if (1 <= slicedDay && slicedDay <= (7 - day)) {
                        createRow(1, 7 - day)

                    } else if ((7 - day + 1) <= slicedDay && slicedDay <= (14 - day)) {
                        createRow(7 - day + 1, 14 - day);

                    } else if ((14 - day + 1) <= slicedDay && slicedDay <= (21 - day)) {
                        createRow(14 - day + 1, 21 - day);

                    } else if ((21 - day + 1) <= slicedDay && slicedDay <= (28 - day)) {
                        createRow(21 - day + 1, 28 - day);

                    // Here I need to extra check whether the length of the array isnt more than 7, this could happen for cases when day = 5,6 creating array of 8 or 9th elements
                    } else if ((28 - day + 1) <= slicedDay && slicedDay <= endOfMonth && endOfMonth - (28 - day + 1) <= 7) {
                        createRow(28 - day + 1, endOfMonth);

                    // This one takes care of that special case mentioned above
                    } else if ((35 - day + 1) <= slicedDay && slicedDay <= endOfMonth) {
                        createRow(35 - day + 1, endOfMonth);
                    }
                    function createRow(start, end) {

                        // if the plan's week is within the month's dates - from start to end, I will just fill it with dates of the month
                        if (start + 6 - end == 0) {
                            for (let i = start; start <= end; start++) {
                                createkey = slicedDate.slice(0, 6) + start;
                                replaceDaterow.push(<td key={createkey}>{start}</td>);
                            }
                            // if the plan's week is NOT within the month's dates only, then I have to fill only a specific amount of dates of the month
                        } else {
                            for (let i = start; start <= end; start++) {
                                createkey = slicedDate.slice(0, 6) + start;
                                replaceDaterow.push(<td key={createkey}>{start}</td>);
                            }
                        }

                        // if the plan's week is in the first row - dates of that month mixes with the previous month
                        let replaceDaterowNumber = replaceDaterow.length;
                        if (replaceDaterow[replaceDaterowNumber - 1].key.slice(6) < 8) {

                            // -1 because I subtracted -1 already to get the elements position in the numberOfDaysInMonthArray array, now I need the previous one
                            endOfMonth = slicedMonth - 1 == -1 ? numberOfDaysInMonthArray[slicedMonth + 11] : numberOfDaysInMonthArray[slicedMonth - 1];

                            // if slicedMonth is equal to 0 it means that we're in January, and the next month is Dec, therefore the key will bear 12 as month, and year will decrease
                            if (slicedMonth == 0) {
                                slicedMonth = 12;
                                slicedYear--;
                            }
                            // checking if the length is 1 if not I need to add 0 because the general way the keys are desined are with 2 digits for months
                            if (slicedMonth.toString().length == 1) {
                                slicedMonth = "0" + slicedMonth;
                            }
                            // Check how many dates are needed to be filled, then fill them using unshift until the length is equal to 7
                            for (let i = replaceDaterowNumber; i < 7; i++) {
                                createkey = "" + slicedYear + slicedMonth + endOfMonth;
                                replaceDaterow.unshift(<td key={createkey}>{endOfMonth}</td>);
                                endOfMonth--;
                            }
                            // if the plan's week is in the later rows (5th, 6th) - dates mixes with the next month
                        } else {
                            // +2 because I already subtracted -1 when I reached the numberOfDaysInMonthArray array
                            slicedMonth = slicedMonth + 2 == 13 ? 1 : slicedMonth + 2;
                            slicedYear = slicedMonth == 1 ? slicedYear + 1 : slicedYear;
                            slicedMonth = slicedMonth.toString().length == 1 ? "0" + slicedMonth : slicedMonth;
                            let date = 1;

                            for (let i = replaceDaterowNumber; i < 7; i++) {
                                createkey = "" + slicedYear + slicedMonth + date;
                                replaceDaterow.push(<td key={createkey}>{date}</td>);
                                date++;
                            }
                        }
                        // updating the state of passed array - calendarContext and updating state to cause rerender
                        setDifferentWeek(replaceDaterow);
                        setRenderId(id);
                    }
                }
                
                // I always want to display the title of the plan, since description is not required - therefore when I get an index of an element 
                // And with that index I want to jump from description to plan index, or not move if the index points at the title one
                if (detailIndex % 2 !== 0) {

                    // hit is in the description, I need to jump to title element and divide by 2 to get the equivalent Date in dateArray
                    slicedDate = dateArray[(detailIndex - 1) / 2];

                    searchInputDisplay(slicedDate, detailIndex - 1);

                    // after the function calculated all variables I need it to, I have to slice out used elements to run the loop again
                    // the +1 is necessary because detailIndex starts counting from 0, so if I were to slice out the first element I need slice(1)
                    arrayDetails = arrayDetails.slice(detailIndex + 1);
                    // for every 2 elements of arrayDetails there is 1 element in dateArray, so to slice out the element I need to divide the number
                    dateArray = dateArray.slice((detailIndex - 1) / 2 + 1); 
                } else {

                    // hit is in the title, no need to jump, but still need to divide 
                    slicedDate = dateArray[detailIndex / 2];

                    searchInputDisplay(slicedDate, detailIndex);

                    // As explained above, +1 is required, but here is +2 because were currently looking at the title, which is in front of description element
                    // so to slice it out I need to move twice
                    arrayDetails = arrayDetails.slice(detailIndex + 2);
                    // for every 2 elements of arrayDetails there is 1 element in dateArray, so to slice out the element I need to divide the number
                    dateArray = dateArray.slice(detailIndex / 2 + 1);
                }

                // Here I will look at the sliced out array and look if there are any more hits, if true the loop will continue
                if (arrayDetails.toString().includes(inputByUser)) {

                // if there are no more hits, the loop will end and the component is displayed to the user
                } else {

                    // Also I will remove any input submitted from the search bar
                    const searchInput = document.getElementById("searchinput").value = "";
                    // Display the results and break from the loop
                    searchResult.current = displayDetails;
                    setSearch(true);
                    return
                }
            }
            // if no results are found, empty out the input, return a message and show it
        } else {

            // Also I will remove any input submitted from the search bar
            const searchInput = document.getElementById("searchinput").value = "";
            // Display the below message to the user
            searchResult.current = "There are no results for your search.";
            setSearch(true);
        }
    }

    return (
        <>
            {initialSearch === true && <SearchUserInput setsearch={setSearch} searchResult={searchResult.current} />}
            {initialAddTask === true && <Addtask componentchanger={setNewTask} getHourAndDay={getHourAndDay} addtaskbackground={setNewTask} />}
            {userNotLogged === true && <Login dontDisplayUI={setUserIsLogged} /> }
            <div className="pagetop">
            
                <span className="cal">Calendar</span>

                <div className="prkotina">
                <button id="todaybutton" className="todaybutton" type="button" onClick={() => { // here I am resetting all states to initial ones so that I can get back to beginning
                    setMonthName( monthsOfTheYearArray[currentDate.getMonth()]);
                    setMonthNumber(currentDate.getMonth());
                    setYearNumber(currentDate.getFullYear());
                    setDifferentWeek(preserveInitial);
                    setDisplayDifferent(preservedisplay);
                }}>Today</button>

                <ul className="ultoppage">
                    <li className="litopinline"><button className="topbutton" onClick={() => {setDisplayDifferent(preservedisplay) } }>Week</button></li>
                    <li className="litopinline"><button className="topbutton" onClick={() => {setDisplayDifferent("displaymonth") } }>Month</button></li>
                    <li className="litopinline"><button className="topbutton" onClick={() => {setDisplayDifferent("displayyear") } }>Year</button></li>
                </ul>
                </div>
                <form onSubmit={searchAlgorithm} method="post">
                    <input className="inputsearch" id="searchinput" type="search" placeholder="Search for.." name="input" minLength="3" maxLength="15"></input>
                    <button className="searchbutton" type="submit">Search</button>
                </form>

                {/*Icon for a change between white / black background*/}
                <div className="svg">
                    <div onClick={changeBackground}>
                        <svg className="changeofbg">
                            <circle cx="40" cy="20" r="10" stroke="black" strokeWidth="3" fill="black">Can't Load SVG</circle>
                        </svg>
                        <svg className="changeofbg">
                            <circle cx="0" cy="20" r="10" stroke="black" strokeWidth="3" fill="white">Can't Load SVG</circle>
                        </svg>
                    </div>
                    <div className="profilediv" onClick={checkIfUserIsLogged}>
                        <img src={ProfilePicture} alt="Profile" className="profile" />
                    </div>
                </div>
            </div>
            <hr className="hrmargin"></hr>
            <div className="bla">
                <div className="calendarbody">
                    <table id="calendartable">
                        <thead>
                            <tr>
                                <th id="monthsetting" colSpan="4">{initialMonthName}</th>
                                <th colSpan="1">{initialYearNumber}</th>
                                <th id="previous" onClick={changeToPreviousMonth}>&larr;</th>
                                <th id="next" onClick={changeToNextMonth}>&rarr;</th>
                            </tr>
                            <tr>
                                {namesOfTheDays}
                            </tr>
                        </thead>
                        <tbody className="tbody">
                            <tr>{monthRowsObject.firstRow}</tr>
                            <tr>{monthRowsObject.secondRow}</tr>
                            <tr>{monthRowsObject.thirdRow}</tr>
                            <tr>{monthRowsObject.fourthRow}</tr>
                            <tr>{monthRowsObject.fifthRow}</tr>
                            <tr>{monthRowsObject.sixthRow}</tr>
                        </tbody>
                    </table>
                    <div>
                        <button className="createbutton" onClick={() => { setNewTask(true) }}>Create a new Plan</button>
                        <button className="createbutton">Other Overlays</button>
                    </div>
                </div>
                <DisplayUI displayinitial={displayinitial} setdisplay={setDisplayDifferent} setrow={setDifferentWeek} initialWeek={initialWeek} monthRowsObject={monthRowsObject}
                    namesOfTheDays={namesOfTheDays} daysOfTheWeekArray={daysOfTheWeekArray}  monthsOfTheYearArray={ monthsOfTheYearArray} numberOfDaysInMonthArray={numberOfDaysInMonthArray} initialYearNumber={initialYearNumber} />
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

        // I wanted to allow special characters like èìøšáøíé etc. but \W would take them out, so this is the way around it "^\\pL+$" is from the XRegExp lib
        const regex = /["^\\pL+$"\s\d\(^\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\;\:\"\\\/\<\>\?\.\,\°\´)]/g;
        const inputCleansed = formJson.name.replace(regex, "");

        // This works in 2 ways, first to catch if user gave invalid input, and also if user was feeling funky and removed "required" from his client side
        if (inputCleansed == "") {
            alert("Aha ! You thought so? A valid input is required!");
            return
        };

        // Here I am setting the cookie and destroying the component 
        setCookie("name", inputCleansed, 1);
        props.dontDisplayUI(false);
    }

    return (
        <>
            <div className="logindiv" onClick={() => { props.dontDisplayUI(false) }}>
            </div>
            <div id="loginUI">
                <div>
                    <img src={ProfilePicture} className="profilepicturelogin"></img>
                </div>
                <h2>Sign up:</h2>
                <form method="post" onSubmit={checkUserInput}>
                    <label htmlFor="username">Name: </label>
                    <input id="username" name="name" type="text" required maxLength="20"></input>
                    <br />
                    <br/>
                 <button type="submit">Complete your registration!</button>
                </form>
                <br/>
            </div>
        </>
    )
}

function setCookie(cname, cvalue, exdays) {

    //props are name, value for the name, and days which will always be 1 - I want a year long expiration
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000 ));
    let expire = "expires=" + d.toDateString();
    document.cookie = cname + "=" + cvalue + "_;_" + expire + ";path=/";
}


function SearchUserInput(props) {

    return (
        <>
            <div className="searchdiv">
                <h2>Search results:</h2>
                <div className="searchResultsDiv">{props.searchResult}</div>
                <button onClick={() => {props.setsearch(false) } }>Hide the search results!</button>
            </div>
        </>
    )
}