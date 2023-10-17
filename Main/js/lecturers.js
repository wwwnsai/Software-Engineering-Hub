// lecturers.js
let activeBox;

export const boxes = document.querySelectorAll(".lecturers__box");

export function handleLecturerBoxHover(event) {
    let box = event.target;
    if (activeBox && activeBox !== box) {
        activeBox.classList.remove("lecturers__box--active");
    }
    box.classList.add("lecturers__box--active");
    activeBox = box;
}
