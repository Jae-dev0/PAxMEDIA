#!/bin/sh
# PAxMEDIA backend entrypoint.
# Waits for Postgres, applies migrations, seeds an empty DB, caches config,
# then hands off to the main command (supervisord: php-fpm + nginx).
set -e

echo "==> PAxMEDIA Backend Entrypoint"

# ── Wait for database ────────────────────────────────────────────────────────
echo "==> Waiting for database..."
ATTEMPTS=0
until php -r 'try { new PDO("pgsql:host=".getenv("DB_HOST").";port=".getenv("DB_PORT").";dbname=".getenv("DB_DATABASE"), getenv("DB_USERNAME"), getenv("DB_PASSWORD")); exit(0); } catch (Throwable $e) { exit(1); }'; do
    ATTEMPTS=$((ATTEMPTS + 1))
    if [ "$ATTEMPTS" -ge 30 ]; then
        echo "    ERROR: database unreachable after 30 attempts"
        exit 1
    fi
    echo "    Database not ready, retrying in 2s..."
    sleep 2
done
echo "==> Database is ready!"

# ── Migrations ───────────────────────────────────────────────────────────────
echo "==> Running migrations..."
php artisan migrate --force --no-interaction

# The seeder uses create() and is therefore not idempotent, so only run it
# against an empty database. Previously this ran on every boot and failed.
SEEDED=$(php -r '$p=new PDO("pgsql:host=".getenv("DB_HOST").";port=".getenv("DB_PORT").";dbname=".getenv("DB_DATABASE"), getenv("DB_USERNAME"), getenv("DB_PASSWORD")); echo $p->query("select count(*) from users")->fetchColumn() > 0 ? "yes" : "no";' 2>/dev/null || echo "no")
if [ "$SEEDED" = "no" ]; then
    echo "==> Seeding database..."
    php artisan db:seed --force --no-interaction
else
    echo "==> Already seeded, skipping"
fi

# ── Cache configuration ──────────────────────────────────────────────────────
# These are best-effort: this is an API-only app with no resources/views, so
# view:cache legitimately fails. A failure here must not crash the container.
echo "==> Caching configuration..."
php artisan config:clear >/dev/null 2>&1 || true
php artisan route:clear  >/dev/null 2>&1 || true
php artisan view:clear   >/dev/null 2>&1 || true
php artisan config:cache || echo "    (config cache skipped)"
php artisan route:cache  || echo "    (route cache skipped)"
php artisan view:cache   || echo "    (view cache skipped - no resources/views)"
php artisan event:cache  || echo "    (event cache skipped)"

# ── Start services ───────────────────────────────────────────────────────────
echo "==> Starting services..."
exec "$@"
