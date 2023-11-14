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
        setTimeout(() => {
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
    // console.log(selected_dates);
    // submit reserve dates
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
    selected_dates_sorted.sort((a, b) => a - b); // Sort numerically
    let date = selected_dates_sorted
        .map(day => `${currentYear}-${month}-${day}`)
        .join(", ");
    return date;
}

async function reserve() {
    let message = "You have successfully reserved a locker from \n";
    let selected_dates_sorted = selected_date();
    selected_dates_sorted.sort((a, b) => a - b);

    if (selected_dates_sorted.length === 0) {
        alert("Please select a date");
        return;
    }

    const lockerID = 1;  // Replace with the actual locker ID
    const date = getSelectedDates();
    // console.log(date);
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
        showLockers();
        alert(message);
    })
    .catch(error => console.error('Error:', error));
    
    // for (let i = 0; i <= selected_dates_sorted.length-1; i++) {
    //     if (selected_dates_sorted[i+1] - selected_dates_sorted[i] == 1) {
    //         if (i > 0 && selected_dates_sorted[i] - selected_dates_sorted[i-1] != 1) {
    //             message += selected_dates_sorted[i] + " - ";
    //         }
    //         if (i == 0) {
    //             message += selected_dates_sorted[i] + " - ";
    //         }
    //         if (selected_dates_sorted[i+2] - selected_dates_sorted[i+1] != 1) {
    //             message += selected_dates_sorted[i+1] + " " + monthName + " " + currentYear + "\n";
    //         }
    //     }
    //     else if (selected_dates_sorted[i+1] - selected_dates_sorted[i] > 1) {
    //         if (!message.includes(selected_dates_sorted[i])) {
    //             message += selected_dates_sorted[i] + " " + monthName + " " + currentYear + "\n";
    //         }
    //         if (selected_dates_sorted[i+2] - selected_dates_sorted[i+1] != 1) {
    //             message += selected_dates_sorted[i+1] + " " + monthName + " " + currentYear + "\n";
    //         }
    //     }
    // }
    // alert(message);
    
}
    

// view locker
// function show() {
//     fetch('/list/lockers', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//     .then(response => response.json())
//     .then(data => {
//         var lockers = data.lockers;
//         console.log(lockers);
//         var lockerListElement = document.getElementById('lockerlist');
//         lockerListElement.innerHTML = "<p>";  
//         lockers.forEach(function(locker) {
//             lockerListElement.innerHTML += locker.reserveDate + ", ";
//         });
//         lockerListElement.innerHTML += "</p>";
//     })
//     .catch(error => {
//         console.error('Error fetching lockers:', error);
//     });
// }


// Function to fetch lockers and display them
async function showLockers() {
    try {
        const response = await fetch('/list/lockers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch lockers');
        }

        const data = await response.json();
        const lockerDates = data.lockers || [];
        
        displayLockerDates(lockerDates);
    } catch (error) {
        console.error('Error fetching lockers:', error);
    }
}

// Function to display locker dates
function displayLockerDates(lockerDates) {
    const lockerListElement = document.getElementById('lockerlist');
    lockerListElement.innerHTML = "<p>";

    lockerDates.forEach((lockerDate) => {
        const date = lockerDate.date;
        const status = lockerDate.status;
        const lockers = lockerDate.lockers || [];

        lockerListElement.innerHTML += `Date: ${date}, Status: ${status}, Lockers: ${formatLockers(lockers)}<br>`;
        // lockerListElement.innerHTML += `Date: ${date}`;
    });

    lockerListElement.innerHTML += "</p>";
}

// Function to format lockers for display
function formatLockers(lockers) {
    if (!lockers || typeof lockers !== 'object') {
        return "No lockers available";
    }

    const lockerDetails = Object.entries(lockers).map(([id, locker]) => `Locker ID: ${id}, Status: ${locker.status}`).join(', ');

    return lockerDetails || "No lockers available";
}

