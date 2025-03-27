INSERT INTO public.activity (
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
        '1',
        'Disc Golf',
        'Local Disc Golf Course',
        'f',
        NULL,
        't',
        't',
        't',
        't',
        't',
        't',
        't',
        'https://www.pdga.com/courses',
        'Disc Golf is an outdoor sport where players throw a flying disc at a target. Enjoy a game at your local disc golf course!'
    );
INSERT INTO public.activity (
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
        '2',
        'Hiking The Tetons',
        'Grand Teton National Park',
        't',
        '5.00',
        't',
        't',
        't',
        't',
        't',
        't',
        't',
        'https://www.nps.gov/grte/index.htm',
        'Explore the stunning trails of the Grand Teton National Park. A perfect adventure for hikers of all skill levels!'
    );
INSERT INTO public.activity_image (id, activity_id, image_url)
VALUES (
        '1',
        '1',
        'http://10.244.131.46:5000/public/images/activities/image1.jpg'
    );
INSERT INTO public.activity_image (id, activity_id, image_url)
VALUES (
        '2',
        '1',
        'http://10.244.131.46:5000/public/images/activities/image2.webp'
    );
INSERT INTO public.activity_image (id, activity_id, image_url)
VALUES (
        '3',
        '1',
        'http://10.244.131.46:5000/public/images/activities/image3.webp'
    );
INSERT INTO public.activity_image (id, activity_id, image_url)
VALUES (
        '4',
        '1',
        'http://10.244.131.46:5000/public/images/activities/image4.webp'
    );
INSERT INTO public.activity_image (id, activity_id, image_url)
VALUES (
        '5',
        '2',
        'http://10.244.131.46:5000/public/images/activities/image4.png'
    );
INSERT INTO public.activity_image (id, activity_id, image_url)
VALUES (
        '6',
        '2',
        'http://10.244.131.46:5000/public/images/activities/image5.jpg'
    );
INSERT INTO public.activity_image (id, activity_id, image_url)
VALUES (
        '7',
        '2',
        'http://10.244.131.46:5000/public/images/activities/image6.png'
    );
INSERT INTO public."user" (
        id,
        email,
        password,
        profile_image,
        first_name,
        last_name
    )
VALUES (
        '1',
        'test_user@example.com',
        'hashedpassword1',
        'http://10.244.131.46:5000/public/images/users/',
        'Test',
        'User'
    );
INSERT INTO public."user" (
        id,
        email,
        password,
        profile_image,
        first_name,
        last_name
    )
VALUES (
        '2',
        'kayla@example.com',
        'hashedpassword2',
        'http://10.244.131.46:5000/public/images/users/Kayla.jfif',
        'Kayla',
        'Smith'
    );
INSERT INTO public."user" (
        id,
        email,
        password,
        profile_image,
        first_name,
        last_name
    )
VALUES (
        '3',
        'eric@example.com',
        'hashedpassword3',
        'http://10.244.131.46:5000/public/images/users/Eric.jfif',
        'Eric',
        'Johnson'
    );
INSERT INTO public."user" (
        id,
        email,
        password,
        profile_image,
        first_name,
        last_name
    )
VALUES (
        '4',
        'johan@example.com',
        'hashedpassword4',
        'http://10.244.131.46:5000/public/images/users/Johan.jfif',
        'Johan',
        'Andersson'
    );
INSERT INTO public.chat (id, chat_type, activity_id, created_at)
VALUES (
        '3',
        'direct',
        NULL,
        '2025-03-21 09:57:14.654343'
    );
INSERT INTO public.chat (id, chat_type, activity_id, created_at)
VALUES (
        '4',
        'direct',
        NULL,
        '2025-03-21 09:57:14.654343'
    );
INSERT INTO public.chat (id, chat_type, activity_id, created_at)
VALUES (
        '1',
        'activity',
        '2',
        '2025-03-21 09:56:25.887455'
    );
INSERT INTO public.chat (id, chat_type, activity_id, created_at)
VALUES (
        '2',
        'activity',
        '1',
        '2025-03-21 09:56:25.887455'
    );
INSERT INTO public.chat (id, chat_type, activity_id, created_at)
VALUES (
        '5',
        'direct',
        NULL,
        '2025-03-21 10:00:14.654343'
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '1',
        '1',
        '1',
        '2025-03-21 09:56:52.467007',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '2',
        '1',
        '2',
        '2025-03-21 09:56:52.467007',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '3',
        '1',
        '3',
        '2025-03-21 09:56:52.467007',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '4',
        '2',
        '1',
        '2025-03-21 09:56:52.467007',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '5',
        '2',
        '4',
        '2025-03-21 09:56:52.467007',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '6',
        '3',
        '1',
        '2025-03-21 09:57:28.046644',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '7',
        '3',
        '2',
        '2025-03-21 09:57:28.046644',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '8',
        '4',
        '1',
        '2025-03-21 09:57:28.046644',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '9',
        '4',
        '3',
        '2025-03-21 09:57:28.046644',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '10',
        '5',
        '1',
        '2025-03-21 09:57:28.046644',
        NULL
    );
INSERT INTO public.chat_member (id, chat_id, user_id, joined_at, left_at)
VALUES (
        '11',
        '5',
        '4',
        '2025-03-21 09:57:28.046644',
        NULL
    );
INSERT INTO public.message (id, user_id, content, sent_at, chat_id)
VALUES (
        '1',
        '1',
        'Hey everyone, ready for the hike?',
        '2025-03-21 09:00:00',
        '1'
    );
INSERT INTO public.message (id, user_id, content, sent_at, chat_id)
VALUES (
        '2',
        '2',
        'Yes! I am so excited.',
        '2025-03-21 09:01:00',
        '1'
    );
INSERT INTO public.message (id, user_id, content, sent_at, chat_id)
VALUES (
        '3',
        '1',
        'Who is up for Disc Golf this weekend?',
        '2025-03-21 09:02:00',
        '2'
    );
INSERT INTO public.message (id, user_id, content, sent_at, chat_id)
VALUES (
        '4',
        '1',
        'Hey Kayla, how have you been?',
        '2025-03-21 09:03:00',
        '3'
    );
INSERT INTO public.message (id, user_id, content, sent_at, chat_id)
VALUES (
        '5',
        '2',
        'Hey Test User! I’m good, what about you?',
        '2025-03-21 09:04:00',
        '3'
    );
INSERT INTO public.message (id, user_id, content, sent_at, chat_id)
VALUES (
        '6',
        '1',
        'Eric, did you get the hiking gear?',
        '2025-03-21 09:05:00',
        '4'
    );
INSERT INTO public.message (id, user_id, content, sent_at, chat_id)
VALUES (
        '7',
        '3',
        'Yeah! I just got everything packed.',
        '2025-03-21 09:06:00',
        '4'
    );
INSERT INTO public.swipe (id, user_id, activity_id, liked, swiped_at)
VALUES ('1', '1', '2', 't', '2025-03-20 16:16:43.176463');
INSERT INTO public.swipe (id, user_id, activity_id, liked, swiped_at)
VALUES ('3', '3', '2', 't', '2025-03-20 16:16:43.176463');
INSERT INTO public.swipe (id, user_id, activity_id, liked, swiped_at)
VALUES ('4', '1', '1', 't', '2025-03-20 16:16:43.176463');
INSERT INTO public.swipe (id, user_id, activity_id, liked, swiped_at)
VALUES ('5', '4', '1', 't', '2025-03-20 16:16:43.176463');
INSERT INTO public.swipe (id, user_id, activity_id, liked, swiped_at)
VALUES ('2', '2', '2', 't', '2025-03-20 16:16:43.176463');