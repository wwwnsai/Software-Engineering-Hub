// Navigation
const header = document.querySelector(".navigation");

// About
const aboutSelections = document.querySelectorAll(
    "[id^='about__selection-element--']"
);
const aboutDetails = document.querySelectorAll(
    "[id^='about__details-element--']"
);

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

// Lecturers
const boxes = document.querySelectorAll(".lecturers__box");

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
