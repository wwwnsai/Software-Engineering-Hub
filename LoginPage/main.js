function login() {
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'http://127.0.0.1:8000/login');
    xhttp.send(formData);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const response = JSON.parse(this.responseText);
                console.log(response);
                if (response.message == 'Login successful') {
                    localStorage.setItem('user', username);
                    window.location.href = '../Main/main.html';
                } else {
                    alert(response.message);
                }
            } else {
                alert('Login failed. Check your credentials.');
            }
        }
    }
    
}

function logout() {
    localStorage.removeItem('user');
}

function register() {
    const username = document.getElementById('username-register').value;
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'http://127.0.0.1:8000/register');
    xhttp.send(formData);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const response = JSON.parse(this.responseText);
                console.log(response);
                if (response.message == 'Registration successful') {
                    window.location.href = 'login.html';
                } else {
                    alert(response.message);
                }
            } else {
                alert('Registration failed. Try again.');
            }
        }
    }
}

function getInfo(){
    const username = localStorage.getItem('user');

    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `http://127.0.0.1:8000/user/${username}`);
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const response = JSON.parse(this.responseText);
                console.log(response);
                if (response.username == username) {
                    document.getElementById('username-info').innerHTML = response.username;
                    document.getElementById('email-info').innerHTML = response.email;
                } else {
                    alert(response.message);
                }
            } else {
                alert('User not found.');
            }
        }
    }
}
