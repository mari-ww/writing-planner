def create_project(client, title):
    response = client.post(
        "/projects",
        json={
            "title": title,
        },
    )

    assert response.status_code == 201

    return response.json()


def test_create_project(authenticated_client):
    response = authenticated_client.post(
        "/projects",
        json={
            "title": "My Novel",
            "description": "A fantasy story",
            "genre": "Fantasy",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "My Novel"
    assert data["description"] == "A fantasy story"
    assert data["genre"] == "Fantasy"


def test_user_cannot_access_another_users_project(
    client,
):
    first_user = {
        "email": "first@example.com",
        "password": "password123",
    }

    client.post(
        "/auth/register",
        json=first_user,
    )

    login_response = client.post(
        "/auth/login",
        json=first_user,
    )

    first_token = login_response.json()["access_token"]

    client.headers.update(
        {
            "Authorization": f"Bearer {first_token}",
        }
    )

    project_response = client.post(
        "/projects",
        json={
            "title": "Private Project",
        },
    )

    project_id = project_response.json()["id"]

    second_user = {
        "email": "second@example.com",
        "password": "password123",
    }

    client.headers.clear()

    client.post(
        "/auth/register",
        json=second_user,
    )

    login_response = client.post(
        "/auth/login",
        json=second_user,
    )

    second_token = login_response.json()["access_token"]

    client.headers.update(
        {
            "Authorization": f"Bearer {second_token}",
        }
    )

    response = client.get(
        f"/projects/{project_id}",
    )

    assert response.status_code == 403