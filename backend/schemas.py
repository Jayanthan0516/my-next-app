from pydantic import BaseModel
from datetime import datetime

# Request Model for creating a note
class NoteCreate(BaseModel):
    note_title: str
    note_content: str
    user_id: int  # This should match the `user_id` in the Note model

# Response Model for returning a note
class NoteResponse(NoteCreate):
    note_id: str
    last_update: datetime
    created_on: datetime

    class Config:
        from_attributes = True
