from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from typing import List
from crud import create_note, get_notes_by_user, get_note_by_id, update_note, delete_note
from database import SessionLocal
from models import Note
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get the user_id from the session
def get_user_id_from_session(request: Request):
    user_id = request.cookies.get("user_id")  # Or use session storage or JWT, etc.
    if not user_id:
        raise HTTPException(status_code=401, detail="User is not authenticated")
    return user_id

# Pydantic models for input validation
class NoteCreate(BaseModel):
    note_title: str
    note_content: str
    user_id: int

class NoteResponse(BaseModel):
    note_id: str
    note_title: str
    note_content: str
    last_update: str
    created_on: str

    class Config:
        orm_mode = True

# Create a note
@router.post("/notes/", response_model=NoteResponse)
def create_new_note(note: NoteCreate, db: Session = Depends(get_db), user_id: int = Depends(get_user_id_from_session)):
    new_note = create_note(db, note.note_title, note.note_content, user_id)
    return new_note

# Get all notes for a user
@router.get("/notes/", response_model=List[NoteResponse])
def get_user_notes(db: Session = Depends(get_db), user_id: int = Depends(get_user_id_from_session)):
    notes = get_notes_by_user(db, user_id)
    return notes

# Get a specific note by ID
@router.get("/notes/{note_id}", response_model=NoteResponse)
def get_note(note_id: str, db: Session = Depends(get_db), user_id: int = Depends(get_user_id_from_session)):
    note = get_note_by_id(db, note_id)
    if not note or note.user_id != user_id:
        raise HTTPException(status_code=404, detail="Note not found or access denied")
    return note

# Update a note
@router.put("/notes/{note_id}", response_model=NoteResponse)
def update_existing_note(note_id: str, note: NoteCreate, db: Session = Depends(get_db), user_id: int = Depends(get_user_id_from_session)):
    updated_note = update_note(db, note_id, note.note_title, note.note_content)
    if not updated_note or updated_note.user_id != user_id:
        raise HTTPException(status_code=404, detail="Note not found or access denied")
    return updated_note

# Delete a note
@router.delete("/notes/{note_id}", response_model=NoteResponse)
def delete_existing_note(note_id: str, db: Session = Depends(get_db), user_id: int = Depends(get_user_id_from_session)):
    deleted_note = delete_note(db, note_id)
    if not deleted_note or deleted_note.user_id != user_id:
        raise HTTPException(status_code=404, detail="Note not found or access denied")
    return deleted_note
