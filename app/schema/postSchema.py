import persistent

class Post(persistent.Persistent):
    def __init__(self, id, title, content, author):
        self.id = id
        self.title = title
        self.content = content
        self.author = author

    def getID(self):
        return self.id

    def getTitle(self):
        return self.title

    def getContent(self):
        return self.content

    def getAuthor(self):
        return self.author

    def setTitle(self, title):
        self.title = title
        
    def setContent(self, content):
        self.content = content
        
    def setAuthor(self, author):
        self.author = author
        
    def toJSON(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "author": self.author,
        }
        
    def __str__(self):
        return f"Post: {self.title}, Content: {self.content}, Author: {self.author}"