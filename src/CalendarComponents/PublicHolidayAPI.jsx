import React, { useEffect, useRef } from 'react';

function PublicHolidayAPI(props) {

        // Component to get public holiday API based on the country origin which was obtained at App.jsx component
        useEffect(() => {
            fetch(`https://date.nager.at/api/v3/publicholidays/${props.initialYearNumber}/${props.initialCountry}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        props.setPublicHoliday(result.map((item) => {

                            // Setting the format from the API to YYYY-MM-DD without 0 before the month or date
                            item.date[8] === "0" && (item.date = item.date.slice(0, 8) + item.date.slice(9));
                            item.date[5] === "0" && (item.date = item.date.slice(0, 5) + item.date.slice(6));
                            return [item.date, item.name]
                        }));
                    },
                    (error) => {
                        alert("Public holidays cannot be reached.")
                    }
                )
        }, []);

    return (
        <>
        </>
  );
}

export default PublicHolidayAPI;