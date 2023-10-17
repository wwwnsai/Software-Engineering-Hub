// user.js
export const showUser = document.querySelector(
    ".navigation__menu-item-program--login"
);
export const userNameNav = document.getElementById("userNameNav");
export const userNameHero = document.getElementById("userNameHero");
export const logOutBtn = document.getElementById("logOut");
export const guestShowNav = document.querySelector(
    ".navigation__menu-item-program--guest"
);
export const userShowNav = document.querySelector(
    ".navigation__menu-item-program--user"
);
export const guestShowHero = document.querySelector(".hero__lower--guest");
export const userShowHero = document.querySelector(".hero__lower--user");

export function checkUser() {
    try {
        if (localStorage.getItem("user")) {
            const username = localStorage.getItem("user");
            guestShowNav.style.display = "none";
            userShowNav.style.display = "block";

            guestShowHero.style.display = "none";
            userShowHero.style.display = "flex";

            userNameNav.innerHTML = username;
            userNameHero.innerHTML = `Welcome to our faculty, ${username}`;
        } else {
            guestShowNav.style.display = "block";
            userShowNav.style.display = "none";

            guestShowHero.style.display = "flex";
            userShowHero.style.display = "none";
        }
    } catch (error) {
        console.error("Error accessing localStorage: " + error);
    }
}

export function logout() {
    localStorage.removeItem("user");
    checkUser();
}
