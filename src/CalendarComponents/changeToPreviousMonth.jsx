// Change to the previous month and update the element
function changeToPreviousMonth(setMonthName, setMonthNumber, setYearNumber, initialMonthNumber, monthsOfTheYearArray, initialYearNumber) {
    if (initialMonthNumber === 0) {
        setMonthName(monthsOfTheYearArray[initialMonthNumber + 11]);
        setMonthNumber(11);
        setYearNumber(initialYearNumber - 1);
    } else {
        setMonthName(monthsOfTheYearArray[initialMonthNumber - 1]);
        setMonthNumber(initialMonthNumber - 1);
    }
}
export default changeToPreviousMonth