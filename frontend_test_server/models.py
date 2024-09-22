from pydantic import BaseModel

class UpdateObjectRequest(BaseModel):
    operation_type: str
    data: dict