def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "test@example.com"
    assert data["daily_word_goal"] == 500
    assert "id" in data


def test_cannot_register_duplicate_email(
    client,
):
    user_data = {
        "email": "test@example.com",
        "password": "password123",
    }

    first_response = client.post(
        "/auth/register",
        json=user_data,
    )

    second_response = client.post(
        "/auth/register",
        json=user_data,
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 409


def test_login_returns_access_token(
    client,
    user_data,
):
    client.post(
        "/auth/register",
        json=user_data,
    )

    response = client.post(
        "/auth/login",
        json=user_data,
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_with_invalid_password(
    client,
    user_data,
):
    client.post(
        "/auth/register",
        json=user_data,
    )

    response = client.post(
        "/auth/login",
        json={
            "email": user_data["email"],
            "password": "wrong-password",
        },
    )

    assert response.status_code == 401