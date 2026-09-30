<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // post, comment, user, community
            $table->unsignedBigInteger('target_id');
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->string('reason');
            $table->string('status')->default('pending'); // pending, approved, removed, dismissed
            $table->foreignId('moderator_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
