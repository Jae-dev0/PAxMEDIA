<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Community;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q');
        $type = $request->get('type', 'all');

        $results = [];

        if ($type === 'all' || $type === 'posts') {
            $posts = Post::with(['community', 'author'])
                ->where('title', 'like', "%{$query}%")
                ->orWhere('body', 'like', "%{$query}%")
                ->limit(10)
                ->get()
                ->map(function ($post) {
                    $post->search_type = 'post';
                    return $post;
                });
            $results = array_merge($results, $posts->toArray());
        }

        if ($type === 'all' || $type === 'communities') {
            $communities = Community::where('name', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%")
                ->limit(10)
                ->get()
                ->map(function ($community) {
                    $community->search_type = 'community';
                    return $community;
                });
            $results = array_merge($results, $communities->toArray());
        }

        if ($type === 'all' || $type === 'users') {
            $users = User::where('username', 'like', "%{$query}%")
                ->orWhere('display_name', 'like', "%{$query}%")
                ->limit(10)
                ->get()
                ->map(function ($user) {
                    $user->search_type = 'user';
                    return $user;
                });
            $results = array_merge($results, $users->toArray());
        }

        if ($type === 'all' || $type === 'comments') {
            $comments = Comment::with(['author', 'post'])
                ->where('body', 'like', "%{$query}%")
                ->limit(10)
                ->get()
                ->map(function ($comment) {
                    $comment->search_type = 'comment';
                    return $comment;
                });
            $results = array_merge($results, $comments->toArray());
        }

        return response()->json([
            'data' => $results,
            'total' => count($results),
        ]);
    }
}
