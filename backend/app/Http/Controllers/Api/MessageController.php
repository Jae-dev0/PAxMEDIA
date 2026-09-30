<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function conversations(Request $request)
    {
        $conversations = Conversation::with(['participants', 'lastMessage'])
            ->whereHas('participants', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            })
            ->orderByDesc('updated_at')
            ->paginate($request->get('per_page', 20));

        return response()->json($conversations);
    }

    public function show($id)
    {
        $conversation = Conversation::with(['participants', 'messages.sender'])
            ->whereHas('participants', function ($q) {
                $q->where('user_id', auth()->id());
            })
            ->findOrFail($id);

        return response()->json($conversation);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'participant_ids' => 'required|array',
            'participant_ids.*' => 'exists:users,id',
            'group_name' => 'nullable|string',
            'is_group' => 'boolean',
        ]);

        $conversation = Conversation::create([
            'group_name' => $validated['group_name'] ?? null,
            'is_group' => $validated['is_group'] ?? false,
        ]);

        $conversation->participants()->attach($request->user()->id);
        foreach ($validated['participant_ids'] as $participantId) {
            $conversation->participants()->attach($participantId);
        }

        return response()->json($conversation->load('participants'), 201);
    }

    public function messages(Request $request, $id)
    {
        $messages = Message::with('sender')
            ->where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->paginate($request->get('per_page', 50));

        return response()->json($messages);
    }

    public function sendMessage(Request $request, $id)
    {
        $validated = $request->validate([
            'body' => 'required|string',
            'attachments' => 'nullable|array',
        ]);

        $message = Message::create([
            'conversation_id' => $id,
            'sender_id' => $request->user()->id,
            'body' => $validated['body'],
            'attachments' => $validated['attachments'] ?? null,
        ]);

        return response()->json($message->load('sender'), 201);
    }

    public function markAsRead(Request $request, $id)
    {
        $conversation = Conversation::find($id);
        $conversation->participants()->updateExistingPivot($request->user()->id, [
            'unread_count' => 0,
            'last_read_at' => now(),
        ]);

        return response()->json(['message' => 'Conversation marked as read']);
    }
}
