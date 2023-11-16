from fastapi import FastAPI, Request, Depends, HTTPException, Response, Cookie, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

import transaction

from app.auth.jwt_bearer import JWTBearer
from app.auth.jwt_handler import *
from app.hashing import *

from app.schemas.user import SignUp, UserInfo, Login
from app.db.model import User as UserDB

from app.schemas.product import addProduct, borrowProduct
from app.db.model import Product as ProductDB

from app.db.model import BorrowedList as BorrowedDB

from app.db.model import Locker as LockerDB

from app.db.database import *

app = FastAPI()

# templates
templates = Jinja2Templates(directory="templates/")

# Image StaticFiles
app.mount("/images",
          StaticFiles(directory="templates/img"), name="images")

# WEBSITE ================================================================================

# Universal -------------------------------------

# Universal StaticFiles
app.mount("/universal-css",
          StaticFiles(directory="templates/Universal/css"), name="universal-css")
app.mount("/universal-js",
          StaticFiles(directory="templates/Universal/"), name="universal-js")

# Main -------------------------------------

# Main StaticFiles
app.mount("/main-static",
          StaticFiles(directory="templates/Main/"), name="main-static")

@app.get("/", response_class=HTMLResponse, tags=["website"])
async def index(request: Request):
    return templates.TemplateResponse("Main/main.html", {"request": request})

# Admission -------------------------------------

# Main StaticFiles
app.mount("/admission-static",
          StaticFiles(directory="templates/Admission/"), name="admission-static")

@app.get("/admission", response_class=HTMLResponse, tags=["website"])
async def admission(request: Request):
    return templates.TemplateResponse("Admission/admission.html", {"request": request})

# Login & SignUp -------------------------------------

# Login StaticFiles
app.mount("/login-static",
          StaticFiles(directory="templates/LoginPage/"), name="login-static")

@app.get("/login", response_class=HTMLResponse, tags=["website"])
async def login(request: Request):
    return templates.TemplateResponse("LoginPage/login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse, tags=["website"])
async def signup(request: Request):
    return templates.TemplateResponse("LoginPage/register.html", {"request": request})

# User info -------------------------------------

# User info StaticFiles
app.mount("/userinfos-static",
          StaticFiles(directory="templates/UserInfo/"), name="userinfos-static")

@app.get("/userinfos", response_class=HTMLResponse, tags=["website"])
async def userinfo(request: Request):
    return templates.TemplateResponse("UserInfo/userinfo.html", {"request": request})

# Parking Reservation -------------------------------------

# Parking StaticFiles
app.mount("/parking-static",
          StaticFiles(directory="templates/ParkingReservation/"), name="parking-static")

@app.get("/parking", response_class=HTMLResponse, tags=["website"])
async def parking(request: Request):
    return templates.TemplateResponse("ParkingReservation/parking.html", {"request": request})

# Items Borrow -------------------------------------

# Items StaticFiles
app.mount("/item-static",
          StaticFiles(directory="templates/Item/"), name="item-static")

@app.get("/item", response_class=HTMLResponse, tags=["website"])
async def items(request: Request):
    return templates.TemplateResponse("Item/item.html", {"request": request})

# Add item
@app.get("/products/addproduct", response_class=HTMLResponse, tags=["website"])
async def additem(request: Request):
    return templates.TemplateResponse("addproduct.html", {"request": request})

# Locker -------------------------------------

# Locker StaticFiles
app.mount("/locker-static",
          StaticFiles(directory="templates/Locker/"), name="locker-static")

@app.get("/locker", response_class=HTMLResponse, tags=["website"])
async def locker(request: Request):
    return templates.TemplateResponse("Locker/locker.html", {"request": request})

# USER ===================================================================================

@app.post("/signup", tags=["user"])
async def create_user(request: Request, user: SignUp):
    if not checkDuplicateEmail(user.email):
        user = UserDB(user.id, user.username, user.email, Hash.bcrypt(user.password))
        root.users[user.id] = user
        transaction.commit()
        token = signJWT(user.email)
        return {"status": True, "message": "User created", "token": token}
    else:
        raise HTTPException(status_code=400, detail="User already exists")
    
@app.post("/login", tags=["user"])
async def login_user(user: Login, response: Response):
    for userDB in root.users.values():
        if userDB.email == user.email:
            if Hash.verify(userDB.password, user.password):
                token = signJWT(user.email)
                response.set_cookie(key="token", value=token) 
                return {"status": True, "message": "User logged in", "token": token}
            else:
                raise HTTPException(status_code=400, detail="Incorrect password")
    raise HTTPException(status_code=404, detail="User not found")
    
# User Services ==============================================================================
#for borrowing item
@app.post("/user/borrow/", tags=["user-service"])
async def borrowProduct(request: Request, product: borrowProduct):
    try:
        userEmail = getPayload(request.cookies.get("token"))["user_id"]
    except (KeyError, TypeError):
        # Handle the exception if "token" is missing or doesn't contain "user_id"
        return {"status": False, "message": "Invalid token", "THEN":"Return to login page"}

    for userDB in root.users.values():
        if userDB.email == userEmail:
            for productDB in root.products.values():
                if productDB.name == product.name:
                    if productDB.status == True:
                        productDB.stock -= 1
                        if productDB.stock == 0:
                            productDB.status = False
                        userDB.borrowProduct(productDB.name)
                        #then add to borrowed db
                        borrowed = BorrowedDB(userDB.username, productDB.name, product.dateOfReturn)
                        i = BorrowedList.idCounter
                        while i in root.borrowed:
                            i += 1
                        root.borrowed[i] = borrowed
                        return {"status": True, "message": "Item borrowed"}
                    else:
                        return {"status": False, "message": "Item not available"}
            return {"status": False, "message": "Item not found"}
    return {"status": False, "message": "User not found"}

# return item
@app.post("/user/return/", tags=["user-service"])
async def returnProduct(request :Request, productname: str=Form()):
    try:
        userEmail = getPayload(request.cookies.get("token"))["user_id"]
    except (KeyError, TypeError):
        # Handle the exception if "token" is missing or doesn't contain "user_id"
        return {"status": False, "message": "Invalid token", "THEN":"Return to login page"}

    for userDB in root.users.values():
        if userDB.email == userEmail:
            for productDB in root.products.values():
                if productDB.name == productname:
                    for i in root.borrowed:
                        if root.borrowed[i].product == productname:
                            del root.borrowed[i]
                            userDB.items.remove(productname)
                            if productDB.status == False:
                                productDB.status = True
                            productDB.stock += 1
                            transaction.commit()
                            return {"status": True, "message": "Item returned"}
                    return {"status": False, "message": "Item not found in borrowed list"}
            return {"status": False, "message": "Item not found"}
    return {"status": False, "message": "User not found"}

#reserve locker
@app.post("/user/reserve/", tags=["user-service"])
async def reserveLocker(request :Request, date: str=Form()):
    try:
        token = request.cookies.get("token")
        if not token:
            raise ValueError("Token is missing")

        userEmail = getPayload(token).get("user_id")
        if not userEmail:
            raise ValueError("User email not found in the token")
    except ValueError as e:
        return {"status": False, "message": str(e), "THEN": "Return to login page"}

    # for dateDB in date:
    userDB = next((user for user in root.users.values() if user.email == userEmail), None)
    if userDB is None:
        return {"status": False, "message": "User not found"}

    lockerDB = root.locker_dates.get(date, None)
    print(lockerDB.date)

    if lockerDB is None:
        return {"status": False, "message": "Locker date not found"}
    
    available_locker = next((locker for locker in list(lockerDB.lockers.values()) if locker.status), None)

    if available_locker is None:
        return {"status": False, "message": "No available locker"}
    print(available_locker.id)
    available_locker.status = False
    available_locker.reserveBy = userDB.username
    transaction.commit()

    return {"status": True, "message": f"Locker No. {available_locker.id} reserved", "date": date}


#for updating user
@app.put("/user/update", tags=["user-service"])
async def update_user(request: Request, user: SignUp):
    try:
        userEmail = getPayload(request.cookies.get("token"))["user_id"]
    except (KeyError, TypeError):
        # Handle the exception if "token" is missing or doesn't contain "user_id"
        return {"status": False, "message": "Invalid token", "THEN":"Return to login page"}

    for userDB in root.users.values():
        if userDB.email == userEmail:
            userDB.username = user.username
            userDB.password = Hash.bcrypt(user.password)
            transaction.commit()
            return {"status": True, "message": "User updated"}

    return {"status": False, "message": "User not found"}

#for deleting user
@app.delete("/user/deleteuser", tags=["user-service"])
async def delete_user(request: Request):
    userEmail = getPayload(request.cookies.get("token"))["user_id"]
    for userDB in root.users.values():
        if userDB.email == userEmail:
            del root.users[userDB.id]
            transaction.commit()
            return {"status": True, "message": "User deleted"}
    raise HTTPException(status_code=404, detail="User not found")

# Logout
@app.get("/logout", tags=["user"])
async def logout(response: Response):
    response.delete_cookie(key="token")
    return RedirectResponse("/", status_code=302)

# USER INFO ==============================================================================
@app.get("/userinfo", tags=["userinfo"])
async def get_userinfo(request: Request):
    try:
        userEmail = getPayload(request.cookies.get("token"))["user_id"]
    except (KeyError, TypeError):
        # Handle the exception if "token" is missing or doesn't contain "user_id"
        return {"status": False, "message": "Invalid token", "THEN":"Return to login page"}

    for userDB in root.users.values():
        if userDB.email == userEmail:
            return {"status": True, "message": "User found", "user": userDB.showInfo()}
    return {"status": False, "message": "User not found"}
    
# PRODUCT ===================================================================================
@app.post("/products/addproduct", tags=["product"])
async def add_product(request: Request, product: addProduct):
    if not checkDuplicateProduct(product.id):
        product = ProductDB(product.id, product.name, product.stock)
        root.products[product.id] = product
        transaction.commit()
        return {"status": True, "message": "Product added"}
    else:
        root.products[product.id].stock += product.stock
        root.products[product.id].status = True
        transaction.commit()
        return {"status": True, "message": "Product added"}

# CHECKING ===============================================================================

# Check Users
@app.post("/user/{id}", tags=["check"])
async def get_user(id: int):
    if id in root.users:
        return {"status": True, "message": "User found", "user": root.users[id].toJSON()}
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.post("/list/user", tags=["check"])
async def get_users():
    usersList = []
    for user in root.users.values():
        usersList.append(user.toJSON())
    return {"users": usersList}

# Clear User Database
@app.post("/clearUser", tags=["clear"])
async def clear():
    root.users.clear()
    transaction.commit()
    return {"status": True, "message": "Database cleared"}

# Check Products
@app.get("/list/product", tags=["check"])
def get_products():
    products = []
    for product in root.products.values():
        products.append(product.toJSON())
    return products

# Clear Product Database
@app.post("/clearProduct", tags=["clear"])
async def clear():
    root.products.clear()
    transaction.commit()
    return {"status": True, "message": "Database cleared"}

# Check BorrowedList
@app.post("/list/borrowed", tags=["check"])
async def get_borrowed():
    borrowed = []
    for borrow in root.borrowed.values():
        borrowed.append(borrow.toJSON())
    return {"borrowed": borrowed}

# Clear Borrowed Database
@app.post("/clearBorrowed", tags=["clear"])
async def clear():
    root.borrowed.clear()
    transaction.commit()
    return {"status": True, "message": "Database cleared"}

# List of Lockers
@app.post("/list/lockers", tags=["check"])
async def get_lockers():
    lockers = []
    for locker in root.locker_dates.values():
        lockers.append(locker.toJSON())
    return {"lockers": lockers}

# Delete Locker reservation
@app.post("/delete/locker", tags=["check"])
async def delete_locker(id: int=Form(), date: str=Form()):
    lockerDB = root.locker_dates.get(date, None)
    if lockerDB is None:
        return {"status": False, "message": "Locker date not found"}
    
    locker = lockerDB.lockers.get(id, None)
    if locker is None:
        return {"status": False, "message": "Locker not found"}
    
    locker.status = True
    locker.reserveBy = None
    transaction.commit()
    return {"status": True, "message": "Locker reservation deleted"}

# Clear Locker Database
@app.post("/clearLocker", tags=["clear"])
async def clear():
    # root.lockers.clear()
    root.locker_dates.clear()
    
    new_locker_dates = setLocker_dates()
    root.locker_dates.update(new_locker_dates)

    transaction.commit()
    return {"status": True, "message": "Database cleared"}

# AUTH ===================================================================================

# Check Token
@app.get("/checkToken", tags=["auth"])
async def check_token(request:Request):
    token = request.cookies.get("token")
    if token:
        decoded_token = decodeJWT(token)
        if decoded_token:
            return {"status": True}
        else:
            return {"status": False}
    else:
        return {"status": False}
    #         user_id = decoded_token.get("user_id")
    #         if user_id and user_id in root.users:
    #             user_data = root.users[user_id].toJSON()
    #             return {"status": True, "user": user_data}
    #         else:
    #             return {"status": False, "message": "User not found"}
    #     else:
    #         return {"status": False, "message": "Invalid token"}
    # else:
    #     return {"status": False, "message": "Token not found"}

# Clear cookies
@app.get("/clearCookie", tags=["auth"])
async def clear_cookie(response: Response):
    response.delete_cookie(key="token")
    return {"status": True, "message": "Cookie cleared"}

# Clear All
@app.get("/clearAll", tags=["clear"])
async def clear_all(response: Response):
    root.users.clear()
    root.products.clear()
    root.borrowed.clear()
    root.lockers.clear()
    setLocker_dates()
    transaction.commit()
    response.delete_cookie(key="token")
    return {"status": True, "message": "All database cleared"}

# When server close ===============================================================
@app.on_event("shutdown")
async def shutdown_event():
    transaction.commit()
    db.close()
    