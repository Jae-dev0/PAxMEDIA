<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'display_name',
        'email',
        'password',
        'avatar',
        'banner',
        'bio',
        'karma',
        'followers_count',
        'following_count',
        'role',
        'is_online',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_online' => 'boolean',
        'is_verified' => 'boolean',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'author_id');
    }

    public function communities()
    {
        return $this->belongsToMany(Community::class, 'community_members')
            ->withPivot('is_joined', 'is_following')
            ->withTimestamps();
    }

    public function moderatedCommunities()
    {
        return $this->belongsToMany(Community::class, 'community_moderators');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants')
            ->withPivot('unread_count', 'last_read_at')
            ->withTimestamps();
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id');
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id');
    }

    public function postVotes()
    {
        return $this->hasMany(PostVote::class);
    }

    public function commentVotes()
    {
        return $this->hasMany(CommentVote::class);
    }

    public function repostedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_reposts');
    }

    public function savedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_saves');
    }
}
