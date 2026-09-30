<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // NOTE: Sanctum's EnsureFrontendRequestsAreStateful is deliberately NOT
        // enabled. It switches browser requests (Referer/Origin on a stateful
        // domain) into cookie-based "web" session mode, which pulls in CSRF
        // validation and makes every write fail with HTTP 419. This frontend
        // authenticates with a Bearer token in localStorage, so stateless
        // token auth is the correct model here.

        // This is an API-only app with no HTML login page. Returning null makes
        // the auth middleware emit a 401 JSON response instead of trying to
        // redirect to a non-existent 'login' route.
        $middleware->redirectGuestsTo(fn () => null);

        $middleware->alias([
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Always answer API requests with JSON, even without an Accept header.
        // Without this, a 401 tries to render/redirect to a non-existent
        // 'login' route and surfaces as a misleading 500.
        $exceptions->shouldRenderJsonWhen(
            fn ($request) => $request->is('api/*') || $request->expectsJson()
        );
    })->create();
