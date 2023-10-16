
const header = document.querySelector(".navigation");

// Navigation Bar Scroll Fixed
window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY);
});

// Get references to navigation elements and content divs
const navEarly = document.getElementById("admission__navigation-early");
const navFirst = document.getElementById("admission__navigation-first");
const divEarly = document.getElementById("section-admission-1-1-early");
const divFirst = document.getElementById("section-admission-1-1-first");

// Set the initial display state
divEarly.style.display = "block";
divFirst.style.display = "none";

navEarly.classList.add("active");

// Add click event listeners to the navigation elements
navEarly.addEventListener("click", () => {
    divEarly.style.display = "block";
    divFirst.style.display = "none";
    navEarly.classList.add("active");
    navFirst.classList.remove("active");
});

navFirst.addEventListener("click", () => {
    divEarly.style.display = "none";
    divFirst.style.display = "block";
    navEarly.classList.remove("active");
    navFirst.classList.add("active");
});