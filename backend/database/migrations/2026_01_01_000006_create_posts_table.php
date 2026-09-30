<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained()->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('type')->default('text'); // text, image, gallery, video, link, poll
            $table->json('media')->nullable();
            $table->string('link')->nullable();
            $table->json('poll')->nullable();
            $table->string('flair')->nullable();
            $table->string('flair_color')->nullable();
            $table->integer('score')->default(0);
            $table->unsignedBigInteger('comments_count')->default(0);
            $table->unsignedBigInteger('reposts_count')->default(0);
            $table->boolean('is_spoiler')->default(false);
            $table->boolean('is_nsfw')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->boolean('is_hidden')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
