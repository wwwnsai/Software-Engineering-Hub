import ZODB, ZODB.FileStorage
import BTrees.OOBTree

from app.db.model import *
from app.auth.jwt_handler import *

storage = ZODB.FileStorage.FileStorage("app/db/database.fs")
db = ZODB.DB(storage)
connection = db.open()
root = connection.root()

print("Root: ", root)
if not hasattr(root, "users"):
    root.users = BTrees.OOBTree.BTree()
    
def checkDuplicateEmail(email):
    for user in root.users.values():
        if user.email == email:
            return True
    return False

def getPayload(token):
    return decodeJWT(token)

def checkUserExists(id):
    for user in root.users.values():
        if user.id == id:
            return True
    return False
    
def get_db():
    db = ZODB.DB(storage)
    connection = db.open()
    root = connection.root()
    return db