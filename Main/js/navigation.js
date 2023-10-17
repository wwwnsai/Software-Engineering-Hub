// navigation.js
export const header = document.querySelector(".navigation");

export function handleScroll() {
    header.classList.toggle("sticky", window.scrollY > 0);
}
