// Login
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
}

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

if (registerForm) {
    registerForm.addEventListener("submit", registerUser);
}

function registerUser(event) {
    event.preventDefault();

    const student_id = document.getElementById("student_id-register").value;
    const username = document.getElementById("username-register").value;
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;

    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: student_id,
            username: username,
            email: email,
            password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
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
