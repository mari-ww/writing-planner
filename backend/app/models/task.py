from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"),
        nullable=False,
    )

    chapter_id: Mapped[int | None] = mapped_column(
        ForeignKey("chapters.id"),
        nullable=True,
    )

    project: Mapped["Project"] = relationship(
        back_populates="tasks"
    )

    chapter: Mapped["Chapter | None"] = relationship(
        back_populates="tasks"
    )