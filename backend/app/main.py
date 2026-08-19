from fastapi import FastAPI

from app.routers.auth import router as auth_router
from app.routers.projects import router as projects_router
from app.routers.chapters import router as chapters_router
from app.routers.characters import router as characters_router
from app.routers.notes import router as notes_router
from app.routers.tasks import router as tasks_router
from app.routers.users import router as users_router


app = FastAPI(
    title="Writing Planner API",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(projects_router)
app.include_router(chapters_router)
app.include_router(characters_router)
app.include_router(notes_router)
app.include_router(tasks_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}