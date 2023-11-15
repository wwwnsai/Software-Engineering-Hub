const idField = document.getElementById("userinfo__id");
const usernameField = document.getElementById("userinfo__username");
const emailField = document.getElementById("userinfo__email");

function fetchData() {
    fetch(`/userinfo`, {})
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            idField.innerHTML = `Student ID: ${data.user.id}`;
            usernameField.innerHTML = `Username: ${data.user.username}`;
            emailField.innerHTML = `Email: ${data.user.email}`;
        })
        .catch((error) => {
            console.error("Error fetching user information:", error);
        });
}

fetchData();
