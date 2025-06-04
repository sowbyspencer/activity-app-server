-- Insert sample data into the activity table
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
        'Disc Golf',
        'Local Park',
        FALSE,
        NULL,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        FALSE,
        'https://www.pdga.com/',
        'A fun and competitive outdoor game where players throw a disc at a target.'
    ),
    (
        2,
        'Hiking The Tetons',
        'Grand Teton National Park',
        FALSE,
        NULL,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        'https://www.nps.gov/grte/index.htm',
        'A scenic and adventurous hike through the breathtaking landscapes of the Teton Mountains.'
    ),
    (
        3,
        'Sunset Yoga in the Park',
        'Central City Park',
        FALSE,
        NULL,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        'https://example.com/yoga',
        'Join a relaxing group yoga session as the sun sets. All skill levels welcome!'
    ),
    (
        4,
        'Board Game Night',
        'Downtown Community Center',
        FALSE,
        NULL,
        FALSE,
        TRUE,
        FALSE,
        TRUE,
        FALSE,
        TRUE,
        FALSE,
        'https://example.com/boardgames',
        'Bring your favorite board games or try something new. Snacks provided!'
    ),
    (
        5,
        'Art Walk Tour',
        'City Art District',
        FALSE,
        NULL,
        FALSE,
        FALSE,
        FALSE,
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        'https://example.com/artwalk',
        'Explore local galleries and street art with a guided walking tour.'
    ),
    (
        6,
        'Kayaking Adventure',
        'Riverbend Launch Site',
        TRUE,
        20.00,
        TRUE,
        FALSE,
        FALSE,
        FALSE,
        FALSE,
        TRUE,
        TRUE,
        'https://example.com/kayak',
        'Paddle down the river with a group. Equipment rental included in cost.'
    ),
    (
        7,
        'Cooking Class: Italian Night',
        'Chef''s Kitchen Studio',
        TRUE,
        35.00,
        FALSE,
        TRUE,
        FALSE,
        FALSE,
        FALSE,
        FALSE,
        TRUE,
        'https://example.com/cooking',
        'Learn to make classic Italian dishes from scratch in a fun, hands-on class.'
    );
-- Insert sample images for activities
INSERT INTO activity_image (activity_id, image_url)
VALUES (
        1,
        'http://localhost:5000/public/images/activities/image1.jpg'
    ),
    (
        1,
        'http://localhost:5000/public/images/activities/image2.webp'
    ),
    (
        1,
        'http://localhost:5000/public/images/activities/image3.webp'
    ),
    (
        1,
        'http://localhost:5000/public/images/activities/image4.webp'
    ),
    (
        2,
        'http://localhost:5000/public/images/activities/image4.png'
    ),
    (
        2,
        'http://localhost:5000/public/images/activities/image5.jpg'
    ),
    (
        2,
        'http://localhost:5000/public/images/activities/image6.png'
    ),
    (
        3,
        'http://activity-app-server.onrender.com/public/images/activities/test_image.png'
    ),
    (
        4,
        'http://activity-app-server.onrender.com/public/images/activities/test_image.png'
    ),
    (
        5,
        'http://activity-app-server.onrender.com/public/images/activities/test_image.png'
    ),
    (
        6,
        'http://activity-app-server.onrender.com/public/images/activities/test_image.png'
    ),
    (
        7,
        'http://activity-app-server.onrender.com/public/images/activities/test_image.png'
    );
-- Insert sample data into the user table
INSERT INTO "user" (
        id,
        email,
        password,
        first_name,
        last_name,
        profile_image
    )
VALUES (
        1,
        'test_user@example.com',
        'hashedpassword1',
        'Test',
        'User',
        'http://localhost:5000/public/images/test_user.jpg'
    ),
    (
        2,
        'kayla@example.com',
        'hashedpassword2',
        'Kayla',
        'Smith',
        'http://localhost:5000/public/images/Kayla.jfif'
    ),
    (
        3,
        'eric@example.com',
        'hashedpassword3',
        'Eric',
        'Johnson',
        'http://localhost:5000/public/images/Eric.jfif'
    ),
    (
        4,
        'johan@example.com',
        'hashedpassword4',
        'Johan',
        'Andersson',
        'http://localhost:5000/public/images/Johan.jfif'
    );
-- Insert sample data into the "swipe" table
INSERT INTO "swipe" (user_id, activity_id, liked)
VALUES (1, 2, TRUE),
    -- test_user swiped up (liked) on Hiking
    (2, 2, TRUE),
    -- Kayla swiped up (liked) on Hiking
    (3, 2, TRUE),
    -- Eric swiped up (liked) on Hiking
    (1, 1, TRUE),
    -- test_user swiped up (liked) on Disc Golf
    (4, 1, TRUE);
-- Johan swiped up (liked) on Disc Golf
-- Insert Activity Group Chats
INSERT INTO chat (chat_type, activity_id)
VALUES ('activity', 1),
    -- Hiking Group Chat
    ('activity', 2);
-- Disc Golf Group Chat
-- Insert Users into Activity Group Chats
INSERT INTO chat_member (chat_id, user_id)
VALUES (1, 1),
    (1, 2),
    (1, 3),
    -- Test User, Kayla, Eric in Hiking Group Chat
    (2, 1),
    (2, 4);
-- Test User, Johan in Disc Golf Group Chat
-- Insert Direct Chats (User-to-User)
INSERT INTO chat (chat_type)
VALUES ('direct'),
    -- Direct Chat 1 (Test User & Kayla)
    ('direct');
-- Direct Chat 2 (Test User & Eric)
-- Insert Users into Direct Chats
INSERT INTO chat_member (chat_id, user_id)
VALUES (3, 1),
    (3, 2),
    -- Test User & Kayla
    (4, 1),
    (4, 3);
-- Test User & Eric
-- Insert Messages into Group & Direct Chats
INSERT INTO message (chat_id, user_id, content)
VALUES (1, 1, 'Hey everyone, ready for the hike?'),
    (1, 2, 'Yes! I am so excited.'),
    (2, 1, 'Who is up for Disc Golf this weekend?'),
    (3, 1, 'Hey Kayla, how have you been?'),
    (3, 2, 'Hey Test User! I’m good, what about you?'),
    (4, 1, 'Eric, did you get the hiking gear?'),
    (4, 3, 'Yeah! I just got everything packed.');