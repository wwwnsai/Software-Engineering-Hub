const idField = document.getElementById("userinfo__id");
const usernameField = document.getElementById("userinfo__username");
const emailField = document.getElementById("userinfo__email");
const itemsField = document.getElementById("userinfo__items");

function fetchData() {
    fetch(`/userinfo`, {})
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let items = data.user.items;
            console.log(items);
            if (items.length === 0) {
                items = "-";
            }
            idField.innerHTML = `Student ID: &emsp; ${data.user.id}`;
            usernameField.innerHTML = `Username: &emsp; ${data.user.username}`;
            emailField.innerHTML = `Email: &emsp; &emsp; &emsp; ${data.user.email}`;
            itemsField.innerHTML = `Items: &emsp; &emsp; &emsp; ${items}`;
        })
        .catch((error) => {
            console.error("Error fetching user information:", error);
        });
}

fetchData();
