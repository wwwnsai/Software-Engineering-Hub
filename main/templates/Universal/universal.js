import { updatePageContent } from "./js/user.js";
import { mediaQuery, handleMediaQuery } from "./js/nav.js";

// Initial function
function init() {
    handleMediaQuery(mediaQuery);
    mediaQuery.addListener(handleMediaQuery);
    updatePageContent();
}

window.addEventListener("load", init);
