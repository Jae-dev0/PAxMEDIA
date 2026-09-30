<?php

namespace App\Http\Controllers\Api;

use App\Models\Community;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $query = Community::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $communities = $query->orderByDesc('members_count')
            ->paginate($request->get('per_page', 10));

        return response()->json($communities);
    }

    public function show($slug)
    {
        $community = Community::with(['rules', 'moderators', 'creator'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($community);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:communities',
            'description' => 'required|string',
            'category' => 'nullable|string',
        ]);

        $community = Community::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($community, 201);
    }

    public function join(Request $request, $id)
    {
        $user = $request->user();
        $isJoined = $user->communities()->toggle($id);

        $community = Community::find($id);
        $community->members_count = $community->members()->count();
        $community->save();

        return response()->json([
            'is_joined' => !empty($isJoined['attached']),
            'members_count' => $community->members_count,
        ]);
    }

    public function follow(Request $request, $id)
    {
        $user = $request->user();
        $user->communities()->updateExistingPivot($id, ['is_following' => true]);

        return response()->json(['is_following' => true]);
    }

    public function posts(Request $request, $id)
    {
        $posts = Post::where('community_id', $id)
            ->where('is_hidden', false)
            ->with(['community', 'author'])
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 15));

        return response()->json($posts);
    }
}
