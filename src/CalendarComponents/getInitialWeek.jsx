// Here I am getting the today's date and finding it in the array of all arrays (rows) so that I can display the week (array) its in
function getInitialWeek(currentDate, monthRowsObject)  {
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
export default getInitialWeek