// Function to check login status and update page content
export function updatePageContent() {
    const token = getCookie("token");
    const loginBlock = document.getElementById("loginBlock");
    const userBlock = document.getElementById("userBlock");
    const heroLoginBlock = document.getElementById("heroLoginBlock");
    const heroUserBlock = document.getElementById("heroUserBlock");

    if (token) {
        // User is logged in
        loginBlock.style.display = "none";
        userBlock.style.display = "block";
        heroLoginBlock.style.display = "none";
        heroUserBlock.style.display = "block";

        // Fetch user information based on the token (you'll need to implement this)
        fetch(`/userinfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Update userBlock with user information
                let firstName = data.user.username.split(" ");
                userBlock.innerHTML = `<li><a href="/userinfos">${firstName[0]}</a>
                                        </li><li><a href="/logout">Logout</a></li>`;
                heroUserBlock.innerHTML = `
                <p style="text-align: center; text-transform: lowercase;" class="hero__lower-text"><span style="text-transform: uppercase;">W</span>elcome, <span style="text-transform: uppercase; color: #fa991c; font-weight: bold;">${data.user.username}</span> to our faculty!</p>`;
            })
            .catch((error) => {
                console.error("Error fetching user information:", error);
            });
    } else {
        // User is not logged in
        loginBlock.style.display = "block";
        userBlock.style.display = "none";
        heroLoginBlock.style.display = "flex";
        heroUserBlock.style.display = "none";
    }
}

// Function to get the value of a cookie by name
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}
