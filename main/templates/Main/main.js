import { handleScroll } from "./js/navigation.js";
import { aboutSelections, handleAboutSelectionClick } from "./js/about.js";
import { boxes, handleLecturerBoxHover } from "./js/lecturers.js";

// Add Event Listeners
window.addEventListener("scroll", handleScroll);

aboutSelections.forEach((selection) => {
    selection.addEventListener("click", handleAboutSelectionClick);
});

boxes.forEach((box) => {
    box.addEventListener("mouseenter", handleLecturerBoxHover);
});
