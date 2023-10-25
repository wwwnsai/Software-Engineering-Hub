import { handleScroll } from "./js/navigation.js";
import { aboutSelections, handleAboutSelectionClick } from "./js/about.js";
import { boxes, handleLecturerBoxHover } from "./js/lecturers.js";
import { logOutBtn, logout, checkUser } from "./js/user.js";

// Add Event Listeners
window.addEventListener("scroll", handleScroll);

aboutSelections.forEach((selection) => {
    selection.addEventListener("click", handleAboutSelectionClick);
});

boxes.forEach((box) => {
    box.addEventListener("mouseenter", handleLecturerBoxHover);
});

logOutBtn.addEventListener("click", logout);

// Initial function
function init() {
    checkUser();
}

window.onload = init;

// Get User Data
// const getInfo = function () {
//     const username = localStorage.getItem("user");

//     const xhttp = new XMLHttpRequest();
//     xhttp.open("GET", `http://127.0.0.1:8000/user/${username}`);
//     xhttp.send();

//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4) {
//             if (this.status == 200) {
//                 const response = JSON.parse(this.responseText);
//                 console.log(response);
//                 if (response.username === username) {
//                     userName.innerHTML = response.username;
//                 } else {
//                     alert(response.message);
//                 }
//             } else {
//                 alert("User not found.");
//             }
//         }
//     };
// };
