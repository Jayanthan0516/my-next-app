import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)  # Ensure id is defined properly
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    # Relationship to notes
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")



class Note(Base):
    __tablename__ = "notes"

    note_id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    note_title = Column(String(255), nullable=False)
    note_content = Column(String(5000), nullable=False)
    last_update = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_on = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    username = Column(String(50), unique=True, nullable=False)

    # Relationship to user
    user = relationship("User", back_populates="notes")
