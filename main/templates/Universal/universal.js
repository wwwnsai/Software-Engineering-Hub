import { updatePageContent } from "./js/user.js";

document.addEventListener("DOMContentLoaded", function () {
    var hamburgerMenu = document.querySelector(".hamburger-menu");
    var mobileMenu = document.querySelector(".mobile-menu");

    hamburgerMenu.addEventListener("click", function () {
        mobileMenu.style.display =
            mobileMenu.style.display === "block" ? "none" : "block";
    });
});
// Initial function
function init() {
    updatePageContent();
}

window.addEventListener("load", init);
