// locker calendar 
const calendar_month = document.getElementsByClassName("locker__container--header-text")[0];

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString([], {
        month: 'long',
    });
}

const today = new Date();
const month = ("0" + (today.getMonth() + 1)).slice(-2);
const monthName = getMonthName(month);
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
calendar_month.innerHTML = monthName + " " + today.getFullYear();

// locker nav bar
let locker_nav_res = document.getElementById("locker__nav-reservation");
let locker_nav_view = document.getElementById("locker__nav-view");
let locker_res_container = document.getElementById("reserve_locker");
let locker_view_container = document.getElementById("view_locker");


// generate date 
document.addEventListener("DOMContentLoaded", function () {
    // nav locker bar
    locker_nav_res.classList.add("active");
    locker_view_container.setAttribute("style", "display: none;");
    // calendar
    let calendar_body = document.getElementById("calendar__body");
    let calendarHTML = "";
    let today = new Date(); // Get today's date
    function generateDate(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        let dayCounter = 1;
        let cellClass = "";
        for (let i = 0; i < 6; i++) {
            if (dayCounter > daysInMonth) {
                break;
            }
            calendarHTML += "<tr>";
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
                    if (i === 0 && j < firstDayOfMonth) {
                        cellClass = "not_curr_month-date";
                        calendarHTML += `<td class="${cellClass}"></td>`;
                    }
                    else {
                        cellClass = "not_curr_month-date"
                        calendarHTML += `<td class="${cellClass}"></td>`;
                    }
                } else {
                    let date = new Date(year, month, dayCounter);
                    let cellClass = "";
                    if (date.toDateString() === today.toDateString()) {
                        cellClass = "today";
                    } else if (date < today) {
                        cellClass = "past-date";
                    }
                    else if (date > today) {
                        cellClass = "future-date";
                    }
                    calendarHTML += `<td class="${cellClass}">${dayCounter}</td>`;
                    dayCounter++;
                }
            }
            calendarHTML += "</tr>";
        }
        return calendarHTML;
    }
    calendar_body.innerHTML = generateDate(currentYear, currentMonth);
});


let selected_dates = [];
let nav = [1, 0];


document.addEventListener("click", function (e) {
    // nav locker bar
    if (e.target == locker_nav_res) {
        locker_nav_res.classList.add("active");
        locker_nav_view.classList.remove("active");
        locker_res_container.setAttribute("style", "display: block;");
        locker_view_container.setAttribute("style", "display: none;");
        setTimeout(() => {
            nav[0] = 1;
            nav[1] = 0;
        }, 0);
    } else if (e.target == locker_nav_view) {
        locker_nav_view.classList.add("active");
        locker_nav_res.classList.remove("active");
        locker_res_container.setAttribute("style", "display: none;");
        locker_view_container.setAttribute("style", "display: block;");
        // showLockers();
        showLockers().then(() => {
            nav[0] = 0;
            nav[1] = 1;
        }, 0);
    }
    // date selection
    let today = document.querySelector(".today");
    let future_dates = document.querySelectorAll(".future-date");
    for (let i = 0; i < future_dates.length; i++) {
        if (e.target == future_dates[i]) {
            future_dates[i].classList.toggle("selected_date__active");
            if (selected_dates[i+1] == 1) {
                selected_dates[i+1] = 0;
            }
            else{
                selected_dates[i+1] = 1;
            }
        }
    }
    if (e.target == today) {
        today.classList.toggle("selected_date__active");
        if (selected_dates[0] == 1) {
            selected_dates[0] = 0;
        }
        else{
            selected_dates[0] = 1;
        }
    }

    if (e.target == document.getElementsByClassName("locker__container--buttom-btn")[0]) {
        reserve();
    }
});

function selected_date() {
    let period = [];
    let today_date = today.getDate();
    for (let i = 0; i < selected_dates.length; i++) {
        if (selected_dates[i] == 1) {
            period.push(today_date + i);
        }
    }
    return period;
}

function getSelectedDates() {
    let selected_dates_sorted = selected_date();
    selected_dates_sorted.sort((a, b) => a - b); 
    let date = selected_dates_sorted
        .map(day => `${currentYear}-${month}-${day}`)
        .join(", ");
    return date;
}

// Function to reserve a locker
async function reserve() {
    let message = "You have successfully reserved a locker on: \n";
    let selected_dates_sorted = selected_date();
    selected_dates_sorted.sort((a, b) => a - b);

    if (selected_dates_sorted.length === 0) {
        alert("Please select a date");
        return;
    }
    if (selected_dates_sorted.length > 1) {
        alert("Please select only one date at a time");
        return;
    }

    const date = getSelectedDates();
    const url = 'http://127.0.0.1:8000/user/reserve/';
    const formData = new FormData();
    formData.append('date', date);
    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log("Result: ", data);
        alert(message + date);
    })
    .catch(error => console.error('Error:', error));
}

// Function to delete a locker
async function deleteLocker(lockerId, date) {
    const userConfirmed = confirm(`Do you want to cancel the locker reservation on ${date}?`);
    if (!userConfirmed) {
        return;
    }

    const url = 'http://127.0.0.1:8000/delete/locker';
    const formData = new FormData();
    console.log("lockerId: ", lockerId);
    console.log("date: ", date);
    formData.append('id', lockerId);
    formData.append('date', date);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to delete locker reservation');
        }

        const data = await response.json();
        console.log("Result: ", data);

        showLockers();
    } catch (error) {
        console.error('Error deleting locker reservation:', error);
    }
}

// Function to fetch lockers and display them
async function showLockers() {
    let username = "";
    try {
        const responseUserInfo = await fetch('http://127.0.0.1:8000/userinfo', {});
        const dataUserInfo = await responseUserInfo.json();
        console.log(dataUserInfo.user.username);
        username = dataUserInfo.user.username;
    } catch (error) {
        console.error("Error fetching user information:", error);
    }

    try {
        const responseLockers = await fetch('/list/lockers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!responseLockers.ok) {
            throw new Error('Failed to fetch lockers');
        }

        const dataLockers = await responseLockers.json();
        const lockerDates = dataLockers.lockers || [];
        displayLockerDates(lockerDates, username);
    } catch (error) {
        console.error('Error fetching lockers:', error);
    }
}

// Function to display locker dates
function displayLockerDates(lockerDates, username) {
    const lockerList = document.querySelector('.locker__container--body-view');
    lockerList.innerHTML = "<hr>";
    let count = 0;
    lockerDates.forEach((lockerDate) => {
        const bodyText = document.createElement('div');
        bodyText.classList.add('locker__container--body-view-text');

        const bodyLeft = document.createElement('div');
        bodyLeft.classList.add('locker__container--body-view-left');
        bodyLeft.innerHTML = "";  

        const day = new Date();
        const today = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
        const lockerDateTime = new Date(lockerDate.date);
        const lockers_each_date = lockerDate.lockers || [];
        const lockerDetails = formatLockers(lockers_each_date, username);
        
        const bodyRight = document.createElement('div');
        bodyRight.classList.add('locker__container--body-view-right');

        const trashCanImage = document.createElement('img');
        const trashCanImageUrl = window.trashCanImageUrl;
        trashCanImage.setAttribute('src', trashCanImageUrl);
        trashCanImage.setAttribute('id', `trash_can__${lockerDetails}__${lockerDate.date}`);
        trashCanImage.classList.add('img__trash-can');

        document.addEventListener('click', function (e) {
            const trashCanId = trashCanImage.getAttribute('id');
            if (e.target.id === trashCanId) {
                const [_, lockerId, date] = trashCanId.split('__');
                console.log("trashCanId: ", trashCanId);
                console.log("lockerId: ", lockerId);
                console.log("date: ", date);
                deleteLocker(lockerId, date);
            }
        });

        bodyRight.appendChild(trashCanImage);

        if (lockerDetails === "No reserved lockers") {
            bodyLeft.innerHTML += `You have no reserved lockers.`;
            bodyText.appendChild(bodyLeft);
        } 
        else {
            if (lockerDateTime.getFullYear() >= day.getFullYear() && lockerDateTime.getMonth() >= day.getMonth() && lockerDateTime.getDate() >= day.getDate()) {
                console.log("today:", today);
                bodyLeft.innerHTML += `<b>Locker No:</b> &nbsp; ${lockerDetails} &emsp;&emsp;&emsp;&emsp; <b>Date:</b> &nbsp; ${lockerDate.date}`;
                bodyText.appendChild(bodyLeft);
                bodyText.appendChild(bodyRight);
                lockerList.appendChild(bodyText);
                lockerList.innerHTML += "<hr>";
            }
        }
    });
}

function formatLockers(lockers, username) {
    if (!lockers || typeof lockers !== 'object') {
        return "No lockers available";
    }

    const lockerArray = Object.values(lockers);

    const reservedLockers = lockerArray.filter(locker => locker && locker.reserveBy === username);

    if (reservedLockers.length === 0) {
        return "No reserved lockers";
    }

    const lockerDetails = reservedLockers.map(locker => `${locker.id}`).join(', ');

    return lockerDetails;
}



