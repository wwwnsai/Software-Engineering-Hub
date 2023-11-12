import ZODB, ZODB.FileStorage
import BTrees.OOBTree
import transaction

from app.db.model import *
from app.auth.jwt_handler import *

storage = ZODB.FileStorage.FileStorage("app/db/database.fs")
db = ZODB.DB(storage)
connection = db.open()
root = connection.root()

print("Root: ", root)
if not hasattr(root, "users"):
    root.users = BTrees.OOBTree.BTree()
    
if not hasattr(root, "products"):
    root.products = BTrees.OOBTree.BTree()
    
if not hasattr(root, "borrowed"):
    root.borrowed = BTrees.OOBTree.BTree()
    
def setLockers():
    for i in range(36):
        locker = Locker(i+1, True)
        root.lockers[i] = locker
    transaction.commit()
    
if not hasattr(root, "lockers"):
    root.lockers = BTrees.OOBTree.BTree()
    print("Lockers database have been created")
    setLockers()
print("Lockers already exist")

#USER   
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

#ITEM
def checkDuplicateProduct(id):
    for product in root.products.values():
        if product.id == id:
            return True
    return False

def checkProductExists(id):
    for product in root.products.values():
        if product.id == id:
            return True
    return False

def checkProductAvailable(id):
    for product in root.products.values():
        if product.id == id:
            if product.status == True:
                return True
    return False

#BORROWED
def is_valid_date(date_string):
    try:
        datetime.strptime(date_string, "%Y-%m-%d")
        return True
    except ValueError:
        return False

#LOCKER

    