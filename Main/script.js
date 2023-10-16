// Navigation
const header = document.querySelector(".navigation");

// About
const aboutSelections = document.querySelectorAll(
    "[id^='about__selection-element--']"
);
const aboutDetails = document.querySelectorAll(
    "[id^='about__details-element--']"
);

// Lecturers
const boxes = document.querySelectorAll(".lecturers__box");

// User
const showUser = document.querySelector(
    ".navigation__menu-item-program--login"
);
const userName = document.getElementById("userName");

// Navigation Bar Scroll Fixed
window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY);
});

aboutSelections.forEach((selection, index) => {
    selection.addEventListener("click", () => {
        aboutDetails.forEach((detail, detailIndex) => {
            detail.style.display = index === detailIndex ? "block" : "none";
        });

        aboutSelections.forEach((s, sIndex) => {
            s.classList.toggle(
                "about__selection-element--active",
                sIndex === index
            );
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    let activeBox = null;

    boxes.forEach((box) => {
        box.addEventListener("mouseenter", () => {
            if (activeBox && activeBox !== box) {
                activeBox.classList.remove("lecturers__box--active");
            }
            box.classList.add("lecturers__box--active");
            activeBox = box;
        });
    });
});

// Get User Data
const getInfo = function () {
    const username = localStorage.getItem("user");

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://127.0.0.1:8000/user/${username}`);
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const response = JSON.parse(this.responseText);
                console.log(response);
                if (response.username == username) {
                    userName.innerHTML = response.username;
                    document.getElementById("email-info").innerHTML =
                        response.email;
                } else {
                    alert(response.message);
                }
            } else {
                alert("User not found.");
            }
        }
    };
};
