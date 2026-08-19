def create_project(client, title):
    response = client.post(
        "/projects",
        json={
            "title": title,
        },
    )

    assert response.status_code == 201

    return response.json()


def create_chapter(
    client,
    project_id,
    title,
):
    response = client.post(
        f"/projects/{project_id}/chapters",
        json={
            "title": title,
            "content": "",
        },
    )

    assert response.status_code == 201

    return response.json()


def test_task_cannot_use_chapter_from_another_project(
    authenticated_client,
):
    project_one = create_project(
        authenticated_client,
        "Project One",
    )

    project_two = create_project(
        authenticated_client,
        "Project Two",
    )

    chapter = create_chapter(
        authenticated_client,
        project_one["id"],
        "Chapter One",
    )

    response = authenticated_client.post(
        f"/projects/{project_two['id']}/tasks",
        json={
            "title": "Invalid task",
            "chapter_id": chapter["id"],
        },
    )

    assert response.status_code == 404

    assert response.json()["detail"] == (
        "Chapter not found in this project"
    )