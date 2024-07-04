// Change to the next month and update the element
function changeToNextMonth(setMonthName, setMonthNumber, setYearNumber, initialMonthNumber, monthsOfTheYearArray, initialYearNumber) {
    if (initialMonthNumber === 11) {
        setMonthName(monthsOfTheYearArray[initialMonthNumber - 11]);
        setMonthNumber(0);
        setYearNumber(initialYearNumber + 1);
    } else {
        setMonthName(monthsOfTheYearArray[initialMonthNumber + 1]);
        setMonthNumber(initialMonthNumber + 1);
    }
}
export default changeToNextMonth