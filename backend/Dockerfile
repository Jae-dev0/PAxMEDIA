FROM php:8.3-fpm-alpine

# Install system dependencies and PHP extensions
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
    autoconf \
    g++ \
    make \
    linux-headers \
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

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configure PHP
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Configure Nginx (http.d is inside the http block where server directives are allowed)
RUN mkdir -p /etc/nginx/http.d
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Configure Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Entrypoint (waits for DB, migrates, then starts php-fpm + nginx)
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Create required directories
RUN mkdir -p /var/log/supervisor /var/log/php /var/log/nginx /var/run

WORKDIR /var/www/html

# Copy application
COPY . .

# Install dependencies
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --no-scripts --prefer-dist --ignore-platform-reqs \
    || composer update --no-dev --no-scripts --prefer-dist --ignore-platform-reqs

# Fail the build if vendor/ is missing or incomplete, so a broken image can never ship
RUN test -f vendor/autoload.php || (echo "FATAL: vendor/ missing" && exit 1)

# Set permissions
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache \
    && chmod -R 775 \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
