// Login

document.getElementById("loginForm").addEventListener("submit", loginUser);
const xhttp = new XMLHttpRequest();
xhttp.open("POST", "http://127.0.0.1:8000/login");

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        console.log(response);
    }

    const data = JSON.stringify({
        username: username,
        password: password,
    });

    xhttp.send(data);
};

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("username-login").value;
    const password = document.getElementById("password-login").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === true) {
                document.cookie = `token=${data.token}`;
                alert("Login successful");
                window.location.href = "/";
            } else {
                alert("Login failed: " + data.detail);
            }
        })
        .catch((error) => {
            console.error("Error during login:", error);
        });
}

// Register

document
    .getElementById("registerForm")
    .addEventListener("submit", registerUser);

function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById("username-register").value;
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;

    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === true) {
                document.cookie = `token=${data.token}`;
                alert("Registration successful");
                window.location.href = "/";
            } else {
                alert("Registration failed: " + data.detail);
            }
        })
        .catch((error) => {
            console.error("Error during registration:", error);
        });
}
