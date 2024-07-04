// this just changes the background from white to black 
function changeBackground(setBackground) {
    if (document.body.style.backgroundColor === "rgb(253, 253, 253)") {
        document.body.style.backgroundColor = "#181818";
        document.body.style.color = "#FDFDFD";
        localStorage.setItem("Background", "background=#181818");
        setBackground("B");

    } else {
        document.body.style.backgroundColor = "#FDFDFD";
        document.body.style.color = "#181818";
        localStorage.setItem("Background", "background=#FDFDFD");
        setBackground("W");

    }
}
export default changeBackground