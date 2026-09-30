<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\CommentVote;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, $postId)
    {
        $sort = $request->get('sort', 'best');

        $comments = Comment::with(['author', 'replies.author'])
            ->where('post_id', $postId)
            ->whereNull('parent_id');

        switch ($sort) {
            case 'newest':
                $comments->latest();
                break;
            case 'oldest':
                $comments->oldest();
                break;
            case 'controversial':
                $comments->orderByRaw('ABS(score) DESC');
                break;
            default:
                $comments->orderByDesc('score');
        }

        return response()->json($comments->paginate($request->get('per_page', 20)));
    }

    public function store(Request $request, $postId)
    {
        $validated = $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'post_id' => $postId,
            'parent_id' => $validated['parent_id'] ?? null,
            'author_id' => $request->user()->id,
            'body' => $validated['body'],
            'score' => 1,
        ]);

        // Update post comments count
        $post = \App\Models\Post::find($postId);
        $post->comments_count = $post->comments()->count();
        $post->save();

        return response()->json($comment->load('author'), 201);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->author_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->update([
            'body' => $request->body,
            'is_edited' => true,
        ]);

        return response()->json($comment);
    }

    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->author_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }

    public function vote(Request $request, $id)
    {
        $validated = $request->validate(['vote' => 'required|in:-1,0,1']);

        CommentVote::updateOrCreate(
            ['comment_id' => $id, 'user_id' => $request->user()->id],
            ['vote' => $validated['vote']]
        );

        $comment = Comment::find($id);
        $comment->score = CommentVote::where('comment_id', $id)->sum('vote');
        $comment->save();

        return response()->json(['score' => $comment->score, 'user_vote' => $validated['vote']]);
    }
}
