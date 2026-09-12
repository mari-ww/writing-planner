# ✎ Writing Planner

> A cozy writing workspace for organizing stories, chapters, characters, tasks, and writing progress.

[![Demo](https://img.shields.io/badge/✦_Interactive_Demo-6B8F71?style=for-the-badge)](https://mari-ww.github.io/writing-planner/demo/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square\&logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square\&logo=react\&logoColor=61DAFB)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square\&logo=docker\&logoColor=white)](https://www.docker.com/)

Writing Planner is a full-stack application designed to give writers one place to organize their stories and keep track of their writing activity.

Instead of treating writing as a collection of disconnected documents and to-do lists, the application brings **projects, chapters, characters, tasks, and writing statistics** together in a single workspace.

The project was built as a portfolio application with a focus on practical full-stack development, layered backend architecture, relational data modeling, and a user interface designed around a specific workflow.

## What it does

A writing project acts as the central organizational unit.

From there, writers can:

* Create and manage stories
* Organize chapters
* Write chapter content directly in the application
* Keep track of characters
* Create tasks related to projects
* Monitor writing activity
* View writing statistics across all projects

The dashboard turns writing activity into a visual history, making it possible to see not only how much has been written, but also **when the writing happened**.

## ✦ Features

### ✎ Projects

Projects are used to organize each story.

A project can have:

* Title and description
* Genre
* Chapters
* Tasks
* Characters

### ✎ Chapters

Chapters contain the actual writing.

Each chapter has a title, content, word count, and position within the project.

The word count is calculated automatically from the chapter content.

### ✦ Writing Activity

The application keeps track of how much a writer writes each day.

When a chapter is created or updated, the backend compares the old and new word counts and records the number of words added.

For example:

```text
Previous count: 1,250 words
New count:      1,430 words
                ───────────
Words added:      180 words
```

This information is then used to build the writing history shown on the dashboard.

### ◇ Writing Statistics

The dashboard shows writing activity across all projects, including:

* Total words written
* Words written this month
* 30-day daily average
* Best writing day
* Writing activity over the last 365 days

The activity is displayed as a GitHub-style contribution graph.

### □ Tasks

Tasks can be created and organized within writing projects.

### ♧ Characters

Characters are organized by project and can be viewed from a dedicated section.

### × Delete Management

Projects and chapters can be deleted with a confirmation before the action is completed.

---

## Demo

The project has a static interactive demo so the interface can be explored without running the application.

**[✦ Open Interactive Demo](https://mari-ww.github.io/writing-planner/demo/)**

> The demo is a visual preview of the application and does not connect to the full backend.

---

## Preview

![Dashboard](demo/dashboard.png)

![Chapter Creation](demo/chapter.png)

---

## ◈ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router

### Backend

* Python
* FastAPI
* SQLAlchemy
* Alembic
* PostgreSQL

### Other

* Docker
* Docker Compose
* Pytest
* Git

---

## How It Works

The frontend and backend communicate through a REST API.

```text
React + TypeScript
        │
        │ REST API
        ▼
     FastAPI
        │
        ▼
   PostgreSQL
```

The backend is separated into routers, services, repositories, models, and schemas.

This keeps the API endpoints, application logic, and database operations separate.

The frontend is organized into pages, API modules, types, and styles.

### Writing tracking

The writing tracking is one of the main parts of the application.

When a chapter is updated:

```text
Chapter updated
      ↓
Calculate new word count
      ↓
Compare with previous count
      ↓
Calculate words added
      ↓
Save today's activity
      ↓
Show it on the dashboard
```

Writing activity from different projects is combined by date, allowing the dashboard to show the writer's overall progress.

---

## Project Structure

```text
writing-planner/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   │
│   └── tests/
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── pages/
│       ├── styles/
│       └── types/
│
├── demo/
│   ├── index.html
│   ├── demo.js
│   └── demo.css
│
├── docker-compose.yml
└── README.md
```

---

## ▶ Running Locally

### Requirements

* Docker
* Docker Compose
* Node.js
* npm

### Clone the repository

```bash
git clone https://github.com/mari-ww/writing-planner.git
cd writing-planner
```

### Start the application

```bash
docker compose up --build
```

This starts the application services using Docker Compose.

FastAPI's interactive API documentation is available at:

```text
/docs
```

---

## ◈ Testing

The backend uses Pytest for automated tests.

Run the tests with:

```bash
pytest
```

The tests cover application behavior including API functionality and writing activity tracking.

---

## ⋆ Design

I wanted the application to feel more like a **personal writing space** than a traditional productivity app.

The interface uses:

* Warm cream backgrounds
* Sage green accents
* Rounded cards
* Soft borders
* Minimal visual noise

The goal was to keep the interface calm and simple so the organization tools don't get in the way of writing.

---

## What I Learned

While building Writing Planner, I got to practice:

* Building a REST API with FastAPI
* Structuring a backend with services and repositories
* Working with PostgreSQL and SQLAlchemy
* Managing database migrations with Alembic
* Building a React + TypeScript frontend
* Connecting a frontend to a backend API
* Designing relational data
* Tracking and aggregating writing activity
* Writing backend tests with Pytest
* Using Docker Compose for development

---

## Author

**Mariana Carneiro**

Computer Science graduate focused on backend and full-stack development.

[GitHub](https://github.com/mari-ww) · [LinkedIn](https://www.linkedin.com/in/mariana-carneiro-573888254/)
