from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.note import Note
from app.models.project import Project
from app.repositories.note import NoteRepository
from app.schemas.note import (
    NoteCreate,
    NoteUpdate,
)


class NoteService:
    def __init__(self):
        self.repository = NoteRepository()

    def create(
        self,
        db: Session,
        project: Project,
        data: NoteCreate,
    ) -> Note:
        note = Note(
            **data.model_dump(),
            project_id=project.id,
        )

        return self.repository.create(db, note)

    def list_by_project(
        self,
        db: Session,
        project: Project,
    ) -> list[Note]:
        return self.repository.get_by_project(
            db,
            project.id,
        )

    def get_project_note(
        self,
        db: Session,
        note_id: int,
        project: Project,
    ) -> Note:
        note = self.repository.get_by_id(
            db,
            note_id,
        )

        if (
            note is None
            or note.project_id != project.id
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found",
            )

        return note

    def update(
        self,
        db: Session,
        note: Note,
        data: NoteUpdate,
    ) -> Note:
        for field, value in data.model_dump(
            exclude_unset=True
        ).items():
            setattr(note, field, value)

        db.commit()
        db.refresh(note)

        return note

    def delete(
        self,
        db: Session,
        note: Note,
    ) -> None:
        self.repository.delete(db, note)