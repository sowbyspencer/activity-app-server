# Activity App Server

This is the backend server for the Activity App, a platform for users to discover, join, and interact with activities and groups. The server is built using Node.js, Express, and PostgreSQL.

## Features

- **Activity Management**: Fetch activities with details and associated images.
- **Group Chats**: Manage group chats for activities and direct user-to-user chats.
- **User Management**: Handle user profiles and interactions.
- **Database Integration**: PostgreSQL database with schema and sample data provided.

## Project Structure

```
activity-app-server/
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── .git/                 # Git repository data
├── .gitignore            # Git ignore file
├── 20250628 Backup/      # Backup of data/scripts (date-stamped)
├── certs/                # (Empty) Directory for SSL certificates or related files
├── db.ts                 # Database connection setup
├── docs/                 # (Empty) Documentation directory
├── index.js              # Main server entry point
├── just_data_as_inserts.sql # SQL script for data inserts
├── local_data.sql        # Local sample data
├── middleware/           # Middleware functions (e.g., auth.js)
│   └── auth.js
├── migrations/           # (Empty) Directory for DB migrations
├── package.json          # Project dependencies and scripts
├── package-lock.json     # NPM lockfile
├── populate_sample_data.SQL # SQL script to populate sample data
├── populate_sample_data_with_activities.SQL # SQL script for sample data with activities
├── public/               # Static files (images)
│   └── images/
├── queries/              # Database query logic
│   ├── activities.js
│   ├── activityGroup.js
│   ├── auth.js
│   ├── chat.js
│   ├── groups.js
│   └── users.js
├── routes/               # API route handlers
│   ├── activities.js
│   ├── activityGroup.js
│   ├── auth.js
│   ├── chat.js
│   ├── groups.js
│   └── users.js
├── README.md             # Project documentation
```

## Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **PostgreSQL**: A PostgreSQL database instance is required.

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd activity-app-server
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the environment variables:

   - Copy `.env.example` to `.env`:

     ```
     cp .env.example .env
     ```

   - Update the `.env` file with your configuration.

4. Set up the database:

   - Create the database schema:

     ```
     psql -U postgres -d <your_database_name> -f schema.SQL
     ```

   - Populate the database with sample data:

     ```
     psql -U postgres -d <your_database_name> -f populate_sample_data.SQL
     ```

## Usage

1. Start the server:

   ```
   npm start
   ```

2. The server will run at the URL specified in your `.env` file (default: `http://localhost:5000`).

3. Access the following API endpoints:

   - **Activities**: `GET /activities`
   - **Groups**: `GET /groups?user_id=<user_id>`
   - **Activity Group**: `GET /activityGroup/:activity_id?user_id=<user_id>`
   - **Chat Messages**: `GET /chat/:chat_id`

## Environment Variables

The following environment variables are required:

- `PORT`: The port the server will run on.
- `BASE_URL`: The base URL for the server.
- `IMAGE_PATH`: The path to serve static images.
- `JWT_SECRET`: The secret key for signing JSON Web Tokens.

Example `.env` file:

```
PORT=5000
BASE_URL=http://localhost:5000
IMAGE_PATH=http://localhost:5000/public/images
JWT_SECRET=your_jwt_secret_key
```

## Database Schema

The database schema is defined in `schema.SQL`. It includes tables for users, activities, swipes, chats, and messages.

## Sample Data

Sample data is provided in `populate_sample_data.SQL` to help you get started quickly.

## API Endpoints

### Activities

- **GET /activities**: Fetch all activities with details and images.

### Groups

- **GET /groups?user_id=<user_id>**: Fetch matched activities for a specific user.

### Activity Group

- **GET /activityGroup/:activity_id?user_id=<user_id>**: Fetch group details for a specific activity.

### Chat

- **GET /chat/:chat_id**: Fetch all messages for a specific chat.

### User Authentication

- **POST /register**: Register a new user.  
  **Request Body**:

  ```json
  {
    "email": "string",
    "password": "string",
    "first_name": "string",
    "last_name": "string",
    "profile_image": "string (image URI or base64)"
  }
  ```

  > **Note:** `profile_image` is now required. The backend will reject registration requests without a valid image.

- **POST /login**: Authenticate a user and return a JWT.  
  **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

## Static Files

Static images are served from the `public` directory. Access them via the `IMAGE_PATH` defined in your `.env` file.

## Location-Based Filtering

- Activities are filtered by latitude, longitude, and user-selected radius using the Haversine formula in SQL.
- The legacy `location` string field is deprecated and will be removed from the database and API.
- All endpoints for activity creation, editing, and discovery require lat/lon.
- Planned: Map/address picker and geocoding integration for frontend.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

## Version History

### v1.0.10 (July 5, 2025)

- Enforced profile image validation for user registration; registration now requires a valid image (see `/register` endpoint docs).
- Improved backend logic for robust image management: profile and activity images are now handled more reliably, including deletion and update flows.
- Enhanced activity editing and deletion: only changed fields are updated, and images are properly managed in both the database and filesystem.
- Added/updated endpoints and logic for declined activity refresh, group membership, and cascading deletions.
- Updated documentation and work plan to reflect new user testing workflow, EAS Build/OTA steps, and detailed QA process.
- General bugfixes, improved error handling, and backend polish in preparation for user testing and demo.

### v1.0.8 (June 30, 2025)

- Improved activity editing to update only changed fields, including robust image update, deletion, and addition logic (database and server filesystem).
- Implemented full activity deletion, with cascading removal of images from both the database and server filesystem.
- Enhanced API endpoints and backend logic for activity and image management.

### v1.0.7 (June 19, 2025)

- Added `/activities/leave` endpoint: Users can now leave/unlike an activity, which removes them from the group chat, deletes direct chats if there are no other shared activities, and cleans up all related swipe records and messages.
- Improved backend cleanup logic for group and chat membership, swipes, and messages when a user leaves an activity.
- Ensured all data related to a user's participation in an activity is fully removed for privacy and data integrity.
- Improved user account deletion: Deleting a user now also removes all their related data from the following tables: `swipe` (liked/declined activities), `activity_member` (activity group memberships), `chat_member` (chat memberships), `message` (all sent messages), and all direct/group chats where the user was the only member.
- Enhanced data integrity and privacy by ensuring no orphaned references remain after user deletion.

### v1.0.6 (June 11, 2025)

- Implemented POST /activities/swipe endpoint for recording swipes (like/dislike) and updating group membership.
- Added POST /activities/reset-swipes endpoint to allow users to refresh declined activities.
- Updated group membership logic to use activity_member table instead of swipe table for all group and activity queries.
- Improved error handling and documentation for new endpoints.
- **Updated:** The `/activities/swipe` endpoint now returns a detailed JSON response including the swipe record, whether the user was added to `activity_member`, and a list of direct chats created or found (with user IDs and chat IDs). This provides full transparency of all backend actions performed for each swipe.

### v1.0.5 (June 04, 2025)

- Refactored `queries/activities.js` for improved clarity and maintainability.
- Added `getUnswipedActivities(userId)` to fetch activities a user has not swiped on, including images and all activity details.
- Ensured both activity queries return images as arrays using `json_agg`.

### v1.0.4 (May 28, 2025)

- Added endpoint to delete user accounts with password validation (`POST /users/:id/delete`).
- Improved user password update logic (`PUT /users/:id/password`).
- Enhanced error handling for user-related routes.

### 2025-07-12

- Standardized all console logging across routes and queries to use colored output with chalk: white for actions started, green for success, red for errors, and yellow for warnings.
- Improved log clarity and visibility for backend actions, validation, and error handling.
- Updated user and activity routes to use colorized logs for profile updates, activity creation, editing, and deletion.
