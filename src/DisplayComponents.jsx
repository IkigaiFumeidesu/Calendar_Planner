import CalendarContent from "./CalendarContent"

function DisplayUI(props) {
    if (props.displayinitial === "displayweek") {
        return (
            <>
                <CalendarContent daterow={props.daterow} />
            </>
        )
    } else if (props.displayinitial === "displaymonth") {
        return (
            <>
                <MonthContent tablerows={props.tablerows} weekdays={props.weekdays} />
            </>
        )
    } else {
        return (
            <>
                <YearContent />
            </>
        )
    }
}

function MonthContent(props) {


    return (
        <>
            <div className="tcontent">
                <table className="tablemonthcontent">
                    <thead>
                        <tr>{props.weekdays}</tr>
                    </thead>
                    <tbody>
                        <tr>{props.tablerows.row1}</tr>
                        <tr>{props.tablerows.row2}</tr>
                        <tr>{props.tablerows.row3}</tr>
                        <tr>{props.tablerows.row4}</tr>
                        <tr>{props.tablerows.row5}</tr>
                        <tr>{props.tablerows.row6}</tr>
                    </tbody>
                </table>
            </div>
        </>


    )
}

function YearContent() {

}
export default DisplayUI