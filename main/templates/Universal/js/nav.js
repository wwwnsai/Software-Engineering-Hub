export const mediaQuery = window.matchMedia("(max-width: 34.25em)");

export const handleMediaQuery = (mediaQuery) => {
    if (mediaQuery.matches) {
        document.querySelector(".navigation").style.display = "none";
        document.querySelector(".navigation__responsive").style.display =
            "flex";
    } else {
        document.querySelector(".navigation").style.display = "flex";
        document.querySelector(".navigation__responsive").style.display =
            "none";
    }
};

handleMediaQuery(mediaQuery);

mediaQuery.addListener(handleMediaQuery);
