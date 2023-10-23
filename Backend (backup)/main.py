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
templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")



# WEBSITE ================================================================================

@app.get("/", response_class=HTMLResponse, tags=["website"])
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

#Login
@app.get("/login", response_class=HTMLResponse, tags=["website"])
def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

#Sign up
@app.get("/signup", response_class=HTMLResponse, tags=["website"])
def signup(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

#List of items
@app.get("/items", response_class=HTMLResponse, tags=["website"])
def items(request: Request):
    return templates.TemplateResponse("items.html", {"request": request})

#Add item
@app.get("/additem", response_class=HTMLResponse, tags=["website"])
def additem(request: Request):
    return templates.TemplateResponse("additem.html", {"request": request})

# USER ===================================================================================

@app.post("/signup", tags=["user"])
async def create_user(request: Request, user: SignUp, response: Response):
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
    
# User Services
#for updating user
@app.put("/user/update", tags=["user"])
def update_user(request: Request, user: SignUp,):
    userEmail = getPayload(request.cookies.get("token"))["user_id"]
    for userDB in root.users.values():
        if userDB.email == userEmail:
            userDB.username = user.username
            userDB.password = Hash.bcrypt(user.password)
            transaction.commit()
            return {"status": True, "message": "User updated"}
    

#for deleting user
@app.delete("/user/deleteuser", tags=["user"])
def delete_user(request: Request):
    userEmail = getPayload(request.cookies.get("token"))["user_id"]
    for userDB in root.users.values():
        if userDB.email == userEmail:
            del root.users[userDB.id]
            transaction.commit()
            return {"status": True, "message": "User deleted"}
    raise HTTPException(status_code=404, detail="User not found")
    
# ITEM ===================================================================================


# CKECKING ===============================================================================

# Check Users
@app.get("/user/{id}", tags=["check"])
def get_user(id: int):
    if id in root.users:
        return root.users[id].toJSON()
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/users", tags=["check"])
def get_users():
    users = []
    for user in root.users.values():
        users.append(user.toJSON())
    return {"users": users}

# Clear User Database
@app.get("/clear", tags=["check"])
def clear():
    root.users.clear()
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

# Clear cookies
@app.get("/clearCookie", tags=["auth"])
def clear_cookie(response: Response):
    response.delete_cookie(key="token")
    return {"status": True, "message": "Cookie cleared"}

# When server close ===============================================================
@app.on_event("shutdown")
def shutdown_event():
    transaction.commit()
    db.close()
    

    