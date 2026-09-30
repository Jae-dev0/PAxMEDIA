# PAxMEDIA Backend

Laravel API backend for PAxMEDIA with PostgreSQL database.

## Requirements

- PHP 8.2+
- PostgreSQL 14+
- Composer 2.x

## Installation

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start development server
php artisan serve
```

## Database Setup

```bash
# Create PostgreSQL database
createdb paxmedia

# Or using psql
psql -U postgres -c "CREATE DATABASE paxmedia;"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users
- `GET /api/users/{username}` - Get user profile
- `PUT /api/users/me` - Update current user
- `POST /api/users/{id}/follow` - Follow/unfollow user
- `GET /api/users/{id}/posts` - Get user posts
- `GET /api/users/{id}/comments` - Get user comments

### Communities
- `GET /api/communities` - List communities
- `GET /api/communities/{slug}` - Get community details
- `POST /api/communities` - Create community
- `POST /api/communities/{id}/join` - Join/leave community
- `POST /api/communities/{id}/follow` - Follow community
- `GET /api/communities/{id}/posts` - Get community posts

### Posts
- `GET /api/posts` - List posts
- `GET /api/posts/{id}` - Get post details
- `POST /api/posts` - Create post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `POST /api/posts/{id}/vote` - Vote on post
- `POST /api/posts/{id}/save` - Save/unsave post
- `POST /api/posts/{id}/repost` - Repost/unrepost post
- `POST /api/posts/{id}/hide` - Hide post

### Comments
- `GET /api/posts/{postId}/comments` - List comments
- `POST /api/posts/{postId}/comments` - Create comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment
- `POST /api/comments/{id}/vote` - Vote on comment

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read

### Messages
- `GET /api/conversations` - List conversations
- `GET /api/conversations/{id}` - Get conversation
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/{id}/messages` - Get messages
- `POST /api/conversations/{id}/messages` - Send message
- `POST /api/conversations/{id}/read` - Mark as read

### Search
- `GET /api/search?q={query}` - Search all
- `GET /api/search?q={query}&type=posts` - Search posts
- `GET /api/search?q={query}&type=communities` - Search communities
- `GET /api/search?q={query}&type=users` - Search users
- `GET /api/search?q={query}&type=comments` - Search comments

### Moderation
- `GET /api/moderation/reports` - List reports
- `GET /api/moderation/reports/stats` - Get report stats
- `POST /api/moderation/reports/{id}/resolve` - Resolve report
- `GET /api/moderation/bans` - List bans
- `POST /api/moderation/bans` - Ban user

## Authentication

The API uses Laravel Sanctum for authentication. Include the token in the Authorization header:

```
Authorization: Bearer {your-token}
```

## License

MIT
