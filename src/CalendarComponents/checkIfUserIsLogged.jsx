// If user has already logged in, cookie with the name "name" is present therefore I dont need to log the user again
function checkIfUserIsLogged(setUserIsLogged)  {
    if (document.cookie.includes("Name")) {
        alert("You are logged in.");
        return
    } else {
        setUserIsLogged(true);
    }
}
export default checkIfUserIsLogged