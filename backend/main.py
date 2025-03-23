from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal, engine
import models
import crud
import logging
from uuid import uuid4
import time

# Import the notes router
from notes import router as notes_router

# Initialize FastAPI
app = FastAPI()

# Set up logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjusted for Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secure password hashing (Fixed bcrypt_rounds issue)
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto"
)


# Create database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# Pydantic models for validation (Fixed 'orm_mode' warning)
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr

    class Config:
        from_attributes = True  # Fixed Pydantic v2 warning

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register user API
@app.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if the email already exists
        existing_user = db.query(models.User).filter(models.User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash the password before saving to the database
        hashed_password = pwd_context.hash(user.password)
        new_user = models.User(username=user.username, email=user.email, password=hashed_password)
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user  # Return user details after registration
    
    except Exception as e:
        logger.error("Error in register_user: %s", str(e))  # Log the error for debugging
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Login user API with logging and performance measurements
@app.post("/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    start_time = time.time()  # Start the timer for login process
    
    # Query user by email
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    if user:
        # Measure time taken for password validation
        password_check_start = time.time()
        is_valid_password = pwd_context.verify(request.password, user.password)
        password_check_end = time.time()
        logger.info(f"Password check took {password_check_end - password_check_start} seconds")
    else:
        is_valid_password = False
    
    end_time = time.time()  # End the timer for login process
    logger.info(f"Total login process took {end_time - start_time} seconds")
    
    if not user or not is_valid_password:
        logger.warning(f"Failed login attempt for {request.email}")
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return {"message": "Login successful!", "username": user.username}

# Notes API - Create a new note
@app.post("/notes/")
def create_note(note: crud.NoteCreate, db: Session = Depends(get_db)):
    try:
        new_note = crud.create_note(
            db=db, 
            note=note  # Pass the whole `note` object here
        )
        return new_note
    except Exception as e:
        logger.error(f"Error in create_note: {str(e)}")
        raise HTTPException(status_code=500, detail="Error saving note")

# Include the notes router for the /notes endpoint
app.include_router(notes_router, prefix="/notes")
