<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Models\PostVote;
use App\Models\PostRepost;
use App\Models\PostSave;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['community', 'author'])
            ->where('is_hidden', false);

        if ($request->has('community_id')) {
            $query->where('community_id', $request->community_id);
        }

        if ($request->has('user_id')) {
            $query->where('author_id', $request->user_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $sort = $request->get('sort', 'hot');
        switch ($sort) {
            case 'new':
                $query->latest();
                break;
            case 'top':
                $query->orderByDesc('score');
                break;
            case 'rising':
                $query->orderByDesc('comments_count');
                break;
            default:
                $query->orderByDesc('score');
        }

        $posts = $query->paginate($request->get('per_page', 15));

        return response()->json($posts);
    }

    public function show($id)
    {
        $post = Post::with(['community', 'author', 'comments.replies.author'])
            ->findOrFail($id);

        return response()->json($post);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'community_id' => 'required|exists:communities,id',
            'title' => 'required|string|max:300',
            'body' => 'nullable|string',
            'type' => 'required|in:text,image,gallery,video,link,poll',
            'media' => 'nullable|array',
            'link' => 'nullable|url',
            'poll' => 'nullable|array',
            'flair' => 'nullable|string',
            'is_spoiler' => 'boolean',
            'is_nsfw' => 'boolean',
        ]);

        $post = Post::create([
            ...$validated,
            'author_id' => $request->user()->id,
            'score' => 1,
        ]);

        return response()->json($post, 201);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->author_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->update($request->only(['title', 'body', 'flair', 'is_spoiler', 'is_nsfw']));

        return response()->json($post);
    }

    public function destroy(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->author_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }

    public function vote(Request $request, $id)
    {
        $validated = $request->validate(['vote' => 'required|in:-1,0,1']);

        $vote = PostVote::updateOrCreate(
            ['post_id' => $id, 'user_id' => $request->user()->id],
            ['vote' => $validated['vote']]
        );

        $post = Post::find($id);
        $post->score = PostVote::where('post_id', $id)->sum('vote');
        $post->save();

        return response()->json(['score' => $post->score, 'user_vote' => $validated['vote']]);
    }

    public function save(Request $request, $id)
    {
        $user = $request->user();
        $isSaved = $user->savedPosts()->toggle($id);

        return response()->json(['is_saved' => !empty($isSaved['attached'])]);
    }

    public function repost(Request $request, $id)
    {
        $user = $request->user();
        $isReposted = $user->repostedPosts()->toggle($id);

        $post = Post::find($id);
        $post->reposts_count = PostRepost::where('post_id', $id)->count();
        $post->save();

        return response()->json([
            'is_reposted' => !empty($isReposted['attached']),
            'reposts_count' => $post->reposts_count,
        ]);
    }

    public function hide(Request $request, $id)
    {
        $post = Post::find($id);
        $post->is_hidden = true;
        $post->save();

        return response()->json(['is_hidden' => true]);
    }
}
