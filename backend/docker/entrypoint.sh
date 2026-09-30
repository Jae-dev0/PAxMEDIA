#!/bin/sh
set -e

echo "==> PAxMEDIA Backend Entrypoint"

# Wait for database
echo "==> Waiting for database..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" > /dev/null 2>&1; do
    echo "    Database not ready, retrying in 2s..."
    sleep 2
done
echo "==> Database is ready!"

# Run migrations
echo "==> Running migrations..."
php artisan migrate --force --seed

# Clear and cache config
echo "==> Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Optimize
echo "==> Optimizing application..."
php artisan optimize

echo "==> Starting services..."

# Execute the main command
exec "$@"
