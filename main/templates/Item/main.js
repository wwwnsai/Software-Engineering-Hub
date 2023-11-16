const itemContainer = document.getElementById("itemContainer");
const borrowContainer = document.getElementById("borrowContainer");
const returnContainer = document.getElementById("returnContainer");
const addProductContainer = document.getElementById("addProductContainer");
const itemMenuSelections = document.querySelectorAll(".item__menu-list");
const borrowEmpty = document.getElementById("borrowEmpty");
const borrowBtn = document.getElementById("borrowBtn");
const returnEmpty = document.getElementById("returnEmpty");
const addProductForm = document.getElementById("addProductForm");

function checkStock(allProducts) {
    fetch(`/userinfo`, {})
        .then((response) => response.json())
        .then((data) => {
            allProducts.forEach((product) => {
                if (
                    product.stock === 0 &&
                    product.status === false &&
                    !data.user.items.includes(product.name)
                ) {
                    console.log(product);
                    document.getElementById(`${product.name}`).style.display =
                        "none";
                    document.getElementById(
                        `confirm-${product.name}`
                    ).style.display = "none";
                    document.getElementById(
                        `unavailable-${product.name}`
                    ).style.display = "flex";
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching user information:", error);
        });
}

function returnItem() {
    const allReturnBtns = document.querySelectorAll(".return__logo");
    const allReturnLists = document.querySelectorAll(".return__list");

    allReturnBtns.forEach((returnBtn) => {
        returnBtn.addEventListener("click", function () {
            allReturnLists.forEach((returnList) => {
                if (returnBtn.id === returnList.id) {
                    document.getElementById(`${returnBtn.id}`).style.display =
                        "flex";
                    document.getElementById(
                        `confirm-${returnBtn.id}`
                    ).style.display = "none";
                    returnList.remove();
                }
            });

            fetch("/user/return/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: returnBtn.id,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === true) {
                        fetch(`/userinfo`, {})
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.user.items.length === 0) {
                                    returnEmpty.style.display = "block";
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    "Error fetching user information:",
                                    error
                                );
                            });
                        alert("Returned Successful");
                    } else {
                        alert("Returned Failed" + data.detail);
                    }
                })
                .catch((error) => {
                    console.error("Error during return:", error);
                });
        });
    });
}

function addItemReturn(product) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("return__list");
    itemCard.id = `${product.product}`;

    itemCard.innerHTML = `
        <p>${product.product}</p><p>Return By ${product.dateOfReturn}</p>
        <p class="return__logo" id="${product.product}">
            <i style="margin-right: 1rem;" class="icon icon-return fa-solid fa-arrow-left"></i>Return
        </p>`;

    returnContainer.appendChild(itemCard);
}

function checkBorrowItem() {
    let userLogged;

    const allReturnLists = document.querySelectorAll(".return__list");

    allReturnLists.forEach((returnList) => {
        returnList.remove();
    });

    fetch("/userinfo")
        .then((response) => response.json())
        .then((data) => {
            userLogged = data.user.username;

            fetch("/list/borrowed")
                .then((response) => response.json())
                .then((data) => {
                    data.borrowed.forEach((borrowed) => {
                        if (borrowed.name === userLogged) {
                            returnEmpty.style.display = "none";
                            addItemReturn(borrowed);
                        } else {
                            returnEmpty.style.display = "block";
                        }
                    });

                    returnItem();
                })
                .catch((error) => {
                    console.error("Error fetching product information:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching user information:", error);
        });
}

if (addProductForm) {
    addProductForm.addEventListener("submit", addProduct);
}

function addProduct(event) {
    event.preventDefault();

    let productId = document.getElementById("product-id").value;
    let productName = document.getElementById("product-name").value;
    let productAmount = document.getElementById("product-amount").value;

    fetch("/products/addproduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: productId,
            name: productName,
            stock: productAmount,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === true) {
                let mainInput = document.querySelectorAll(".main__input");
                mainInput.forEach((mi) => {
                    mi.value = "";
                });

                const allItemCard = document.querySelectorAll(".item__card");

                allItemCard.forEach((itemCard) => {
                    itemCard.remove();
                });

                fetchData();
                alert("Added Successful");
            } else {
                alert("Added Failed" + data.detail);
            }
        })
        .catch((error) => {
            console.error("Error during add:", error);
        });
}

let itemList = [];

function handleItemMenuClick(event) {
    itemMenuSelections.forEach((item) => {
        item.classList.remove("item__menu-list--active");
    });

    const clickedElement = event.target;
    clickedElement.classList.add("item__menu-list--active");

    itemContainer.style.display = "none";
    borrowContainer.style.display = "none";
    returnContainer.style.display = "none";
    addProductContainer.style.display = "none";

    determineContainerToShow(clickedElement);
}

function determineContainerToShow(clickedElement) {
    if (clickedElement.id === "item__menu-list--1") {
        itemContainer.style.display = "grid";
    } else if (clickedElement.id === "item__menu-list--2") {
        borrowContainer.style.display = "flex";
    } else if (clickedElement.id === "item__menu-list--3") {
        returnContainer.style.display = "flex";
    } else if (clickedElement.id === "item__menu-list--4") {
        addProductContainer.style.display = "flex";
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
    img.src = "/images/image/kmitl_photo_2.jpg";
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

    const unavailableDiv = document.createElement("div");
    unavailableDiv.classList.add("item__unavailable-btn");
    unavailableDiv.id = `unavailable-Product ${product.id}`;
    unavailableDiv.innerHTML =
        '<i class="icon fa-solid fa-xmark"></i>Unavailable';

    itemCard.appendChild(upperDiv);
    itemCard.appendChild(lowerDiv);
    itemCard.appendChild(btnDiv);
    itemCard.appendChild(confirmDiv);
    itemCard.appendChild(unavailableDiv);

    itemContainer.appendChild(itemCard);
}

function addItemBorrow(product) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("borrow__list");
    itemCard.id = `${product.name}`;

    itemCard.innerHTML = `
    <p>${product.name}</p><p>Return By ${product.dateOfReturn}</p>
    <i class="icon icon-delete fa-solid fa-trash-can" id="${product.name}"></i>`;

    borrowContainer.insertBefore(itemCard, borrowBtn);
}

function deleteBorrow() {
    const allDeleteBtn = document.querySelectorAll(".icon-delete");
    const allBorrowList = document.querySelectorAll(".borrow__list");

    allDeleteBtn.forEach((delBtn) => {
        delBtn.addEventListener("click", function () {
            const storedItemList = localStorage.getItem("itemList");
            let itemListArray = JSON.parse(storedItemList);

            allBorrowList.forEach((borrowList) => {
                if (borrowList.id === delBtn.id) {
                    borrowList.remove();
                }

                if (borrowList.id === delBtn.id) {
                    itemListArray.forEach((item) => {
                        const productName = item.name;
                        document.getElementById(
                            `${productName}`
                        ).style.display = "flex";
                        document.getElementById(
                            `confirm-${productName}`
                        ).style.display = "none";
                    });
                }
            });

            let nameToDelete = delBtn.id;

            let newItemList = itemList.filter(
                (item) => item.name !== nameToDelete
            );

            itemList = newItemList;

            let newArray = itemListArray.filter(
                (item) => item.name !== nameToDelete
            );

            localStorage.setItem("itemList", JSON.stringify(newArray));

            const newStoredItemList = localStorage.getItem("itemList");

            if (
                newStoredItemList &&
                JSON.parse(newStoredItemList).length === 0
            ) {
                borrowEmpty.style.display = "block";
                borrowBtn.style.display = "none";

                localStorage.removeItem("itemList");
            }

            fetchReload();
        });
    });
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

            deleteBorrow();
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
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
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

            itemList = [];

            checkBorrowItem();
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
function fetchReload() {
    const storedItemList = localStorage.getItem("itemList");

    if (storedItemList && storedItemList.length !== 0) {
        const itemListArray = JSON.parse(storedItemList);

        itemListArray.forEach((item) => {
            const productName = item.name;
            document.getElementById(`${productName}`).style.display = "none";
            document.getElementById(`confirm-${productName}`).style.display =
                "flex";
        });
    }
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

            checkBorrowItem();

            checkStock(allProducts);

            cardBorrow();

            addBtnClicked();

            fetchReload();

            deleteBorrow();

            fetchUserBorrowed();
        })
        .catch((error) => {
            console.error("Error fetching product information:", error);
        });
}

window.addEventListener("load", fetchData());
