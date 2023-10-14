import ZODB, ZODB.FileStorage
import persistent
import transaction
import BTrees.OOBTree
from fastapi import FastAPI


storage = ZODB.FileStorage.FileStorage('courseDatabase.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root

class Course(persistent.Persistent):
    def __init__(self, id, subjectID, name, credit, prerequisite = None, description = None):
        self.id = id
        self.subjectID = subjectID
        self.name = name
        self.credit = credit
        self.prerequisite = prerequisite
        self.description = description
        
    def setid(self, id):
        self.id = id
        
    def setsubjectID(self, subjectID):
        self.subjectID = subjectID
        
    def setname(self, name):
        self.name = name
        
    def setcredit(self, credit):
        self.credit = credit
        
    def setprerequisite(self, prerequisite):
        self.prerequisite = prerequisite
        
    def setdescription(self, description):
        self.description = description
        
    def getid(self):
        return self.id
        
    def getsubjectID(self):
        return self.subjectID
    
    def getname(self):
        return self.name
    
    def getcredit(self):
        return self.credit
    
    def getprerequisite(self):
        return self.prerequisite
    
    def getdescription(self):
        return self.description
    
    def toJSON(self):
        return {
            self.id : {
                "subjectID" : self.subjectID,
                "name" : self.name,
                "credit" : self.credit,
                "prerequisite" : self.prerequisite,
                "description" : self.description
            }
        }
root.courses = BTrees.OOBTree.BTree()

root.courses[1] = Course(1,'010123131', 'Introduction to Information Technology', 3, None, 'Introduction to Information Technology')
root.courses[1].toJSON()

transaction.commit()
        
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/course/all")
async def getAllCourses():
    # Ensure you're correctly getting the root object
    connection = db.open()
    root = connection.root

    courses = []
    for course in root.courses.values():
        courses.append(course.toJSON())
    return courses

@app.get("/course/{id}")
async def getCourse(id: int):
    # Ensure you're correctly getting the root object
    connection = db.open()
    root = connection.root

    course = root.courses.get(id)
    if course is not None:
        return course.toJSON()
    else:
        return {"error": "Course not found"}


@app.post("/course/new")
async def addCourse(id: str, subjectID: str, name: str, credit: int, prerequisite: str = None, description: str = None):
    connection = db.open()
    root = connection.root

    # Convert the ID to a string to ensure it's used as a dictionary key
    id_str = str(id)

    # Check if the course with the given ID already exists
    if id_str not in root.courses:
        course = Course(id_str, subjectID, name, credit, prerequisite, description)
        root.courses[id_str] = course
        transaction.commit()
        return {"message": "Course added successfully"}
    else:
        return {"error": "Course already exists"}
