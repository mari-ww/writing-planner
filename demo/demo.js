const app = document.getElementById('app')

const demoProjects = [
  {
    id: 1,
    title: 'The Stars We Forgot',
    genre: 'Romance',
    description:
      'A story about memories, stars and two people finding each other again.',
    chapters: 8,
    words: 12450,
  },
  {
    id: 2,
    title: 'Moonlit Letters',
    genre: 'Drama',
    description:
      'A quiet romance told through letters exchanged under the moonlight.',
    chapters: 5,
    words: 7820,
  },
  {
    id: 3,
    title: 'After the Rain',
    genre: 'Romance',
    description:
      'Two childhood friends meet again years after everything changed.',
    chapters: 3,
    words: 4210,
  },
]


/* =========================================
   LOGIN
========================================= */

function renderLogin() {
  app.innerHTML = `
    <main class="auth-page">

      <section class="auth-card">

        <div class="auth-brand">

          <div class="auth-brand-icon">
            ✎
          </div>

          <div>
            <strong>Writing</strong>
            <span>Planner</span>
          </div>

        </div>


        <div class="auth-heading">

          <p class="auth-eyebrow">
            ✦ YOUR WRITING SPACE
          </p>

          <h1>
            Welcome back
          </h1>

          <p>
            Continue working on your stories.
          </p>

        </div>


        <form
          class="auth-form"
          onsubmit="handleDemoLogin(event)"
        >

          <label>

            Email

            <input
              type="email"
              value="writer@example.com"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />

          </label>


          <label>

            Password

            <input
              type="password"
              value="password123"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />

          </label>


          <button
            type="submit"
            class="auth-submit"
          >
            Login
          </button>

        </form>


        <div class="auth-switch">

        <span>
            Don't have an account?
        </span>

        <button
            type="button"
            onclick="showDemoNotice('Account creation is disabled in this demo.')"
        >
            Create an account
        </button>

        </div>


        <div class="auth-decoration">

          <span>✦</span>
          <span>✦</span>
          <span>✦</span>

        </div>

      </section>

    </main>


    <div class="demo-banner">
      You're viewing a demo of Writing Planner — this is not the original product.
    </div>
  `
}


function handleDemoLogin(event) {
  event.preventDefault()
  renderDashboard()
}


/* =========================================
   SIDEBAR
========================================= */

function renderSidebar(activePage) {
  return `
    <aside class="sidebar">

      <div class="sidebar-brand">

        <div class="brand-icon">
          ✦
        </div>

        <div>
          <strong>
            Writing Planner
          </strong>

          <span>
            Writer's workspace
          </span>
        </div>

      </div>


      <nav class="sidebar-nav">

        <a
          href="#"
          class="sidebar-link ${
            activePage === 'home'
              ? 'sidebar-link-active'
              : ''
          }"
          data-page="home"
        >
          <span>⌂</span>
          Home
        </a>

        <a
          href="#"
          class="sidebar-link ${
            activePage === 'projects'
              ? 'sidebar-link-active'
              : ''
          }"
          data-page="projects"
        >
          <span>▣</span>
          Projects
        </a>

        <a
          href="#"
          class="sidebar-link ${
            activePage === 'tasks'
              ? 'sidebar-link-active'
              : ''
          }"
          data-page="tasks"
        >
          <span>✓</span>
          Tasks
        </a>

        <a
          href="#"
          class="sidebar-link ${
            activePage === 'characters'
              ? 'sidebar-link-active'
              : ''
          }"
          data-page="characters"
        >
          <span>♧</span>
          Characters
        </a>

      </nav>


      <div class="sidebar-tip">

        <span class="tip-icon">
          ✎
        </span>

        <strong>
          Keep writing
        </strong>

        <p>
          Small progress is still progress.
          Keep your story moving.
        </p>

      </div>


      <button
        class="logout-button"
        id="logout-button"
      >
        <span>↪</span>
        Log out
      </button>

    </aside>
  `
}


/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {
  app.innerHTML = `
    <div class="dashboard-layout">

      ${renderSidebar('home')}

      <main class="dashboard-main">

        <header class="dashboard-header">

          <div>

            <p class="eyebrow">
              GOOD TO SEE YOU
            </p>

            <h1>
              Your writing space
            </h1>

            <p>
              Keep your stories moving, one word at a time.
            </p>

          </div>


          <div class="header-date">

            <span>
              ✦
            </span>

            <div>

              <strong>
                Saturday, September 5
              </strong>

              <small>
                Keep creating.
              </small>

            </div>

          </div>

        </header>


        <div class="dashboard-grid">


          <!-- WRITING STATS -->

          <section class="dashboard-card writing-stats-card">

            <div class="card-heading">

              <div class="card-icon">
                ✎
              </div>

              <div>

                <h2>
                  Writing Stats
                </h2>

                <span>
                  Your writing activity
                </span>

              </div>

            </div>


            <div class="writing-stats-summary">

              <strong>
                32,840
              </strong>

              <span>
                words written
              </span>

            </div>


            <div
              class="writing-graph"
              id="writing-graph"
            ></div>


            <div class="writing-graph-legend">

              <span>
                Less
              </span>

              <span class="writing-day"></span>
              <span class="writing-day writing-day-1"></span>
              <span class="writing-day writing-day-2"></span>
              <span class="writing-day writing-day-3"></span>
              <span class="writing-day writing-day-4"></span>

              <span>
                More
              </span>

            </div>

          </section>


          <!-- WRITING PROGRESS -->

          <section class="dashboard-card progress-card">

            <div class="card-heading">

              <div class="card-icon">
                ◇
              </div>

              <div>

                <h2>
                  Writing Progress
                </h2>

                <span>
                  Your stories
                </span>

              </div>

            </div>


            <div class="writing-progress-list">

              ${demoProjects.map(project => `
                <a
                  href="#"
                  class="writing-progress-item"
                  onclick="openProject(${project.id}); return false;"
                >

                  <div class="writing-progress-info">

                    <strong>
                      ${project.title}
                    </strong>

                    <span>
                      ${project.words.toLocaleString()} words
                    </span>

                  </div>


                  <div class="writing-progress-bar">
                    <span style="width: 0%"></span>
                  </div>


                  <span class="writing-progress-arrow">
                    →
                  </span>

                </a>
              `).join('')}

            </div>

          </section>


          <!-- CREATE PROJECT -->

          <section class="dashboard-card create-card">

            <div class="card-heading">

              <div class="card-icon">
                +
              </div>

              <div>

                <h2>
                  New Project
                </h2>

                <span>
                  Start something new
                </span>

              </div>

            </div>


            <form
              onsubmit="handleDemoCreateProject(event)"
            >

              <label>

                Title

                <input
                  type="text"
                  placeholder="Your story title..."
                  required
                />

              </label>


              <label>

                Genre

                <input
                  type="text"
                  placeholder="Romance, fantasy..."
                />

              </label>


              <label>

                Description

                <textarea
                  placeholder="A little about your story..."
                ></textarea>

              </label>


              <button type="submit">
                + Create Project
              </button>

            </form>

          </section>


          <!-- QUICK START -->

          <section class="dashboard-card quick-start-card">

            <div class="card-heading">

              <div class="card-icon">
                →
              </div>

              <div>

                <h2>
                  Quick Start
                </h2>

                <span>
                  Continue writing
                </span>

              </div>

            </div>


            <div class="quick-actions">

              ${demoProjects.slice(0, 3).map(project => `
                <a
                  href="#"
                  class="quick-project"
                  onclick="openProject(${project.id}); return false;"
                >

                  <span>
                    ✦
                  </span>

                  <div>

                    <strong>
                      ${project.title}
                    </strong>

                    <small>
                      Continue writing →
                    </small>

                  </div>

                </a>
              `).join('')}

            </div>

          </section>


          <!-- OVERVIEW -->

          <section class="dashboard-card stats-card">

            <div class="card-heading">

              <div class="card-icon">
                ◷
              </div>

              <div>

                <h2>
                  Overview
                </h2>

                <span>
                  Your writing activity
                </span>

              </div>

            </div>


            <div class="stat-grid">

              <div class="stat-item">

                <strong>
                  3
                </strong>

                <span>
                  Projects
                </span>

              </div>


              <div class="stat-item">

                <strong>
                  16
                </strong>

                <span>
                  Chapters
                </span>

              </div>


              <div class="stat-item">

                <strong>
                  1,094
                </strong>

                <span>
                  Daily avg.
                </span>

              </div>


              <div class="stat-item">

                <strong>
                  1,820
                </strong>

                <span>
                  Best day
                </span>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>

    <div class="demo-banner">
      You're viewing a demo of Writing Planner — this is not the original product.
    </div>
  `

  createWritingGraph()
  setupDashboardInteractions()
}


/* =========================================
   WRITING GRAPH
========================================= */

function createWritingGraph() {
  const graph = document.getElementById('writing-graph')

  if (!graph) {
    return
  }

  const totalDays = 365

  for (let index = 0; index < totalDays; index++) {
    const day = document.createElement('span')

    day.className = 'writing-day'

    const activity = Math.random()

    if (activity > 0.85) {
      day.classList.add('writing-day-4')
    } else if (activity > 0.68) {
      day.classList.add('writing-day-3')
    } else if (activity > 0.48) {
      day.classList.add('writing-day-2')
    } else if (activity > 0.25) {
      day.classList.add('writing-day-1')
    }

    graph.appendChild(day)
  }
}


/* =========================================
   DASHBOARD INTERACTIONS
========================================= */

function setupDashboardInteractions() {

  document
    .querySelectorAll('[data-page]')
    .forEach(link => {

      link.addEventListener('click', event => {

        event.preventDefault()

        const page = link.dataset.page

        if (page === 'home') {
          renderDashboard()
          return
        }

        if (page === 'projects') {
          renderProjects()
          return
        }

        if (page === 'tasks') {
          renderTasks()
          return
        }

        if (page === 'characters') {
          renderCharacters()
          return
        }

      })

    })


  const logoutButton =
    document.getElementById('logout-button')

  if (logoutButton) {

    logoutButton.addEventListener(
      'click',
      () => {
        renderLogin()
      }
    )

  }

}


/* =========================================
   DEMO NOTIFICATION
========================================= */

function showDemoNotice(message) {

  const existing =
    document.querySelector('.demo-notice')

  if (existing) {
    existing.remove()
  }


  const notice =
    document.createElement('div')

  notice.className = 'demo-notice'

  notice.innerHTML = `
    <button
      class="demo-notice-close"
      onclick="this.parentElement.remove()"
      aria-label="Close"
    >
      ×
    </button>

    <div class="demo-notice-icon">
      ✦
    </div>

    <strong>
      Demo mode
    </strong>

    <p>
      ${message}
    </p>

  `

  document.body.appendChild(notice)


  setTimeout(() => {

    if (notice.parentElement) {
      notice.remove()
    }

  }, 3000)
}


/* =========================================
   CREATE PROJECT
========================================= */

function handleDemoCreateProject(event) {

  event.preventDefault()

  showDemoNotice(
    'Creating projects is disabled in this demo. The form is here to show how the real product works.'
  )

}

/* =========================================
   TASKS
========================================= */

function renderTasks() {

  app.innerHTML = `
    <main class="tasks-page">

      <header class="tasks-header">

        <a
          href="#"
          class="back-link"
          onclick="renderDashboard(); return false;"
        >
          ← Home
        </a>

        <p class="page-eyebrow">
          TO DO
        </p>

        <h1>
          Tasks
        </h1>

        <p class="tasks-subtitle">
          2 tasks left to do.
        </p>

      </header>


      <section class="tasks-list">

        <article class="task-project">

          <div class="task-project-header">

            <div>

              <a
                href="#"
                class="task-project-title"
                onclick="openProject(1); return false;"
              >
                The Stars We Forgot
              </a>

              <p>
                1/2 completed
              </p>

            </div>

            <span class="task-count">
              2
            </span>

          </div>


          <div class="task-items">

            <label class="task-item task-item-completed">

              <input
                type="checkbox"
                checked
                onchange="showDemoNotice('Task updates are disabled in this demo.')"
              />

              <span>
                Finish chapter 8
              </span>

            </label>


            <label class="task-item">

              <input
                type="checkbox"
                onchange="showDemoNotice('Task updates are disabled in this demo.')"
              />

              <span>
                Review dialogue
              </span>

            </label>

          </div>

        </article>


        <article class="task-project">

          <div class="task-project-header">

            <div>

              <a
                href="#"
                class="task-project-title"
                onclick="openProject(2); return false;"
              >
                Moonlit Letters
              </a>

              <p>
                0/1 completed
              </p>

            </div>

            <span class="task-count">
              1
            </span>

          </div>


          <div class="task-items">

            <label class="task-item">

              <input
                type="checkbox"
                onchange="showDemoNotice('Task updates are disabled in this demo.')"
              />

              <span>
                Plan the next chapter
              </span>

            </label>

          </div>

        </article>

      </section>

    </main>


    <div class="demo-banner">
      You're viewing a demo of Writing Planner — this is not the original product.
    </div>
  `
}

/* =========================================
   CHARACTERS
========================================= */

function renderCharacters() {

  app.innerHTML = `
    <main class="characters-page">

      <header class="characters-header">

        <a
          href="#"
          class="back-link"
          onclick="renderDashboard(); return false;"
        >
          ← Home
        </a>

        <p class="page-eyebrow">
          CAST
        </p>

        <h1>
          Characters
        </h1>

        <p class="characters-subtitle">
          3 characters across your stories.
        </p>

      </header>


      <section class="characters-projects">


        <article class="characters-project">

          <div class="characters-project-header">

            <a
              href="#"
              class="characters-project-title"
              onclick="openProject(1); return false;"
            >
              The Stars We Forgot
            </a>

            <span>
              2
            </span>

          </div>


          <div class="characters-grid">


            <button
              type="button"
              class="character-card"
              onclick="showCharacterSummary(
                'Mika',
                'Protagonist',
                'A quiet girl trying to understand the memories she lost.'
              )"
            >

              <div class="character-avatar">
                M
              </div>

              <div class="character-info">

                <strong>
                  Mika
                </strong>

                <span>
                  Protagonist
                </span>

              </div>

              <span class="character-arrow">
                →
              </span>

            </button>


            <button
              type="button"
              class="character-card"
              onclick="showCharacterSummary(
                'Ren',
                'Love interest',
                'Someone from her past who remembers everything.'
              )"
            >

              <div class="character-avatar">
                R
              </div>

              <div class="character-info">

                <strong>
                  Ren
                </strong>

                <span>
                  Love interest
                </span>

              </div>

              <span class="character-arrow">
                →
              </span>

            </button>


          </div>

        </article>


        <article class="characters-project">

          <div class="characters-project-header">

            <a
              href="#"
              class="characters-project-title"
              onclick="openProject(2); return false;"
            >
              Moonlit Letters
            </a>

            <span>
              1
            </span>

          </div>


          <div class="characters-grid">

            <button
              type="button"
              class="character-card"
              onclick="showCharacterSummary(
                'Mina',
                'Protagonist',
                'A writer who begins receiving mysterious letters every night.'
              )"
            >

              <div class="character-avatar">
                M
              </div>

              <div class="character-info">

                <strong>
                  Mina
                </strong>

                <span>
                  Protagonist
                </span>

              </div>

              <span class="character-arrow">
                →
              </span>

            </button>

          </div>

        </article>


      </section>


    </main>


    <div class="demo-banner">
      You're viewing a demo of Writing Planner — this is not the original product.
    </div>
  `
}

function showCharacterSummary(
  name,
  role,
  description,
) {

  const existing =
    document.querySelector('.character-summary')

  if (existing) {
    existing.remove()
  }


  const summary =
    document.createElement('div')

  summary.className =
    'character-summary'

  summary.innerHTML = `

    <div class="character-summary-header">

      <div>

        <p class="page-eyebrow">
          CHARACTER
        </p>

        <h2>
          ${name}
        </h2>

        <span>
          ${role}
        </span>

      </div>


      <button
        type="button"
        class="character-close"
        onclick="this.closest('.character-summary').remove()"
      >
        ×
      </button>

    </div>


    <p class="character-description">
      ${description}
    </p>

  `

  document
    .querySelector('.characters-page')
    .appendChild(summary)
}

/* =========================================
   PROJECTS
========================================= */

function renderProjects() {

  app.innerHTML = `
    <main class="projects-page">

      <header class="projects-header">

        <a
          href="#"
          class="back-link"
          onclick="renderDashboard(); return false;"
        >
          ← Home
        </a>

        <p class="page-eyebrow">
          MY STORIES
        </p>

        <h1>
          Projects
        </h1>

        <p class="projects-subtitle">
          Your stories, all in one place.
        </p>

      </header>


      <section class="projects-grid">

        ${demoProjects.map(project => `

          <a
            href="#"
            class="project-card"
            onclick="openProject(${project.id}); return false;"
          >

            <article>

              <div class="project-card-top">

                <span class="project-icon">
                  ✦
                </span>

                <span class="project-genre">
                  ${project.genre}
                </span>

              </div>


              <h2>
                ${project.title}
              </h2>


              <p>
                ${project.description}
              </p>


              <span class="project-open">
                Open project →
              </span>

            </article>

          </a>

        `).join('')}

      </section>

    </main>

    <div class="demo-banner">
      You're viewing a demo of Writing Planner — this is not the original product.
    </div>
  `
}


/* =========================================
   PROJECT PAGE
========================================= */

function openProject(projectId) {

  const project =
    demoProjects.find(
      project => project.id === projectId
    )


  if (!project) {

    showDemoNotice(
      'This project is not available in the demo.'
    )

    return
  }


  const chapters = [
    {
      id: 1,
      position: 1,
      title: 'The Beginning',
      content:
        'The night was quieter than usual. She looked at the stars and wondered if some memories were meant to return.',
      word_count: 1240,
    },
    {
      id: 2,
      position: 2,
      title: 'A Familiar Stranger',
      content:
        'They met again after years apart, neither of them quite sure what to say first.',
      word_count: 1680,
    },
    {
      id: 3,
      position: 3,
      title: 'Things We Never Said',
      content: '',
      word_count: 0,
    },
  ]


  const tasks = [
    {
      id: 1,
      title: 'Finish chapter 3',
      completed: true,
    },
    {
      id: 2,
      title: 'Write the reunion scene',
      completed: false,
    },
    {
      id: 3,
      title: 'Review character motivations',
      completed: false,
    },
  ]


  const characters = [
    {
      id: 1,
      name: 'Mika',
      role: 'Protagonist',
      description:
        'A quiet girl trying to understand the memories she lost.',
    },
    {
      id: 2,
      name: 'Ren',
      role: 'Love interest',
      description:
        'Someone from her past who remembers everything.',
    },
  ]


  const completedTasks =
    tasks.filter(
      task => task.completed
    ).length


  app.innerHTML = `

    <main class="project-page">

      <header class="project-header">

        <a
          href="#"
          class="back-link"
          onclick="renderProjects(); return false;"
        >
          ← Back to projects
        </a>


        <div class="project-header-content">

          <div>

            <p class="eyebrow">
              ✦ WRITING PROJECT
            </p>

            <h1>
              ${project.title}
            </h1>

            <p class="project-description">
              ${project.description}
            </p>

            <span class="project-genre">
              ${project.genre}
            </span>

          </div>


          <div class="project-header-actions">

            <div class="project-overview">

              <strong>
                ${chapters.length}
              </strong>

              <span>
                chapters
              </span>

            </div>


            <button
              type="button"
              class="delete-project-button"
              onclick="showDemoNotice('Deleting projects is disabled in this demo.')"
            >
              Delete project
            </button>

          </div>

        </div>

      </header>


      <!-- CHAPTERS -->

      <section class="project-card chapters-section">

        <div class="section-heading">

          <div>

            <p class="eyebrow">
              Your story
            </p>

            <h2>
              Chapters
            </h2>

            <p class="section-subtitle">
              Write and organize your story.
            </p>

          </div>

          <span class="section-count">
            ${chapters.length}
          </span>

        </div>


        <form
          class="chapter-paper"
          onsubmit="showDemoNotice('Creating chapters is disabled in this demo.'); return false;"
        >

          <div class="paper-header">

            <span>
              ✦
            </span>

            <span>
              New chapter
            </span>

          </div>


          <input
            type="text"
            placeholder="Chapter title..."
          />


          <textarea
            placeholder="Begin writing your story..."
            rows="7"
          ></textarea>


          <div class="paper-footer">

            <span>
              ✎ Your story starts here.
            </span>


            <button type="submit">
              + Create Chapter
            </button>

          </div>

        </form>


        <div class="chapter-diary-list">

          ${chapters.map(chapter => `

            <a
              href="#"
              class="chapter-diary"
              onclick="openChapter(${project.id}, ${chapter.id}); return false;"
            >

              <div class="chapter-diary-number">
                ${String(
                  chapter.position
                ).padStart(2, '0')}
              </div>


              <div class="chapter-diary-content">

                <span class="chapter-diary-label">
                  Chapter ${chapter.position}
                </span>


                <h3>
                  ${chapter.title}
                </h3>


                <p>
                  ${
                    chapter.content
                      ? chapter.content.slice(0, 150) +
                        (
                          chapter.content.length > 150
                            ? '...'
                            : ''
                        )
                      : 'An empty page waiting for your words...'
                  }
                </p>


                <span class="chapter-diary-words">
                  ${chapter.word_count} words
                </span>

              </div>


              <span class="chapter-diary-arrow">
                →
              </span>

            </a>

          `).join('')}

        </div>

      </section>


      <!-- TASKS -->

      <section class="project-card">

        <div class="section-heading">

          <div>

            <p class="eyebrow">
              Stay organized
            </p>

            <h2>
              Tasks
            </h2>

          </div>


          <span class="section-count">
            ${completedTasks}/${tasks.length}
          </span>

        </div>


        <form
          class="stack-form"
          onsubmit="showDemoNotice('Adding tasks is disabled in this demo.'); return false;"
        >

          <input
            type="text"
            placeholder="What needs to be done?"
          />


          <select>

            <option>
              No chapter
            </option>

            ${chapters.map(chapter => `
              <option>
                ${chapter.position}. ${chapter.title}
              </option>
            `).join('')}

          </select>


          <button type="submit">
            + Add Task
          </button>

        </form>


        <div class="task-list">

          ${tasks.map(task => `

            <label
              class="task-item ${
                task.completed
                  ? 'task-completed'
                  : ''
              }"
            >

              <input
                type="checkbox"
                ${
                  task.completed
                    ? 'checked'
                    : ''
                }
                onchange="showDemoNotice('Task updates are disabled in this demo.')"
              />


              <span>
                ${task.title}
              </span>

            </label>

          `).join('')}

        </div>

      </section>


      <!-- CHARACTERS -->

      <section class="project-card">

        <div class="section-heading">

          <div>

            <p class="eyebrow">
              Your world
            </p>

            <h2>
              Characters
            </h2>

          </div>


          <span class="section-count">
            ${characters.length}
          </span>

        </div>


        <form
          class="stack-form"
          onsubmit="showDemoNotice('Adding characters is disabled in this demo.'); return false;"
        >

          <input
            type="text"
            placeholder="Character name"
          />


          <input
            type="text"
            placeholder="Role"
          />


          <textarea
            placeholder="Character description"
            rows="3"
          ></textarea>


          <button type="submit">
            + Add Character
          </button>

        </form>


        <div class="character-list">

          ${characters.map(character => `

            <div class="character-item">

              <div class="character-avatar">
                ${character.name.charAt(0).toUpperCase()}
              </div>


              <div>

                <strong>
                  ${character.name}
                </strong>


                <span>
                  ${character.role}
                </span>


                <p>
                  ${character.description}
                </p>

              </div>

            </div>

          `).join('')}

        </div>

      </section>

    </main>


    <div class="demo-banner">
      You're viewing a demo of Writing Planner — this is not the original product.
    </div>

  `
}


/* =========================================
   CHAPTER
   COMING IN COMMIT 4
========================================= */

function openChapter(projectId, chapterId) {

  showDemoNotice(
    'The chapter editor is disabled in this demo.'
  )

}


/* =========================================
   START
========================================= */

renderLogin()