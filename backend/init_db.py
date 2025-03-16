from database import engine, Base

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
