import persistent

class UserLogin(persistent.Persistent):
    def __init__(self, username, password):
        self.username = username
        self.password = password

    def getuserName(self):
        return self.username

    def getPassword(self):
        return self.password

    def setusername(self, username):
        self.username = username
        
    def setPassword(self, password):
        self.password = password
        
    def __str__(self):
        return f"User: {self.username}, Password: {self.password}"
    
    
class UserRegister(persistent.Persistent):
    def __init__(self, id, username, email, password):
        self.id = id
        self.username = username
        self.email = email
        self.password = password

    def getuserName(self):
        return self.username

    def getEmail(self):
        return self.email

    def getPassword(self):
        return self.password

    def setusername(self, username):
        self.username = username
        
    def setEmail(self, email):
        self.email = email
        
    def setPassword(self, password):
        self.password = password
        
    def toJSON(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password,
        }
        
    def __str__(self):
        return f"User: {self.username}, Email: {self.email}, Password: {self.password}"
    