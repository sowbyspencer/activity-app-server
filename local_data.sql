INSERT INTO activity
VALUES (
        1,
        'Disc Golf',
        'Local Disc Golf Course',
        false,
        NULL,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        'https://www.pdga.com/courses',
        'Disc Golf is an outdoor sport where players throw a flying disc at a target. Enjoy a game at your local disc golf course!'
    );
INSERT INTO activity
VALUES (
        2,
        'Hiking The Tetons',
        'Grand Teton National Park',
        true,
        5.00,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        'https://www.nps.gov/grte/index.htm',
        'Explore the stunning trails of the Grand Teton National Park. A perfect adventure for hikers of all skill levels!'
    );
INSERT INTO activity_image
VALUES (
        1,
        1,
        'http://10.244.131.46:5000/public/images/activities/image1.jpg'
    );
INSERT INTO activity_image
VALUES (
        2,
        1,
        'http://10.244.131.46:5000/public/images/activities/image2.webp'
    );
INSERT INTO activity_image
VALUES (
        3,
        1,
        'http://10.244.131.46:5000/public/images/activities/image3.webp'
    );
INSERT INTO activity_image
VALUES (
        4,
        1,
        'http://10.244.131.46:5000/public/images/activities/image4.webp'
    );
INSERT INTO activity_image
VALUES (
        5,
        2,
        'http://10.244.131.46:5000/public/images/activities/image4.png'
    );
INSERT INTO activity_image
VALUES (
        6,
        2,
        'http://10.244.131.46:5000/public/images/activities/image5.jpg'
    );
INSERT INTO activity_image
VALUES (
        7,
        2,
        'http://10.244.131.46:5000/public/images/activities/image6.png'
    );
INSERT INTO chat
VALUES (3, 'direct', NULL, '2025-03-21 09:57:14.654343');
INSERT INTO chat
VALUES (4, 'direct', NULL, '2025-03-21 09:57:14.654343');
INSERT INTO chat
VALUES (1, 'activity', 2, '2025-03-21 09:56:25.887455');
INSERT INTO chat
VALUES (2, 'activity', 1, '2025-03-21 09:56:25.887455');
INSERT INTO chat
VALUES (5, 'direct', NULL, '2025-03-21 10:00:14.654343');
INSERT INTO chat_member
VALUES (1, 1, 1, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO chat_member
VALUES (2, 1, 2, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO chat_member
VALUES (3, 1, 3, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO chat_member
VALUES (4, 2, 1, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO chat_member
VALUES (5, 2, 4, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO chat_member
VALUES (6, 3, 1, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO chat_member
VALUES (7, 3, 2, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO chat_member
VALUES (8, 4, 1, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO chat_member
VALUES (9, 4, 3, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO chat_member
VALUES (10, 5, 1, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO chat_member
VALUES (11, 5, 4, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO message
VALUES (
        1,
        1,
        'Hey everyone, ready for the hike?',
        '2025-03-21 09:00:00',
        1
    );
INSERT INTO message
VALUES (
        2,
        2,
        'Yes! I am so excited.',
        '2025-03-21 09:01:00',
        1
    );
INSERT INTO message
VALUES (
        3,
        1,
        'Who is up for Disc Golf this weekend?',
        '2025-03-21 09:02:00',
        2
    );
INSERT INTO message
VALUES (
        4,
        1,
        'Hey Kayla, how have you been?',
        '2025-03-21 09:03:00',
        3
    );
INSERT INTO message
VALUES (
        5,
        2,
        'Hey Test User! I’m good, what about you?',
        '2025-03-21 09:04:00',
        3
    );
INSERT INTO message
VALUES (
        6,
        1,
        'Eric, did you get the hiking gear?',
        '2025-03-21 09:05:00',
        4
    );
INSERT INTO message
VALUES (
        7,
        3,
        'Yeah! I just got everything packed.',
        '2025-03-21 09:06:00',
        4
    );
INSERT INTO swipe
VALUES (1, 1, 2, true, '2025-03-20 16:16:43.176463');
INSERT INTO swipe
VALUES (3, 3, 2, true, '2025-03-20 16:16:43.176463');
INSERT INTO swipe
VALUES (4, 1, 1, true, '2025-03-20 16:16:43.176463');
INSERT INTO swipe
VALUES (5, 4, 1, true, '2025-03-20 16:16:43.176463');
INSERT INTO swipe
VALUES (2, 2, 2, true, '2025-03-20 16:16:43.176463');
INSERT INTO "user"
VALUES (
        1,
        'test_user@example.com',
        'hashedpassword1',
        'http://10.244.131.46:5000/public/images/users/',
        'Test',
        'User'
    );
INSERT INTO "user"
VALUES (
        2,
        'kayla@example.com',
        'hashedpassword2',
        'http://10.244.131.46:5000/public/images/users/Kayla.jfif',
        'Kayla',
        'Smith'
    );
INSERT INTO "user"
VALUES (
        3,
        'eric@example.com',
        'hashedpassword3',
        'http://10.244.131.46:5000/public/images/users/Eric.jfif',
        'Eric',
        'Johnson'
    );
INSERT INTO "user"
VALUES (
        4,
        'johan@example.com',
        'hashedpassword4',
        'http://10.244.131.46:5000/public/images/users/Johan.jfif',
        'Johan',
        'Andersson'
    );