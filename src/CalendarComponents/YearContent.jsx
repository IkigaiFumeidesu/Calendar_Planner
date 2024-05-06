import { useRef } from "react"

function YearContent(props) {

    // I am setting useRef to help me render each month by slowly ugprading its value to 12, but when any other component would get rendered,
    // refUsedForMonths would get updated into infinity, thats why I want it to be set to 0 so that I dont go above the bounds of my props.monthsOfTheYearArray array
    const refUsedForMonths = useRef();
    refUsedForMonths.current = 0; 

    // I want to get the initial date of the first year so that I can work with it to display the full year
    const startOfTheYear = new Date();
    startOfTheYear.setFullYear(props.initialYearNumber, refUsedForMonths.current, 1);
    const firstDayOfYear = startOfTheYear.getDay();
    let datesPreviousYear;
    let creationOfKey;
    let dateOfThisYear = 1;
    let whichrow;
    // Constructor for objects, which will contain array of dates
    class MonthDates {
        constructor(firstRowYear, secondRowYear, thirdRowYear, fourthRowYear, fifthRowYear, sixthRowYear, rowCreation) {
            this.firstRowYear = firstRowYear;
            this.secondRowYear = secondRowYear;
            this.thirdRowYear = thirdRowYear;
            this.fourthRowYear = fourthRowYear;
            this.fifthRowYear = fifthRowYear;
            this.sixthRowYear = sixthRowYear;
            this.rowCreation = rowCreation;
        }
    }

    // Creating all objects via constructor
    const Objects = {};
    for (let i = 0; i < 12; i++) {
        Objects[i] = new MonthDates([], [], [], [], [], [], []);
    }

    // One runtime per render, to get the start of the chain - calendar
    // Condition if the month starts on Sunday
    if (firstDayOfYear === 0) {

        // Ex. 31 dates are in previous month 31 - 5 is 26 but starting from 26 to 31, there are 6 numbers, thats why i < 6, it starts at 0
        datesPreviousYear = props.numberOfDaysInMonthArray[11] - 5;
        createDatesPreviousYear(6);

        // To the 6 dates from previous month, I need to add 1 from the month to be displayed
        createDatesThisYear(1);

    // Condition if the month starts on Monday
    } else if (firstDayOfYear === 1) {

        // Ex. 31 dates are in previous month 31 - 6 is 25 but starting from 25 to 31, there are 7 numbers, therefore the whole first row 
        datesPreviousYear = props.numberOfDaysInMonthArray[11] - 6;
        createDatesPreviousYear(7);

    // Solution for the rest of the week
    } else {

        // Ex. 31 dateOfThisYears are in previous month 31 - 4 + 2 = 29, therefore 3 numbers, +2 because I omitted 2 cases, Mo and Su
        datesPreviousYear = props.numberOfDaysInMonthArray[11] - firstDayOfYear + 2;
        createDatesPreviousYear(firstDayOfYear - 1);

        // i starts at 0, therefore range from 0 to 8 is 9 numbers, because I added 2 before
        createDatesThisYear(8 - firstDayOfYear);
    }

    function createDatesPreviousYear(number) {

        for (let i = 0; i < number; i++) {
            creationOfKey = props.initialYearNumber - 1 + "-" + 12 + "-" + datesPreviousYear;
            Objects[0].firstRowYear.push(<td className="previousmonth" key={creationOfKey}>{datesPreviousYear}</td>);
            datesPreviousYear++;
        }
    }
    function createDatesThisYear(number) {
        for (let i = 0; i < number; i++) {
            creationOfKey = props.initialYearNumber + "-" + 1 + "-" + dateOfThisYear;
            Objects[0].firstRowYear.push(<td key={creationOfKey}>{dateOfThisYear}</td>);
            dateOfThisYear++;
        }
    }

    // Here I will create all 12 Objects with the same function, inputting different variables as the useRef gets updated
    const createYearTable = (Month) => {

        const displayMonthName = props.monthsOfTheYearArray[refUsedForMonths.current];
        const displayWholeWeek = props.daysOfTheWeekArray.map((day) => { return <td key={day}>{day}</td> });

        // Passing arrays between objects (aka months), condition is to exclude January AND also I want to change the style
        if (Month !== Objects[0]) { 
            // this condition determines if the passed array is the 5th or 6th row
            if (whichrow === true) {
                passTheRow(Objects[refUsedForMonths.current - 1].fifthRowYear)
            } else {
                passTheRow(Objects[refUsedForMonths.current - 1].sixthRowYear)
            }
        }
        function passTheRow(givenRow) {

            let counter = 1;
            let datesOfPreviousMonth = (givenRow[0].key).split("-")[2];
            for (let i = 0; i < 7; i++) {
                // Condition: get me the passed Object's fifthRowYear key and read its month value, then compare it, if its true it belongs to the current month
                if (Number(givenRow[i].key.split("-")[1]) === refUsedForMonths.current + 1) {
                    Month.firstRowYear.push(<td key={givenRow[i].key}>{counter++}</td>);
                } else {
                    Month.firstRowYear.push(<td key={givenRow[i].key} className="previousmonth">{datesOfPreviousMonth++}</td>);
                }
            }
            whichrow === true && (dateOfThisYear = dateOfThisYear - 7);
        }

        // Filling objects's array with the dates of the month
        for (let i = props.numberOfDaysInMonthArray[refUsedForMonths.current]; dateOfThisYear <= i; dateOfThisYear++) {
            creationOfKey = props.initialYearNumber + "-" + (refUsedForMonths.current + 1) + "-" + dateOfThisYear;
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

        // Check whether to import row 5 or row 6 into the next Month's first array
        whichrow = numberOfDatesSixthRow === 0 ? true : false;

        // Filling the following arrays with datesOfNextMonth
        fillTheRows(numberOfDatesFifthRow, Month.fifthRowYear);
        fillTheRows(numberOfDatesSixthRow, Month.sixthRowYear);
        function fillTheRows(numberOfDates, passedArray) {

            for (; numberOfDates < 7; numberOfDates++) {
                creationOfKey = props.initialYearNumber + "-" + (refUsedForMonths.current + 2) + "-" + dateOfNextMonth;
                passedArray.push(<td className="nextmonth" key={creationOfKey}>{dateOfNextMonth}</td>);
                dateOfNextMonth++;
            }
        }

        // dateOfThisYear gets to the point where its value is more than the number of days in the current month, so before next loop I need to change it 
        // the number I assign it, is the dateOfNextMonth, because dateOfNextMonth is the first number of the second row in the next month to be rendered
        // then I set the dateOfNextMonth back to 1 and increase refUsedForMonths.current
        dateOfThisYear = dateOfNextMonth;
        dateOfNextMonth = 1;
        refUsedForMonths.current++;

        return (
            <>
                <table className="yearlytable">
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
    const arrayOfMonths = [];

    // creating all Months into an Array
    for (let i = 0; i < 12; i++) {
        arrayOfMonths.push(
            <div className="monthdiv">
                {createYearTable(Objects[i])}
            </div>
        )
    }
    return (
        <>
        <div className="yearcontent">
            <div className="monthflexbox">
                {arrayOfMonths[0]}
                {arrayOfMonths[1]}
                {arrayOfMonths[2]}
            </div>
            <div className="monthflexbox">
                {arrayOfMonths[3]}
                {arrayOfMonths[4]}
                {arrayOfMonths[5]}
            </div>
            <div className="monthflexbox">
                {arrayOfMonths[6]}
                {arrayOfMonths[7]}
                {arrayOfMonths[8]}
            </div>
            <div className="monthflexbox">
                {arrayOfMonths[9]}
                {arrayOfMonths[10]}
                {arrayOfMonths[11]}
            </div>
        </div>
        </>
    )
}
export default YearContent