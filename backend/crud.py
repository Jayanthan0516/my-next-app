from sqlalchemy.orm import Session
from models import Note
from datetime import datetime
import uuid
from pydantic import BaseModel

# Define the NoteCreate Pydantic model for validation
class NoteCreate(BaseModel):
    note_title: str
    note_content: str
    user_id: int

# Create a new note
def create_note(db: Session, note: NoteCreate):
    try:
        new_note = Note(
            note_id=str(uuid.uuid4()),  # Ensure note_id is a string (UUID)
            note_title=note.note_title,
            note_content=note.note_content,
            created_on=datetime.utcnow(),
            last_update=datetime.utcnow(),
            user_id=note.user_id
        )
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
        return new_note
    except Exception as e:
        # Log the error or handle it
        print(f"Error creating note: {e}")
        return None

# Get all notes for a user
def get_notes_by_user(db: Session, user_id: int):
    try:
        return db.query(Note).filter(Note.user_id == user_id).all()
    except Exception as e:
        print(f"Error fetching notes for user {user_id}: {e}")
        return []

# Get a specific note by ID
def get_note_by_id(db: Session, note_id: str):
    try:
        return db.query(Note).filter(Note.note_id == note_id).first()
    except Exception as e:
        print(f"Error fetching note {note_id}: {e}")
        return None

# Update a note
def update_note(db: Session, note_id: str, note_title: str, note_content: str):
    try:
        note = db.query(Note).filter(Note.note_id == note_id).first()
        if note:
            note.note_title = note_title
            note.note_content = note_content
            note.last_update = datetime.utcnow()
            db.commit()
            db.refresh(note)
            return note
        return None
    except Exception as e:
        print(f"Error updating note {note_id}: {e}")
        return None

# Delete a note
def delete_note(db: Session, note_id: str):
    try:
        note = db.query(Note).filter(Note.note_id == note_id).first()
        if note:
            db.delete(note)
            db.commit()
            return note
        return None
    except Exception as e:
        print(f"Error deleting note {note_id}: {e}")
        return None
