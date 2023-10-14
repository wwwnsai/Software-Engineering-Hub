let header = document.querySelector(".navigation");
const boxes = document.querySelectorAll(".lecturers__box");

// Navigation Bar Scroll Fixed
window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY);
});

// Lecturers Hover
document.addEventListener("DOMContentLoaded", function () {
    let activeBox = null;

    boxes.forEach(function (box) {
        box.addEventListener("mouseenter", function () {
            if (activeBox) {
                activeBox.classList.remove("lecturers__box--active");
            }
            box.classList.add("lecturers__box--active");
            activeBox = box;
        });
    });
});
