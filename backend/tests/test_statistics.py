def create_project(client):
    response = client.post(
        "/projects",
        json={
            "title": "Statistics Project",
        },
    )

    assert response.status_code == 201

    return response.json()


def create_chapter(
    client,
    project_id,
    title,
    content,
):
    response = client.post(
        f"/projects/{project_id}/chapters",
        json={
            "title": title,
            "content": content,
        },
    )

    assert response.status_code == 201

    return response.json()


def test_project_statistics(
    authenticated_client,
):
    project = create_project(
        authenticated_client,
    )

    create_chapter(
        authenticated_client,
        project["id"],
        "Chapter One",
        "one two three four",
    )

    create_chapter(
        authenticated_client,
        project["id"],
        "Chapter Two",
        "one two three four five six",
    )

    response = authenticated_client.get(
        f"/projects/{project['id']}/statistics",
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_words"] == 10
    assert data["chapter_count"] == 2
    assert data["average_words_per_chapter"] == 5.0

    assert data["daily_word_goal"] == 500
    assert data["daily_word_progress"] == 10
    assert data["daily_goal_percentage"] == 2.0


def test_statistics_do_not_exceed_daily_goal(
    authenticated_client,
):
    project = create_project(
        authenticated_client,
    )

    content = "word " * 600

    create_chapter(
        authenticated_client,
        project["id"],
        "Long Chapter",
        content,
    )

    response = authenticated_client.get(
        f"/projects/{project['id']}/statistics",
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_words"] == 600
    assert data["daily_word_progress"] == 500
    assert data["daily_goal_percentage"] == 100