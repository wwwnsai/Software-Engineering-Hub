const itemContainer = document.getElementById("itemContainer");
const borrowContainer = document.getElementById("borrowContainer");
const returnContainer = document.getElementById("returnContainer");
const itemMenuSelections = document.querySelectorAll(".item__menu-list");
const borrowEmpty = document.getElementById("borrowEmpty");
const borrowBtn = document.getElementById("borrowBtn");

const itemList = [];

function handleItemMenuClick(event) {
    itemMenuSelections.forEach((item) => {
        item.classList.remove("item__menu-list--active");
    });

    const clickedElement = event.target;
    clickedElement.classList.add("item__menu-list--active");

    itemContainer.style.display = "none";
    borrowContainer.style.display = "none";
    returnContainer.style.display = "none";

    determineContainerToShow(clickedElement);
}

function determineContainerToShow(clickedElement) {
    if (clickedElement.id === "item__menu-list--1") {
        itemContainer.style.display = "grid";
    } else if (clickedElement.id === "item__menu-list--2") {
        borrowContainer.style.display = "flex";
    } else if (clickedElement.id === "item__menu-list--3") {
        returnContainer.style.display = "flex";
    }
}

itemMenuSelections.forEach((item) => {
    item.addEventListener("click", handleItemMenuClick);
});

function addCard(product) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item__card");

    const upperDiv = document.createElement("div");
    upperDiv.classList.add("item__card--upper");

    const img = document.createElement("img");
    img.classList.add("item__card-img");
    img.src = "/images/image/kmitl_photo_1.jpg";
    img.alt = "img";

    upperDiv.appendChild(img);

    const lowerDiv = document.createElement("div");
    lowerDiv.classList.add("item__card--lower");

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("item__card-name");
    nameDiv.textContent = product.name;

    lowerDiv.appendChild(nameDiv);

    const btnDiv = document.createElement("div");
    btnDiv.classList.add("item__card-btn");
    btnDiv.id = `Product ${product.id}`;
    btnDiv.innerHTML = '<i class="icon fa-solid fa-plus"></i>Add to list';

    const confirmDiv = document.createElement("div");
    confirmDiv.classList.add("item__comfirm-btn");
    confirmDiv.id = `confirm-Product ${product.id}`;
    confirmDiv.innerHTML = '<i class="icon fa-solid fa-check"></i></i>Borrowed';

    itemCard.appendChild(upperDiv);
    itemCard.appendChild(lowerDiv);
    itemCard.appendChild(btnDiv);
    itemCard.appendChild(confirmDiv);

    itemContainer.appendChild(itemCard);
}

function addItemBorrow(product) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("borrow__list");
    itemCard.id = `${product.name}`;

    itemCard.innerHTML = `
    <p>${product.name}</p><p>Return By ${product.dateOfReturn}</p>
    <i class="icon fa-solid fa-trash-can"></i>`;

    borrowContainer.appendChild(itemCard);
    borrowContainer.insertBefore(itemCard, borrowBtn);
}

function saveItemList() {
    localStorage.setItem("itemList", JSON.stringify(itemList));
}

function checkItem() {
    const storedItemList = localStorage.getItem("itemList");

    if (storedItemList && storedItemList.length !== 0) {
        borrowEmpty.style.display = "none";
        borrowBtn.style.display = "block";
    }
}

function loadItemList() {
    const storedItemList = localStorage.getItem("itemList");

    if (storedItemList) {
        itemList.push(...JSON.parse(storedItemList));
        itemList.forEach((item) => {
            addItemBorrow(item);
        });
    }
}

function cardBorrow() {
    const cardElements = document.querySelectorAll(".item__card-btn");

    cardElements.forEach(function (card) {
        card.addEventListener("click", function () {
            const productName = card.id;

            const today = new Date();
            const next7Days = new Date(today);
            next7Days.setDate(today.getDate() + 7);
            const formattedDateOfReturn = next7Days.toISOString().split("T")[0];

            const requestBody = {
                name: productName,
                dateOfReturn: formattedDateOfReturn,
            };

            itemList.push(requestBody);

            addItemBorrow(requestBody);

            saveItemList();

            checkItem();
        });
    });
}

checkItem();
loadItemList();

function fetchBorrow() {
    const storedItemList = localStorage.getItem("itemList");

    if (storedItemList) {
        try {
            const itemListArray = JSON.parse(storedItemList);

            itemListArray.forEach((item) => {
                console.log("Item:", item);

                const requestBody = {
                    name: item.name,
                    dateOfReturn: item.dateOfReturn,
                };

                fetch("/user/borrow/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                })
                    .then((response) => {
                        console.log(response);
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Data from /user/borrow:", data);
                    })
                    .catch((error) => {
                        console.error(
                            "There was a problem with the fetch operation:",
                            error
                        );
                    });
            });

            localStorage.removeItem("itemList");

            let elements = document.querySelectorAll(".borrow__list");

            elements.forEach(function (element) {
                element.remove();
            });

            borrowEmpty.style.display = "block";
            borrowBtn.style.display = "none";
        } catch (error) {
            console.error("Error parsing stored item list:", error);
        }
    } else {
        console.log("No item list found in local storage");
    }
}

borrowBtn.addEventListener("click", fetchBorrow);

function addBtnClicked() {
    const itemCardBtns = document.querySelectorAll(".item__card-btn");

    itemCardBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const productName = btn.id;
            document.getElementById(`${productName}`).style.display = "none";
            document.getElementById(`confirm-${productName}`).style.display =
                "flex";
        });
    });
}

function fetchUserBorrowed() {
    fetch(`/userinfo`, {})
        .then((response) => response.json())
        .then((data) => {
            data.user.items.forEach((borrowed) => {
                document.getElementById(`${borrowed}`).style.display = "none";
                document.getElementById(`confirm-${borrowed}`).style.display =
                    "flex";
            });
        })
        .catch((error) => {
            console.error("Error fetching user information:", error);
        });
}

function fetchData() {
    fetch("/list/product")
        .then((response) => response.json())
        .then((allProducts) => {
            allProducts.forEach((product) => {
                addCard(product);
            });

            cardBorrow();

            addBtnClicked();

            fetchUserBorrowed();
        })
        .catch((error) => {
            console.error("Error fetching product information:", error);
        });
}

fetchData();
