<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'description',
        'icon',
        'banner',
        'members_count',
        'online_count',
        'category',
        'created_by',
    ];

    protected $casts = [
        'is_joined' => 'boolean',
        'is_following' => 'boolean',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function rules()
    {
        return $this->hasMany(CommunityRule::class)->orderBy('order');
    }

    public function moderators()
    {
        return $this->belongsToMany(User::class, 'community_moderators');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'community_members')
            ->withPivot('is_joined', 'is_following')
            ->withTimestamps();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
