<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'community_id',
        'author_id',
        'title',
        'body',
        'type',
        'media',
        'link',
        'poll',
        'flair',
        'flair_color',
        'score',
        'comments_count',
        'reposts_count',
        'is_spoiler',
        'is_nsfw',
        'is_pinned',
        'is_locked',
        'is_hidden',
    ];

    protected $casts = [
        'media' => 'array',
        'poll' => 'array',
        'is_spoiler' => 'boolean',
        'is_nsfw' => 'boolean',
        'is_pinned' => 'boolean',
        'is_locked' => 'boolean',
        'is_hidden' => 'boolean',
    ];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function votes()
    {
        return $this->hasMany(PostVote::class);
    }

    public function reposts()
    {
        return $this->belongsToMany(User::class, 'post_reposts');
    }

    public function saves()
    {
        return $this->belongsToMany(User::class, 'post_saves');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
