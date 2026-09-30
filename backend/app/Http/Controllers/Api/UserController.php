<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->has('search'), function ($q) use ($request) {
                $search = $request->search;
                $q->where('username', 'like', "%{$search}%")
                  ->orWhere('display_name', 'like', "%{$search}%");
            })
            ->orderByDesc('karma')
            ->paginate($request->get('per_page', 10));

        return response()->json($users);
    }

    public function show($username)
    {
        $user = User::with(['communities', 'moderatedCommunities'])
            ->where('username', $username)
            ->firstOrFail();

        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'display_name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string',
            'banner' => 'nullable|string',
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function follow(Request $request, $id)
    {
        $user = $request->user();
        $target = User::findOrFail($id);

        $isFollowing = $user->following()->toggle($id);

        $target->followers_count = $target->followers()->count();
        $target->save();

        return response()->json([
            'is_following' => !empty($isFollowing['attached']),
            'followers_count' => $target->followers_count,
        ]);
    }

    public function posts(Request $request, $id)
    {
        $posts = \App\Models\Post::where('author_id', $id)
            ->with(['community', 'author'])
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 10));

        return response()->json($posts);
    }

    public function comments(Request $request, $id)
    {
        $comments = \App\Models\Comment::where('author_id', $id)
            ->with(['post', 'post.community'])
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 10));

        return response()->json($comments);
    }
}
