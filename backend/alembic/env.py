import os
from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context

# Import the Base metadata from models.py
from database import SQLALCHEMY_DATABASE_URL
from models import Base  # Ensure this is the correct import

# Alembic Config object, which provides access to .ini values
config = context.config

# Setup logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set target metadata for Alembic to detect models
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode without connecting to the database."""
    context.configure(
        url=SQLALCHEMY_DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode by creating an engine connection."""
    connectable = create_engine(SQLALCHEMY_DATABASE_URL, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

# Determine whether to run migrations online or offline
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
