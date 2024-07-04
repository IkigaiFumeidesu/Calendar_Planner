function searchAlgorithm(searchResult, formInput, setSearch, numberOfDaysInMonthArray, setYearNumber, setMonthNumber, setMonthName, monthsOfTheYearArray, setDifferentWeek) {

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
    if (localTaskDetailsArray.join(" ").toLowerCase().includes(searchObject.input.toLowerCase())) {

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
                if (localTaskDetailsArray[s].toLowerCase().includes(searchObject.input.toLowerCase())) {
                    detailIndex = s;
                    s = -1;
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
                        endOfMonth = extractedMonth - 1 === 0 ? numberOfDaysInMonthArray[extractedMonth + 10] : numberOfDaysInMonthArray[extractedMonth];

                        // If we're in January, we're at the end of the array, to get Dec, I need to update the number to 12 and subtract 1 from year
                        if (extractedMonth === 1) {
                            extractedMonth = 12;
                            extractedYear--;
                        } else {
                            extractedMonth -= 1;
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
export default searchAlgorithm