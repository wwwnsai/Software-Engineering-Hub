from fastapi import FastAPI, Form, HTTPException, Depends, Body, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from schema.userSchema import UserLogin, UserRegister
from schema.postSchema import Post
from auth.jwt_handler import signJWT
from auth.jwt_bearer import JWTBearer

import ZODB
import ZODB.FileStorage
import transaction
import BTrees.OOBTree

app = FastAPI()

# Open a connection to the ZODB database
storage1 = ZODB.FileStorage.FileStorage("db/UserDatabase.fs")
db1 = ZODB.DB(storage1)
connection1 = db1.open()
userData = connection1.root()

storage2 = ZODB.FileStorage.FileStorage("db/PostDatabase.fs")
db2 = ZODB.DB(storage2)
connection2 = db2.open()
postData = connection2.root()

# Use BTrees.OOBTree to store users
print(hasattr(userData, "users"))
if not hasattr(userData, "users"):
    userData.users = BTrees.OOBTree.BTree()

# Use BTrees.OOBTree to store posts
print(hasattr(postData, "posts"))
if not hasattr(postData, "posts"):
    postData.posts = BTrees.OOBTree.BTree()

# templates
templates = Jinja2Templates(directory="templates/")

# Main StaticFiles
app.mount("/images",
          StaticFiles(directory="templates/img"), name="images")
app.mount("/main-css",
          StaticFiles(directory="templates/Main/css"), name="main-css")
app.mount("/main-js",
          StaticFiles(directory="templates/Main/"), name="main-js")


@app.get("/", response_class=HTMLResponse, tags=["Begin"])
def home(request: Request):
    return templates.TemplateResponse("Main/main.html", {"request": request})


def increaseID():
    # Assuming you have already created the ZODB connection and have the 'userData' object

    for key, value in userData.items():
        print(f"Key: {key}, Value: {value}")

    print(hasattr(userData, "id"))
    if not hasattr(userData, "id"):
        userData.id = 0
    userData.id += 1
    return userData.id


@app.post("/user/signup", tags=["user"])
def signup(username: str = Form(), email: str = Form(), password: str = Form()):
    duplicate_email = next(
        (user_data for user_data in userData.values() if user_data.email == email), None)
    if duplicate_email:
        return {"message": "Email already exists"}

    user_data = UserRegister(increaseID(), username, email, password)
    id = user_data.id
    userData[id] = user_data
    transaction.commit()
    return signJWT(username)


def check_user(user_data: UserLogin):
    for user in userData.values():
        if user.username == user_data.username and user.password == user_data.password:
            return True
    return False


@app.post("/user/login", tags=["user"])
def login(username: str = Form(...), password: str = Form(...)):
    user_data = UserLogin(username, password)
    if check_user(user_data):
        return signJWT(username)


@app.put("/updateUser", tags=["user"])
def update_user(id: int, username: str, email: str, password: str):
    if id in userData:
        # Access the user by 'id' instead of 'username'
        user_data = userData[id]
        if username != "":
            user_data.username = username
        if email != "":
            user_data.email = email
        if password != "":
            user_data.password = password
        transaction.commit()
        return {"message": "User updated"}
    raise HTTPException(status_code=404, detail="User not found")


@app.delete("/deleteUser", tags=["user"])
def delete_user(id: int):
    if id in userData:
        del userData[id]
        transaction.commit()
        return {"message": "User deleted"}
    raise HTTPException(status_code=404, detail="User not found")


@app.get("/user/{id}", tags=["user"])
def get_user(id: int):
    if id in userData:
        user_data = userData[id]
        return user_data.toJSON()
    raise HTTPException(status_code=404, detail="User not found")


@app.get("/users", tags=["check_users"])
def get_all_users():
    users = []
    for username, user_data in userData.items():
        users.append(user_data.toJSON())
    return {"users": users}


@app.get("/clear", tags=["incase"])
def clear_database():
    userData.clear()
    transaction.commit()
    return {"message": "Database cleared"}


@app.on_event("shutdown")
async def shutdown_event():
    transaction.commit()
    connection1.close()
    connection2.close()
    db1.close()
    db2.close()


def increasePostID():
    # Assuming you have already created the ZODB connection and have the 'postData' object

    for key, value in postData.items():
        print(f"Key: {key}, Value: {value}")

    print(hasattr(postData, "id"))
    if not hasattr(postData, "id"):
        postData.id = 0
    postData.id += 1
    return postData.id


@app.get("/post/{id}", tags=["post"])
def get_post(id: int):
    if id in postData:
        post_data = postData[id]
        return post_data.toJSON()
    raise HTTPException(status_code=404, detail="Post not found")


@app.post("/post/create", tags=["post"], dependencies=[Depends(JWTBearer())])
def create_post(post_data: dict = Body(...)):
    id = increasePostID()
    post_data = Post(id, post_data["title"],
                     post_data["content"], post_data["author"])
    postData[id] = post_data
    transaction.commit()
    return {"message": "Post created"}
