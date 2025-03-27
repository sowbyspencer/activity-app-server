-- Drop existing tables to avoid conflicts (use with caution)
DROP TABLE IF EXISTS message,
chat_member,
chat,
swipe,
activity_image,
activity,
activity_member,
"user" CASCADE;
CREATE TABLE activity (
    id integer NOT NULL,
    name text NOT NULL,
    location text,
    has_cost boolean DEFAULT false NOT NULL,
    cost numeric(10, 2),
    available_sun boolean DEFAULT false,
    available_mon boolean DEFAULT false,
    available_tue boolean DEFAULT false,
    available_wed boolean DEFAULT false,
    available_thu boolean DEFAULT false,
    available_fri boolean DEFAULT false,
    available_sat boolean DEFAULT false,
    url text,
    description text
);
CREATE TABLE activity_image (
    id integer NOT NULL,
    activity_id integer,
    image_url text NOT NULL
);
CREATE TABLE activity_member (
    id integer NOT NULL,
    activity_id integer,
    user_id integer,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE chat (
    id integer NOT NULL,
    chat_type text NOT NULL,
    activity_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CHECK (chat_type IN ('activity', 'direct'))
);
CREATE TABLE chat_member (
    id integer NOT NULL,
    chat_id integer,
    user_id integer,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    left_at timestamp without time zone
);
CREATE TABLE message (
    id integer NOT NULL,
    user_id integer,
    content text NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    chat_id integer
);
CREATE TABLE swipe (
    id integer NOT NULL,
    user_id integer,
    activity_id integer,
    liked boolean NOT NULL,
    swiped_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "user" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    profile_image text,
    first_name text DEFAULT '' NOT NULL,
    last_name text DEFAULT '' NOT NULL
);