from fastapi import FastAPI, Request, Depends, HTTPException, Response, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


import transaction

from app.auth.jwt_bearer import JWTBearer
from app.auth.jwt_handler import *
from app.hashing import *

from app.schemas.user import SignUp, UserInfo, Login
from app.db.model import User as UserDB

from app.db.database import *

app = FastAPI()


# templates
templates = Jinja2Templates(directory="templates/")

# Image StaticFiles
app.mount("/images",
          StaticFiles(directory="templates/img"), name="images")


# WEBSITE ================================================================================

# Main

# Main StaticFiles
app.mount("/main-css",
          StaticFiles(directory="templates/Main/css"), name="main-css")
app.mount("/main-js",
          StaticFiles(directory="templates/Main/"), name="main-js")


@app.get("/", response_class=HTMLResponse, tags=["website"])
async def index(request: Request):
    return templates.TemplateResponse("Main/main.html", {"request": request})

# Login & SignUp

# Login StaticFiles
app.mount("/login-css",
          StaticFiles(directory="templates/LoginPage/"), name="login-css")
app.mount("/login-js",
          StaticFiles(directory="templates/LoginPage/"), name="login-js")


@app.get("/login", response_class=HTMLResponse, tags=["website"])
async def login(request: Request):
    return templates.TemplateResponse("LoginPage/login.html", {"request": request})

# Sign up

@app.get("/signup", response_class=HTMLResponse, tags=["website"])
async def signup(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

# User info

@app.get("/userinfo", response_class=HTMLResponse, tags=["website"])
async def userinfo(request: Request):
    return templates.TemplateResponse("userinfo.html", {"request": request})

# Items Borrow

# List of items

@app.get("/items", response_class=HTMLResponse, tags=["website"])
async def items(request: Request):
    return templates.TemplateResponse("items.html", {"request": request})

# Add item

@app.get("/additem", response_class=HTMLResponse, tags=["website"])
async def additem(request: Request):
    return templates.TemplateResponse("additem.html", {"request": request})

# Locker

# Login StaticFiles
app.mount("/locker-css",
          StaticFiles(directory="templates/Locker/css"), name="locker-css")
app.mount("/locker-js",
          StaticFiles(directory="templates/Locker/"), name="locker-js")

@app.get("/student_locker", response_class=HTMLResponse, tags=["website"])
async def items(request: Request):
    return templates.TemplateResponse("Locker/locker.html", {"request": request})

# USER ===================================================================================

@app.post("/signup", tags=["user"])
async def create_user(request: Request, user: SignUp, response: Response):
    if not checkDuplicateEmail(user.email):
        user = UserDB(user.id, user.username, user.email,
                      Hash.bcrypt(user.password))
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
                raise HTTPException(
                    status_code=400, detail="Incorrect password")
    raise HTTPException(status_code=404, detail="User not found")

# User Services
# for updating user

@app.put("/user/update", tags=["user"])
async def update_user(request: Request, user: SignUp,):
    userEmail = getPayload(request.cookies.get("token"))["user_id"]
    for userDB in root.users.values():
        if userDB.email == userEmail:
            userDB.username = user.username
            userDB.password = Hash.bcrypt(user.password)
            transaction.commit()
            return {"status": True, "message": "User updated"}

# for deleting user
@app.delete("/user/deleteuser", tags=["user"])
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
    return {"status": True, "message": "Logout successful"}

# USER INFO ==============================================================================

@app.get("/userinfo", tags=["userinfo"])
async def get_userinfo(request: Request):
    userEmail = getPayload(request.cookies.get("token"))["user_id"]
    for userDB in root.users.values():
        if userDB.email == userEmail:
            return {"status": True, "message": "User found", "userinfo": userDB.toJSON()}
    raise HTTPException(status_code=404, detail="User not found")

# ITEM ===================================================================================


# CKECKING ===============================================================================

# Check Users
@app.get("/user/{id}", tags=["check"])
async def get_user(id: int):
    if id in root.users:
        return root.users[id].toJSON()
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/users", tags=["check"])
async def get_users():
    users = []
    for user in root.users.values():
        users.append(user.toJSON())
    return {"users": users}

# Clear User Database

@app.get("/clear", tags=["check"])
async def clear():
    root.users.clear()
    transaction.commit()
    return {"status": True, "message": "Database cleared"}

# AUTH ===================================================================================

# Check Token

@app.get("/checkToken", tags=["auth"])
async def check_token(request: Request):
    token = request.cookies.get("token")
    if token:
        decoded_token = decodeJWT(token)
        if decoded_token:
            return {"status": True}
        else:
            return {"status": False}
    else:
        return {"status": False}

# Clear cookies

@app.get("/clearCookie", tags=["auth"])
async def clear_cookie(response: Response):
    response.delete_cookie(key="token")
    return {"status": True, "message": "Cookie cleared"}

# When server close ===============================================================

@app.on_event("shutdown")
async def shutdown_event():
    transaction.commit()
    db.close()
