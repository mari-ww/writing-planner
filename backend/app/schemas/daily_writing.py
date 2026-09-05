from datetime import date

from pydantic import BaseModel


class DailyWritingStatResponse(BaseModel):
    date: date
    words_written: int

    model_config = {"from_attributes": True}