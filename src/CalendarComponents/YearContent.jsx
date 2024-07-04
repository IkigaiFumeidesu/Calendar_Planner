import createYearTable from "./createYearTable";
function YearContent(props) {

    // A variable to help me render each month by slowly ugprading its value to 12, but when any other component would get rendered,
    // this variable gets updated into infinity, thats why I want it to be set to 0 so that I dont go above the bounds of my props.monthsOfTheYearArray array
    const arrayOfMonths = [];

    // I want to get the initial date of the first year so that I can work with it to display the full year
    const startOfTheYear = new Date();
    startOfTheYear.setFullYear(props.initialYearNumber, 0, 1);
    const firstDayOfYear = startOfTheYear.getDay();
    let datesPreviousYear;
    let creationOfKey;
    let whichrow;
    let dateOfThisYear = 1;
    let countMonths = 0;

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
            Objects[0].firstRowYear.push(<td className="calendar-table_previousM" key={creationOfKey}>{datesPreviousYear}</td>);
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

    // creating all Months into an Array
    for (let i = 0; i < 12; i++) {
        arrayOfMonths.push(
            <div>
                {createYearTable(Objects[i], props.monthsOfTheYearArray, props.daysOfTheWeekArray, Objects, props.numberOfDaysInMonthArray, creationOfKey, dateOfThisYear, props.initialYearNumber, countMonths, whichrow)}
            </div>
        )
        countMonths++;
        whichrow = Objects[i].sixthRowYear[0].props.children > Objects[i].sixthRowYear[6].props.children ? true : false;
    }
    return (
        <>
        <div className="year-content_div">
            <div className="year-content-months">
                {arrayOfMonths[0]}
                {arrayOfMonths[1]}
                {arrayOfMonths[2]}
            </div>
            <div className="year-content-months">
                {arrayOfMonths[3]}
                {arrayOfMonths[4]}
                {arrayOfMonths[5]}
            </div>
            <div className="year-content-months">
                {arrayOfMonths[6]}
                {arrayOfMonths[7]}
                {arrayOfMonths[8]}
            </div>
            <div className="year-content-months">
                {arrayOfMonths[9]}
                {arrayOfMonths[10]}
                {arrayOfMonths[11]}
            </div>
        </div>
        </>
    )
}
export default YearContent