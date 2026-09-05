"""add daily writing stats

Revision ID: 73c2611680db
Revises: 7e817e45cecf
Create Date: 2026-09-05 18:44:03.443478

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '73c2611680db'
down_revision: Union[str, Sequence[str], None] = '7e817e45cecf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'daily_writing_stats',
        sa.Column(
            'id',
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            'date',
            sa.Date(),
            nullable=False,
        ),
        sa.Column(
            'words_written',
            sa.Integer(),
            nullable=False,
            server_default='0',
        ),
        sa.Column(
            'project_id',
            sa.Integer(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ['project_id'],
            ['projects.id'],
        ),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('daily_writing_stats')