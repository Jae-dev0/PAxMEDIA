<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ban extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reason',
        'moderator_id',
        'community_id',
        'is_permanent',
        'expires_at',
    ];

    protected $casts = [
        'is_permanent' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderator_id');
    }

    public function community()
    {
        return $this->belongsTo(Community::class);
    }
}
