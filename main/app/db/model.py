import persistent
import datetime
import BTrees.OOBTree

class User(persistent.Persistent):
    def __init__(self, id, username, email, password) -> None:
        self.id = id
        self.username = username
        self.email = email
        self.password = password
        self.items = []
    
    def borrowProduct(self, product):
        self.items.append(product)
        self._p_changed = True
        
    def toJSON(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "items": self.items
        }
        
    def showInfo(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "items": self.items
        }
        

class Product(persistent.Persistent):
    def __init__(self, id, name, stock, status = True) -> None:
        self.id = id
        self.name = name
        self.stock = stock
        self.status = status # True = Available, False = Unavailable
        
    def borrow(self, user):
        self.borrower = user
        
    def toJSON(self):
        return {
            "id": self.id,
            "name": self.name,
            "stock": self.stock,
            "status": self.status
        }
        
    def showInfo(self):
        return {
            "id": self.id,
            "name": self.name,
            "stock": self.stock,
        }
        

class BorrowedList(persistent.Persistent):
    idCounter = 0
    
    def __init__(self, name, product, dateOfReturn) -> None:
        self.id = BorrowedList.idCounter
        BorrowedList.idCounter += 1
        self.name = name
        self.product = product
        self.dateOfBorrow = datetime.datetime.now()
        self.dateOfReturn = dateOfReturn
        
    def toJSON(self):
        return {
            "id": self.id,
            "name": self.name,
            "product": self.product,
            "dateOfBorrow": self.dateOfBorrow,
            "dateOfReturn": self.dateOfReturn
        }
        
    def showInfo(self):
        return {
            "id": self.id,
            "name": self.name,
            "product": self.product,
            "dateOfBorrow": self.dateOfBorrow,
            "dateOfReturn": self.dateOfReturn
        }
        
class Locker(persistent.Persistent):
    amount = 40
    
    def __init__(self, id, status = True) -> None:
        self.id = id
        self.status = status # True = Available, False = Unavailable
        self.reserveBy = None
        
    def borrow(self, user):
        self.reserveBy = user
        
    def toJSON(self):
        return {
            "id": self.id,
            "status": self.status,
            "reserveBy": self.reserveBy,
        }
        
    def showInfo(self):
        return {
            "id": self.id
        }
        
    def available(self):
        return self.status
    
    def reserve(self, user):
        self.reservedLocker.append(user)
        self._p_changed = True

class Locker_dates(persistent.Persistent):

    def __init__(self, date, lockers=None, status=True) -> None:
        self.date = date
        self.status = status
        self.lockers = lockers if lockers is not None else BTrees.OOBTree.BTree()
        self._p_changed = True
        
    def toJSON(self):
        return {
            "date": self.date,
            "status": self.status,
            "lockers": {str(id): locker.toJSON() for id, locker in self.lockers.items()}
        }
        
    def showInfo(self):
        return {
            "id": self.id,
            "date": self.date,
            "lockers": {str(id): locker.toJSON() for id, locker in self.lockers.items()}
        }