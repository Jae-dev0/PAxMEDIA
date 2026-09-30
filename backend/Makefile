.PHONY: help build up down logs shell migrate seed test clean

# Default target
help: ## Show this help message
	@echo "PAxMEDIA Backend - Docker Management"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Build all images
build: ## Build Docker images
	docker compose build

# Start all services
up: ## Start all services in detached mode
	docker compose up -d

# Start development services
dev: ## Start development services
	docker compose -f docker-compose.dev.yml up -d

# Stop all services
down: ## Stop all services
	docker compose down

# Stop and remove volumes
down-v: ## Stop all services and remove volumes
	docker compose down -v

# View logs
logs: ## View all service logs
	docker compose logs -f

# View app logs
logs-app: ## View application logs
	docker compose logs -f app

# View database logs
logs-db: ## View database logs
	docker compose logs -f db

# Shell into app container
shell: ## Open shell in app container
	docker compose exec app sh

# Run migrations
migrate: ## Run database migrations
	docker compose exec app php artisan migrate --force

# Run seeders
seed: ## Run database seeders
	docker compose exec app php artisan db:seed --force

# Fresh migrate and seed
fresh: ## Fresh migrate and seed
	docker compose exec app php artisan migrate:fresh --seed --force

# Run tests
test: ## Run tests
	docker compose exec app php artisan test

# Clear caches
clear: ## Clear all caches
	docker compose exec app php artisan optimize:clear

# Optimize
optimize: ## Optimize application
	docker compose exec app php artisan optimize

# Restart services
restart: ## Restart all services
	docker compose restart

# Status
status: ## Show service status
	docker compose ps

# Clean everything
clean: ## Clean all containers, volumes, and images
	docker compose down -v --rmi all --remove-orphans
