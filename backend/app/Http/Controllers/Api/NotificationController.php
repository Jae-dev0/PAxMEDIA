<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::with(['actor', 'post', 'comment', 'community'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 20));

        return response()->json($notifications);
    }

    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
