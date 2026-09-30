<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'community_id',
        'user_id',
        'is_joined',
        'is_following',
    ];

    protected $casts = [
        'is_joined' => 'boolean',
        'is_following' => 'boolean',
    ];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
