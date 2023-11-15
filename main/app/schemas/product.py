from pydantic import BaseModel, Field

class addProduct(BaseModel):
    id: int = Field(..., example=1)
    name: str = Field(..., example="Product 1")
    stock: int = Field(..., example=5)
    class Config():
        schema_extra = {
            "example": {
                "id": 1,
                "name": "Product 1",
                "stock": 5
            }
        }
        
class borrowProduct(BaseModel):
    name: str = Field(..., example="Product 1")
    dateOfReturn: str = Field(..., example="2023-11-20")
    class Config():
        schema_extra = {
            "example": {
                "name": "Product 1",
                "dateOfReturn": "2023-11-20"
            }
        }
        
