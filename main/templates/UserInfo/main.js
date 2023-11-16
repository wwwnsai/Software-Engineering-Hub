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
            idField.innerHTML = `<p>Student ID: <span class="userinfo__data">${data.user.id}</span></p>`;
            usernameField.innerHTML = `<p>Username: <span class="userinfo__data">${data.user.username}</span></p>`;
            emailField.innerHTML = `<p>Email: <span class="userinfo__data">${data.user.email}</span></p>`;
            itemsField.innerHTML = `<p>Borrowed: <span class="userinfo__data">${items}</span></p>`;
        })
        .catch((error) => {
            console.error("Error fetching user information:", error);
        });
}

fetchData();
