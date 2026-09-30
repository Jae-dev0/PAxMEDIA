<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Community;
use App\Models\CommunityRule;
use App\Models\CommunityModerator;
use App\Models\CommunityMember;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Notification;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create users
        $users = [
            [
                'username' => 'alexchen',
                'display_name' => 'Alex Chen',
                'email' => 'alex@example.com',
                'password' => Hash::make('password'),
                'bio' => 'Full-stack developer. Open source enthusiast. Coffee addict.',
                'karma' => 48520,
                'followers_count' => 1240,
                'following_count' => 356,
                'role' => 'admin',
                'is_verified' => true,
            ],
            [
                'username' => 'sarahmiller',
                'display_name' => 'Sarah Miller',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password'),
                'bio' => 'Photographer & visual storyteller. Based in Portland.',
                'karma' => 32100,
                'followers_count' => 890,
                'following_count' => 445,
                'role' => 'moderator',
            ],
            [
                'username' => 'jordanlee',
                'display_name' => 'Jordan Lee',
                'email' => 'jordan@example.com',
                'password' => Hash::make('password'),
                'bio' => 'Gamer, streamer, and tech reviewer.',
                'karma' => 27800,
                'followers_count' => 2100,
                'following_count' => 180,
            ],
            [
                'username' => 'emilyzhang',
                'display_name' => 'Emily Zhang',
                'email' => 'emily@example.com',
                'password' => Hash::make('password'),
                'bio' => 'Data scientist by day, artist by night.',
                'karma' => 19500,
                'followers_count' => 670,
                'following_count' => 290,
            ],
            [
                'username' => 'marcusjohnson',
                'display_name' => 'Marcus Johnson',
                'email' => 'marcus@example.com',
                'password' => Hash::make('password'),
                'bio' => 'Music producer and audio engineer.',
                'karma' => 15200,
                'followers_count' => 430,
                'following_count' => 510,
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // Create communities
        $communities = [
            [
                'slug' => 'technology',
                'name' => 'Technology',
                'description' => 'The latest in tech news, gadgets, and innovation. Discuss everything from AI to quantum computing.',
                'category' => 'Technology',
                'members_count' => 2450000,
                'online_count' => 12400,
                'created_by' => 1,
            ],
            [
                'slug' => 'gaming',
                'name' => 'Gaming',
                'description' => 'Your destination for all things gaming. PC, console, mobile, and everything in between.',
                'category' => 'Gaming',
                'members_count' => 3200000,
                'online_count' => 18500,
                'created_by' => 3,
            ],
            [
                'slug' => 'photography',
                'name' => 'Photography',
                'description' => 'Share your photos, get feedback, and discuss techniques. All skill levels welcome.',
                'category' => 'Arts',
                'members_count' => 1800000,
                'online_count' => 8900,
                'created_by' => 2,
            ],
            [
                'slug' => 'science',
                'name' => 'Science',
                'description' => 'Explore the wonders of science. Physics, biology, chemistry, astronomy, and more.',
                'category' => 'Science',
                'members_count' => 1500000,
                'online_count' => 6700,
                'created_by' => 4,
            ],
            [
                'slug' => 'music',
                'name' => 'Music',
                'description' => 'Discover new music, share your playlists, and discuss your favorite artists.',
                'category' => 'Entertainment',
                'members_count' => 2100000,
                'online_count' => 11200,
                'created_by' => 5,
            ],
        ];

        foreach ($communities as $communityData) {
            Community::create($communityData);
        }

        // Add community rules
        CommunityRule::create(['community_id' => 1, 'title' => 'Be respectful', 'description' => 'Treat others with respect. No personal attacks or harassment.', 'order' => 1]);
        CommunityRule::create(['community_id' => 1, 'title' => 'No spam', 'description' => 'Do not post spam or self-promotional content without contributing to the community.', 'order' => 2]);
        CommunityRule::create(['community_id' => 1, 'title' => 'Stay on topic', 'description' => 'Posts must be related to technology.', 'order' => 3]);

        // Add moderators
        CommunityModerator::create(['community_id' => 1, 'user_id' => 1]);
        CommunityModerator::create(['community_id' => 1, 'user_id' => 2]);
        CommunityModerator::create(['community_id' => 2, 'user_id' => 3]);
        CommunityModerator::create(['community_id' => 3, 'user_id' => 2]);

        // Add members
        CommunityMember::create(['community_id' => 1, 'user_id' => 1, 'is_joined' => true, 'is_following' => true]);
        CommunityMember::create(['community_id' => 1, 'user_id' => 2, 'is_joined' => true, 'is_following' => true]);
        CommunityMember::create(['community_id' => 2, 'user_id' => 3, 'is_joined' => true, 'is_following' => false]);
        CommunityMember::create(['community_id' => 5, 'user_id' => 5, 'is_joined' => true, 'is_following' => true]);

        // Create posts
        Post::create([
            'community_id' => 1,
            'author_id' => 1,
            'title' => 'Apple announces M4 chip with revolutionary AI capabilities',
            'body' => 'Apple just unveiled their new M4 chip at the October event. The new chip features a 16-core Neural Engine capable of 38 trillion operations per second, specifically designed for AI workloads.',
            'type' => 'text',
            'flair' => 'News',
            'score' => 1842,
            'comments_count' => 342,
            'reposts_count' => 128,
        ]);

        Post::create([
            'community_id' => 2,
            'author_id' => 3,
            'title' => 'Elden Ring Nightreign - First Impressions after 20 hours',
            'body' => 'Just finished my 20-hour playthrough of Elden Ring Nightreign and I have thoughts. The combat is as tight as ever, but the new roguelike elements add a fresh layer of strategy.',
            'type' => 'text',
            'flair' => 'Review',
            'score' => 892,
            'comments_count' => 156,
            'reposts_count' => 45,
        ]);

        Post::create([
            'community_id' => 1,
            'author_id' => 1,
            'title' => 'Why I switched from microservices back to a monolith',
            'body' => 'After 3 years of running a microservices architecture at scale, we made the controversial decision to consolidate back into a modular monolith.',
            'type' => 'text',
            'flair' => 'Discussion',
            'score' => 4521,
            'comments_count' => 567,
            'reposts_count' => 892,
            'is_pinned' => true,
        ]);

        // Create comments
        Comment::create([
            'post_id' => 1,
            'author_id' => 3,
            'body' => 'The Neural Engine improvements are impressive, but I\'m more interested in how they\'re handling the AI privacy concerns.',
            'score' => 234,
        ]);

        Comment::create([
            'post_id' => 1,
            'author_id' => 1,
            'body' => 'Absolutely! Apple has been very clear about keeping AI processing on-device whenever possible.',
            'score' => 156,
            'parent_id' => 1,
        ]);

        // Create notifications
        Notification::create([
            'user_id' => 1,
            'actor_id' => 3,
            'type' => 'comment_reply',
            'message' => 'replied to your comment in "Apple announces M4 chip"',
            'post_id' => 1,
        ]);

        Notification::create([
            'user_id' => 1,
            'actor_id' => 2,
            'type' => 'upvote',
            'message' => 'upvoted your post "Show PAxMEDIA: I built a real-time collaborative code editor"',
            'post_id' => 3,
        ]);
    }
}
