from fastapi import FastAPI

from app.routers.auth import router as auth_router
from app.routers.projects import router as projects_router

app = FastAPI(
    title="Writing Planner API",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(projects_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}