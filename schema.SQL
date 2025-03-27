-- Drop existing tables to avoid conflicts (use with caution)
DROP TABLE IF EXISTS message,
chat_member,
chat,
swipe,
activity_image,
activity,
"user" CASCADE;
-- 1️⃣ User Table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_image TEXT DEFAULT NULL
);
-- 2️⃣ Activity Table
CREATE TABLE activity (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT DEFAULT NULL,
    has_cost BOOLEAN NOT NULL DEFAULT FALSE,
    cost DECIMAL(10, 2) DEFAULT NULL,
    available_sun BOOLEAN DEFAULT FALSE,
    available_mon BOOLEAN DEFAULT FALSE,
    available_tue BOOLEAN DEFAULT FALSE,
    available_wed BOOLEAN DEFAULT FALSE,
    available_thu BOOLEAN DEFAULT FALSE,
    available_fri BOOLEAN DEFAULT FALSE,
    available_sat BOOLEAN DEFAULT FALSE,
    url TEXT DEFAULT NULL
);
-- 3️⃣ Activity Image Table (Stores Multiple Images for Each Activity)
CREATE TABLE activity_image (
    id SERIAL PRIMARY KEY,
    activity_id INT REFERENCES activity(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);
-- 4️⃣ Swipe Table (Tracks Likes/Dislikes)
CREATE TABLE swipe (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    activity_id INT REFERENCES activity(id) ON DELETE CASCADE,
    liked BOOLEAN NOT NULL,
    -- TRUE for like, FALSE for dislike
    swiped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 5️⃣ Chat Table (Stores All Chats - Both Direct and Activity Chats)
CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    chat_type TEXT CHECK (chat_type IN ('activity', 'direct')) NOT NULL,
    activity_id INT REFERENCES activity(id) ON DELETE CASCADE,
    -- NULL for direct chats
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 6️⃣ Chat Member Table (Tracks Users in Each Chat)
CREATE TABLE chat_member (
    id SERIAL PRIMARY KEY,
    chat_id INT REFERENCES chat(id) ON DELETE CASCADE,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 7️⃣ Message Table (Stores Messages for Any Chat)
CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    chat_id INT REFERENCES chat(id) ON DELETE CASCADE,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);