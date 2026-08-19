from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.character import Character
from app.models.project import Project
from app.repositories.character import CharacterRepository
from app.schemas.character import (
    CharacterCreate,
    CharacterUpdate,
)


class CharacterService:
    def __init__(self):
        self.repository = CharacterRepository()

    def create(
        self,
        db: Session,
        project: Project,
        data: CharacterCreate,
    ) -> Character:
        character = Character(
            **data.model_dump(),
            project_id=project.id,
        )

        return self.repository.create(db, character)

    def list_by_project(
        self,
        db: Session,
        project: Project,
    ) -> list[Character]:
        return self.repository.get_by_project(
            db,
            project.id,
        )

    def get_project_character(
        self,
        db: Session,
        character_id: int,
        project: Project,
    ) -> Character:
        character = self.repository.get_by_id(
            db,
            character_id,
        )

        if (
            character is None
            or character.project_id != project.id
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Character not found",
            )

        return character

    def update(
        self,
        db: Session,
        character: Character,
        data: CharacterUpdate,
    ) -> Character:
        for field, value in data.model_dump(
            exclude_unset=True
        ).items():
            setattr(character, field, value)

        db.commit()
        db.refresh(character)

        return character

    def delete(
        self,
        db: Session,
        character: Character,
    ) -> None:
        self.repository.delete(db, character)