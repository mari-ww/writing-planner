from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.note import Note


class NoteRepository:
    def create(
        self,
        db: Session,
        note: Note,
    ) -> Note:
        db.add(note)
        db.commit()
        db.refresh(note)

        return note

    def get_by_id(
        self,
        db: Session,
        note_id: int,
    ) -> Note | None:
        return db.get(Note, note_id)

    def get_by_project(
        self,
        db: Session,
        project_id: int,
    ) -> list[Note]:
        statement = (
            select(Note)
            .where(Note.project_id == project_id)
            .order_by(Note.id.desc())
        )

        return list(db.scalars(statement))

    def delete(
        self,
        db: Session,
        note: Note,
    ) -> None:
        db.delete(note)
        db.commit()