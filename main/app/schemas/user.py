from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class SignUp(BaseModel):
    id : int = Field(..., example = 1, len = 8)
    username : str = Field(..., example = "John Doe")
    email : EmailStr = Field(..., example = "email@email.com")
    password : str = Field(..., example = "password")
    class Config():
        schema_extra = {
            "example": {
                "id": 1,
                "username": "nukie",
                "email": "email@123.com",
                "password": "password"
            }
        }
    
class UserInfo(BaseModel):
    id : int = Field(..., example = 1)
    username : str = Field(..., example = "John Doe")
    email : EmailStr = Field(..., example = "email@email.com")
    borrowed : Optional[List[str]] = Field([], example = ["Product 1", "Product 2"])
    class Config():
        schema_extra = {
            "example": {
                "id": 1,
                "username": "John Doe",
                "email": "email@email.com",
                "borrowed": ["Product 1", "Product 2"]
            }
        }
        
class Login(BaseModel):
    email : EmailStr = Field(..., example = "email@email.com")
    password : str = Field(..., example = "password")
    
