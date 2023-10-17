// about.js
export const aboutSelections = document.querySelectorAll(
    "[id^='about__selection-element--']"
);
export const aboutDetails = document.querySelectorAll(
    "[id^='about__details-element--']"
);

export function handleAboutSelectionClick(event) {
    const clickedElement = event.target;
    const parentSelectionElement = clickedElement.closest(
        ".about__selection-element"
    );

    if (!parentSelectionElement) {
        return;
    }

    const index = Array.from(aboutSelections).indexOf(parentSelectionElement);

    aboutDetails.forEach((detail, detailIndex) => {
        detail.style.display = index === detailIndex ? "block" : "none";
    });

    aboutSelections.forEach((s, sIndex) => {
        s.classList.toggle(
            "about__selection-element--active",
            sIndex === index
        );
    });
}
