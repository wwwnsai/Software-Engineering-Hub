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

// Function

// Navigation Bar Scroll Fixed
window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY);
});

// About
aboutSelections.forEach((selection, index) => {
    selection.addEventListener("click", () => {
        aboutDetails.forEach((detail, detailIndex) => {
            detail.style.display = index === detailIndex ? "block" : "none";
        });
    });
});

// Lecturers Hover
document.addEventListener("DOMContentLoaded", () => {
    let activeBox = null;

    boxes.forEach((box) => {
        box.addEventListener("mouseenter", () => {
            if (activeBox) {
                activeBox.classList.remove("lecturers__box--active");
            }
            box.classList.add("lecturers__box--active");
            activeBox = box;
        });
    });
});
