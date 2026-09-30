# ─── Stage 1: Build dependencies ─────────────────────────────────────────────
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --ignore-platform-reqs

# ─── Stage 2: Build frontend assets (if needed) ───────────────────────────────
FROM node:20-alpine AS assets

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .
RUN npm run build || true

# ─── Stage 3: Production image ────────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS production

# Install dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    curl \
    nginx \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pgsql \
        zip \
        gd \
        mbstring \
        bcmath \
        opcache

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Configure PHP
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Configure Nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Configure Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /var/www/html

# Copy application
COPY --from=vendor /app/vendor ./vendor
COPY . .

# Generate autoload
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache \
    && chmod -R 775 \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD curl -f http://localhost:80/up || exit 1

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
