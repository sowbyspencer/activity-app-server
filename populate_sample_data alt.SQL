INSERT INTO "user" (
        id,
        email,
        password,
        profile_image,
        first_name,
        last_name
    )
VALUES (
        1,
        'test@example.com',
        'hashed_password',
        NULL,
        'Test',
        'User'
    );
INSERT INTO activity (
        id,
        name,
        location,
        has_cost,
        cost,
        available_sun,
        available_mon,
        available_tue,
        available_wed,
        available_thu,
        available_fri,
        available_sat,
        url,
        description
    )
VALUES (
        1,
        'Bowling',
        '123 Main St',
        true,
        15.00,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        'http://bowling.com',
        'Fun group activity'
    );
INSERT INTO activity_image (id, activity_id, image_url)
VALUES (1, 1, 'http://images.com/bowling1.jpg');
INSERT INTO activity_image (id, activity_id, image_url)
VALUES (2, 1, 'http://images.com/bowling2.jpg');
INSERT INTO swipe (id, user_id, activity_id, liked, swiped_at)
VALUES (1, 1, 1, true, '2025-03-27 12:00:00');
INSERT INTO chat (id, chat_type, activity_id, created_at)
VALUES (1, 'activity', 1, '2025-03-27 12:05:00');
INSERT INTO chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (1, 1, 1, '2025-03-27 12:06:00', NULL);
INSERT INTO message (id, user_id, content, sent_at, chat_id)
VALUES (
        1,
        1,
        'Hey, who wants to go bowling?',
        '2025-03-27 12:07:00',
        1
    );