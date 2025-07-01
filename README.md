# Activity App Server

This is the backend server for the Activity App, a platform for users to discover, join, and interact with activities and groups. The server is built using Node.js, Express, and PostgreSQL.

## Features

- **Activity Management**: Fetch activities with details and associated images.
- **Group Chats**: Manage group chats for activities and direct user-to-user chats.
- **User Management**: Handle user profiles and interactions.
- **Database Integration**: PostgreSQL database with schema and sample data provided.

## Project Structure

```
.
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── db.ts                 # Database connection setup
├── index.js              # Main server entry point
├── package.json          # Project dependencies and scripts
├── populate_sample_data.SQL # SQL script to populate sample data
├── schema.SQL            # Database schema definition
├── public/               # Static files (images)
├── queries/              # Database query logic
├── routes/               # API route handlers
└── .gitignore            # Git ignore file
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
    "username": "string",
    "password": "string",
    "email": "string"
  }
  ```

- **POST /login**: Authenticate a user and return a JWT.  
  **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

## Static Files

Static images are served from the `public` directory. Access them via the `IMAGE_PATH` defined in your `.env` file.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

## Version History

### v1.0.8 (2025-06-30)

- Improved activity editing to update only changed fields, including robust image update, deletion, and addition logic (database and server filesystem).
- Implemented full activity deletion, with cascading removal of images from both the database and server filesystem.
- Enhanced API endpoints and backend logic for activity and image management.

### v1.0.7 (2025-06-19)

- Added `/activities/leave` endpoint: Users can now leave/unlike an activity, which removes them from the group chat, deletes direct chats if there are no other shared activities, and cleans up all related swipe records and messages.
- Improved backend cleanup logic for group and chat membership, swipes, and messages when a user leaves an activity.
- Ensured all data related to a user's participation in an activity is fully removed for privacy and data integrity.
- Improved user account deletion: Deleting a user now also removes all their related data from the following tables: `swipe` (liked/declined activities), `activity_member` (activity group memberships), `chat_member` (chat memberships), `message` (all sent messages), and all direct/group chats where the user was the only member.
- Enhanced data integrity and privacy by ensuring no orphaned references remain after user deletion.

### v1.0.6 (2025-06-11)

- Implemented POST /activities/swipe endpoint for recording swipes (like/dislike) and updating group membership.
- Added POST /activities/reset-swipes endpoint to allow users to refresh declined activities.
- Updated group membership logic to use activity_member table instead of swipe table for all group and activity queries.
- Improved error handling and documentation for new endpoints.
- **Updated:** The `/activities/swipe` endpoint now returns a detailed JSON response including the swipe record, whether the user was added to `activity_member`, and a list of direct chats created or found (with user IDs and chat IDs). This provides full transparency of all backend actions performed for each swipe.

### v1.0.5 (2025-06-04)

- Refactored `queries/activities.js` for improved clarity and maintainability.
- Added `getUnswipedActivities(userId)` to fetch activities a user has not swiped on, including images and all activity details.
- Ensured both activity queries return images as arrays using `json_agg`.

### v1.0.4 (2025-05-28)

- Added endpoint to delete user accounts with password validation (`POST /users/:id/delete`).
- Improved user password update logic (`PUT /users/:id/password`).
- Enhanced error handling for user-related routes.
