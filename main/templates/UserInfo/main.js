const usernameField = document.getElementById("userinfo__username");

function fetchData() {
    fetch(`/userinfo`, {})
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            usernameField.innerHTML = `Username: ${data.user.username}`;
        })
        .catch((error) => {
            console.error("Error fetching user information:", error);
        });
}

fetchData();
