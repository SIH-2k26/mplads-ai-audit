"""
db/repositories/base.py
Generic async repository base class for SQLAlchemy 2.0.
All repositories inherit from this — provides common CRUD operations.
"""
from __future__ import annotations
from typing import Any, Generic, Optional, Type, TypeVar
from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from db.models.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """
    Generic async CRUD repository.

    Usage:
        class ProjectRepository(BaseRepository[ProjectORM]):
            model = ProjectORM
    """

    model: Type[ModelT]

    def __init__(self, session: AsyncSession):
        self._session = session

    async def get(self, pk: Any) -> Optional[ModelT]:
        """Fetch by primary key. Returns None if not found."""
        return await self._session.get(self.model, pk)

    async def get_or_raise(self, pk: Any) -> ModelT:
        """Fetch by primary key or raise ValueError."""
        obj = await self.get(pk)
        if obj is None:
            raise ValueError(f"{self.model.__tablename__} with pk={pk!r} not found")
        return obj

    async def create(self, obj: ModelT) -> ModelT:
        """Persist a new object. Returns the attached instance."""
        self._session.add(obj)
        await self._session.flush()
        await self._session.refresh(obj)
        return obj

    async def update(self, obj: ModelT, **fields: Any) -> ModelT:
        """Update fields on an existing object."""
        for key, value in fields.items():
            setattr(obj, key, value)
        await self._session.flush()
        await self._session.refresh(obj)
        return obj

    async def delete(self, pk: Any) -> bool:
        """Delete by primary key. Returns True if deleted."""
        obj = await self.get(pk)
        if obj is None:
            return False
        await self._session.delete(obj)
        await self._session.flush()
        return True

    async def count(self) -> int:
        """Total row count for the table."""
        result = await self._session.execute(select(func.count()).select_from(self.model))
        return result.scalar_one()

    async def list(
        self,
        limit: int = 100,
        offset: int = 0,
        order_by: Optional[Any] = None,
    ) -> list[ModelT]:
        """Paginated list of all records."""
        stmt = select(self.model)
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        stmt = stmt.limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def upsert(self, obj: ModelT, pk_field: str = "id") -> ModelT:
        """
        Insert or update: if a record with the same PK exists, update it;
        otherwise create a new one. Returns the final record.
        """
        pk_value = getattr(obj, pk_field)
        existing = await self.get(pk_value)
        if existing is None:
            return await self.create(obj)
        # Copy non-pk fields from obj to existing
        for col in obj.__table__.columns:
            if col.name != pk_field:
                setattr(existing, col.name, getattr(obj, col.name))
        await self._session.flush()
        await self._session.refresh(existing)
        return existing
