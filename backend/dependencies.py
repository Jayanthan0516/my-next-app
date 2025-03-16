from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
import crud
import models

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get the user_id from the session (or cookies)
def get_user_id_from_session(request: Request):
    user_id = request.cookies.get("user_id")  # Or use session storage or JWT, etc.
    if not user_id:
        raise HTTPException(status_code=401, detail="User is not authenticated")
    return user_id

# Pydantic model for user info in the session
class User(BaseModel):
    user_id: int

# Use this dependency wherever you need the user ID
