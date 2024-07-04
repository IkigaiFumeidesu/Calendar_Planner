
// Here I will create all 12 Objects with the same function, inputting different variables as the countMonths gets updated
function createYearTable(Month, monthsOfTheYearArray, daysOfTheWeekArray, Objects, numberOfDaysInMonthArray, creationOfKey, dateOfThisYear, initialYearNumber, countMonths, whichrow) {

    const displayMonthName = monthsOfTheYearArray[countMonths];
    const displayWholeWeek = daysOfTheWeekArray.map((day) => { return <td key={day}>{day}</td> });

    // Passing arrays between objects (aka months), condition is to exclude January AND also I want to change the style
    if (Month !== Objects[0]) {
        // this condition determines if the passed array is the 5th or 6th row
        if (!whichrow) {
            passTheRow(Objects[countMonths - 1].fifthRowYear)
        } else {
            passTheRow(Objects[countMonths - 1].sixthRowYear)
        }
    }
    function passTheRow(givenRow) {

        let counter = 1;
        let datesOfPreviousMonth = (givenRow[0].key).split("-")[2];

        if (whichrow) {
            dateOfThisYear = Objects[countMonths - 1].sixthRowYear[6].props.children + 1;
        } else {
            dateOfThisYear = Objects[countMonths - 1].fifthRowYear[6].props.children + 1 > 20 ? Objects[countMonths - 1].sixthRowYear[0].props.children : Objects[countMonths - 1].fifthRowYear[6].props.children + 1;
        }

        for (let i = 0; i < 7; i++) {
            // Condition: get me the passed Object's fifthRowYear key and read its month value, then compare it, if its true it belongs to the current month
            if (Number(givenRow[i].key.split("-")[1]) === countMonths + 1) {
                Month.firstRowYear.push(<td key={givenRow[i].key}>{counter++}</td>);
            } else {
                Month.firstRowYear.push(<td key={givenRow[i].key} className="calendar-table_previousM">{datesOfPreviousMonth++}</td>);
            }
        }
    }

    // Filling objects's array with the dates of the month
    for (let i = numberOfDaysInMonthArray[countMonths]; dateOfThisYear <= i; dateOfThisYear++) {
        creationOfKey = initialYearNumber + "-" + (countMonths + 1) + "-" + dateOfThisYear;
        Month.rowCreation.push(<td key={creationOfKey}>{dateOfThisYear}</td>);
    }

    Month.secondRowYear = Month.rowCreation.slice(0, 7);
    Month.thirdRowYear = Month.rowCreation.slice(7, 14);
    Month.fourthRowYear = Month.rowCreation.slice(14, 21);
    Month.fifthRowYear = Month.rowCreation.slice(21, 28);
    Month.sixthRowYear = Month.rowCreation.slice(28, 31);

    // For the dates of the next month to fill up row 5 and 6
    let dateOfNextMonth = 1;
    let numberOfDatesFifthRow = Month.fifthRowYear.length;
    let numberOfDatesSixthRow = Month.sixthRowYear.length;

    // Filling the following arrays with datesOfNextMonth
    fillTheRows(numberOfDatesFifthRow, Month.fifthRowYear);
    fillTheRows(numberOfDatesSixthRow, Month.sixthRowYear);
    function fillTheRows(numberOfDates, passedArray) {

        for (; numberOfDates < 7; numberOfDates++) {
            creationOfKey = initialYearNumber + "-" + (countMonths + 2) + "-" + dateOfNextMonth;
            passedArray.push(<td className="calendar-table_nextM" key={creationOfKey}>{dateOfNextMonth}</td>);
            dateOfNextMonth++;
        }
    }

    return (
        <>
            <table className="year-content_table">
                <thead>
                    <tr>
                        <td colSpan="7"><strong>{displayMonthName}</strong></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>{displayWholeWeek}</tr>
                    <tr>{Month.firstRowYear}</tr>
                    <tr>{Month.secondRowYear}</tr>
                    <tr>{Month.thirdRowYear}</tr>
                    <tr>{Month.fourthRowYear}</tr>
                    <tr>{Month.fifthRowYear}</tr>
                    <tr>{Month.sixthRowYear}</tr>
                </tbody>
            </table>
        </>
    )
}
export default createYearTable