from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.character import Character


class CharacterRepository:
    def create(
        self,
        db: Session,
        character: Character,
    ) -> Character:
        db.add(character)
        db.commit()
        db.refresh(character)

        return character

    def get_by_id(
        self,
        db: Session,
        character_id: int,
    ) -> Character | None:
        return db.get(Character, character_id)

    def get_by_project(
        self,
        db: Session,
        project_id: int,
    ) -> list[Character]:
        statement = (
            select(Character)
            .where(Character.project_id == project_id)
            .order_by(Character.name)
        )

        return list(db.scalars(statement))

    def delete(
        self,
        db: Session,
        character: Character,
    ) -> None:
        db.delete(character)
        db.commit()