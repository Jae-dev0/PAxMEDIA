<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Ban;
use Illuminate\Http\Request;

class ModerationController extends Controller
{
    public function reports(Request $request)
    {
        $query = Report::with(['reporter', 'moderator']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->orderByDesc('created_at')
            ->paginate($request->get('per_page', 20));

        return response()->json($reports);
    }

    public function stats()
    {
        return response()->json([
            'total' => Report::count(),
            'pending' => Report::where('status', 'pending')->count(),
            'resolved' => Report::whereIn('status', ['approved', 'removed', 'dismissed'])->count(),
        ]);
    }

    public function resolve(Request $request, $id)
    {
        $validated = $request->validate(['action' => 'required|in:approve,remove,dismiss']);

        $report = Report::findOrFail($id);
        $report->update([
            'status' => $validated['action'] === 'approve' ? 'approved' : ($validated['action'] === 'remove' ? 'removed' : 'dismissed'),
            'moderator_id' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return response()->json($report);
    }

    public function bans(Request $request)
    {
        $bans = Ban::with(['user', 'moderator', 'community'])
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 20));

        return response()->json($bans);
    }

    public function banUser(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'reason' => 'required|string',
            'community_id' => 'nullable|exists:communities,id',
            'is_permanent' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $ban = Ban::create([
            ...$validated,
            'moderator_id' => $request->user()->id,
        ]);

        return response()->json($ban, 201);
    }
}
