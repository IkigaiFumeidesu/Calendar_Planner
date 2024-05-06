import React from 'react';

function Login(props) {
    function checkUserInput(e) {

        // Preventing the form to refresh on submit
        e.preventDefault();

        // Gathering data from entries and pushing it into an object
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        // I wanted to allow special characters like èìøšáøíé etc. "^\\pL+$" is from the XRegExp lib
        const regex = /["^\\pL+$"\s\d\(^\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\;\:\"\\\/\<\>\?\.\,\°\´)]/g;
        formJson.name = formJson.name.replace(regex, "");

        // This works in 2 ways, first to catch if user gave invalid input, and also if user removed "required" from ´their client side
        if (formJson.name == "") {
            alert("Please enter a name");
            return
        }

        // Here I am setting the cookie and destroying the component 
        setCookie(formJson.name);
        props.dontDisplayUI(false);
    }

    return (
        <>
            <div className="login-div_background" onClick={() => { props.dontDisplayUI(false) }}></div>
            <div className="login-div">
                <div>
                    <button className="login-div_cancel" onClick={() => { props.dontDisplayUI(false) }}>X</button>
                    <img src={ProfilePicture} className="login-div_profile_pic"></img>
                </div>
                <h2>Sign up:</h2>
                <form method="post" onSubmit={checkUserInput}>
                    <label htmlFor="login-div_username">Name: </label>
                    <input id="login-div_username" name="name" type="text" required maxLength="20" placeholder="..." autoComplete="off" autoFocus></input>
                    <label htmlFor="login-div_password">Password: </label>
                    <input id="login-div_password" name="password" type="password" required maxLength="40" placeholder="..." autoComplete="off"></input>
                    <br />
                    <button className="login-div-register" type="submit">Submit my registration!</button>
                </form>
                <br />
            </div>
        </>
    )
}

export default LoginComponent;