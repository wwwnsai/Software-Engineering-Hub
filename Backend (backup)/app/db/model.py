import persistent

class User(persistent.Persistent):
    def __init__(self, id, username, email, password) -> None:
        self.id = id
        self.username = username
        self.email = email
        self.password = password
        borrowed_items = []
        parking = None
        locker = None
        
    def toJSON(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password
        }
        

# class Student(User):
#     def __init__(self, id, username, email, password, student_id):
#         super().__init__(id, username, email, password)
#         self.student_id = student_id
#         borrowed_items = []
#         parking = None
#         locker = None
        
# class Staff(User):
#     def __init__(self, id, username, email, password, staff_id):
#         super().__init__(id, username, email, password)
#         self.staff_id = staff_id