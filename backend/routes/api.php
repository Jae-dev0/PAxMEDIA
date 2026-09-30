<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommunityController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ModerationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{username}', [UserController::class, 'show']);
    Route::put('/users/me', [UserController::class, 'update']);
    Route::post('/users/{id}/follow', [UserController::class, 'follow']);
    Route::get('/users/{id}/posts', [UserController::class, 'posts']);
    Route::get('/users/{id}/comments', [UserController::class, 'comments']);

    // Communities
    Route::get('/communities', [CommunityController::class, 'index']);
    Route::get('/communities/{slug}', [CommunityController::class, 'show']);
    Route::post('/communities', [CommunityController::class, 'store']);
    Route::post('/communities/{id}/join', [CommunityController::class, 'join']);
    Route::post('/communities/{id}/follow', [CommunityController::class, 'follow']);
    Route::get('/communities/{id}/posts', [CommunityController::class, 'posts']);

    // Posts
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::post('/posts/{id}/vote', [PostController::class, 'vote']);
    Route::post('/posts/{id}/save', [PostController::class, 'save']);
    Route::post('/posts/{id}/repost', [PostController::class, 'repost']);
    Route::post('/posts/{id}/hide', [PostController::class, 'hide']);

    // Comments
    Route::get('/posts/{postId}/comments', [CommentController::class, 'index']);
    Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
    Route::post('/comments/{id}/vote', [CommentController::class, 'vote']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Messages
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::get('/conversations/{id}', [MessageController::class, 'show']);
    Route::post('/conversations', [MessageController::class, 'store']);
    Route::get('/conversations/{id}/messages', [MessageController::class, 'messages']);
    Route::post('/conversations/{id}/messages', [MessageController::class, 'sendMessage']);
    Route::post('/conversations/{id}/read', [MessageController::class, 'markAsRead']);

    // Search
    Route::get('/search', [SearchController::class, 'search']);

    // Moderation
    Route::get('/moderation/reports', [ModerationController::class, 'reports']);
    Route::get('/moderation/reports/stats', [ModerationController::class, 'stats']);
    Route::post('/moderation/reports/{id}/resolve', [ModerationController::class, 'resolve']);
    Route::get('/moderation/bans', [ModerationController::class, 'bans']);
    Route::post('/moderation/bans', [ModerationController::class, 'banUser']);
});
