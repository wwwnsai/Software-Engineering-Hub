from fastapi import FastAPI, HTTPException, Form
import ZODB
import transaction
from persistent import Persistent
from fastapi.middleware.cors import CORSMiddleware


class UserData(Persistent):
    def __init__(self, username, email, password, is_logged_in=False):
        self.username = username
        self.email = email
        self.password = password
        self.is_logged_in = is_logged_in

    def toJSON(self):
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "is_logged_in": self.is_logged_in,
        }


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_methods=["*"],
    allow_headers=["*"],
)

# Open a connection to the ZODB database
db = ZODB.DB("db/UserDatabase.fs")


@app.post("/login", tags=["user"])
def login(username: str = Form(...), password: str = Form(...)):
    # Open a ZODB connection
    connection = db.open()
    root = connection.root()

    try:
        if username in root:
            user_data = root[username]
            if user_data.password == password:
                user_data.is_logged_in = True  # Set to True when the user logs in
                transaction.commit()
                return {"message": "Login Succesful"}
            else:
                return {"message": "Incorrect password"}
        else:
            return {"message": "Username does not exist"}
    finally:
        connection.close()


@app.post("/register", tags=["user"])
def register(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    connection = db.open()
    root = connection.root()

    try:
        # Check for duplicate emails
        duplicate_email = next(
            (user_data for user_data in root.values() if user_data.email == email), None)
        if duplicate_email:
            return {"message": "Email already exists"}

        # Create a UserData object and store it in the ZODB
        user_data = UserData(username, email, password)
        root[username] = user_data

        # Commit the transaction
        transaction.commit()

        return {"message": "Registration successful"}
    finally:
        connection.close()


@app.get("/user/{username}", tags=["check_user"])
def get_user(username: str):
    connection = db.open()
    root = connection.root()

    try:
        if username in root:
            user_data = root[username]
            return {
                "username": user_data.username,
                "password": user_data.password,
                "email": user_data.email,
                "is_logged_in": user_data.is_logged_in,
            }
        else:
            raise HTTPException(status_code=404, detail="User not found")
    finally:
        connection.close()


@app.get("/users", tags=["check_user"])
def get_all_users():
    connection = db.open()
    root = connection.root()

    try:
        users = []
        for username, user_data in root.items():
            users.append(user_data.toJSON())

        return {"users": users}
    finally:
        connection.close()

# clears the database


@app.get("/clear_database", tags=["incase"])
def clear_database():
    # Open a ZODB connection
    connection = db.open()
    root = connection.root()

    try:
        root.clear()
        transaction.commit()
        return {"message": "Database cleared"}
    finally:
        connection.close()


@app.post("/logout", tags=["user"])
def logout(username: str):
    # Open a ZODB connection
    connection = db.open()
    root = connection.root()

    try:
        if username in root:
            user_data = root[username]
            user_data.is_logged_in = False  # Set to False when the user logs out
            transaction.commit()
            return {"message": "Logout successful"}
        else:
            return {"message": "Username does not exist"}
    finally:
        connection.close()
