import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import token from './file.js'

function App() {
    const [initialCountry, setCountry] = useState("");
    const gotToken = token;
    // Accessing API to get the user's country location - its abbreviation
    useEffect(() => {
        fetch(`https://ipinfo.io/json?token=${gotToken}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setCountry(result.country);
                },
                (error) => {
                    alert("Country origin cannot be reached.")
                }
            )
    }, []);

    return (
      <>
            <Calendar initialCountry={initialCountry} />
      </>
  );
}

export default App;