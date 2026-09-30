# PAxMEDIA Backend - Docker Management Script for Windows
# Usage: .\docker-manage.ps1 [command]

param(
    [Parameter(Position = 0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host ""
    Write-Host "PAxMEDIA Backend - Docker Management" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\docker-manage.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  build       Build Docker images"
    Write-Host "  up          Start all services in detached mode"
    Write-Host "  dev         Start development services"
    Write-Host "  down        Stop all services"
    Write-Host "  down-v      Stop all services and remove volumes"
    Write-Host "  logs        View all service logs"
    Write-Host "  logs-app    View application logs"
    Write-Host "  logs-db     View database logs"
    Write-Host "  shell       Open shell in app container"
    Write-Host "  migrate     Run database migrations"
    Write-Host "  seed        Run database seeders"
    Write-Host "  fresh       Fresh migrate and seed"
    Write-Host "  test        Run tests"
    Write-Host "  clear       Clear all caches"
    Write-Host "  optimize    Optimize application"
    Write-Host "  restart     Restart all services"
    Write-Host "  status      Show service status"
    Write-Host "  clean       Clean all containers, volumes, and images"
    Write-Host "  help        Show this help message"
    Write-Host ""
}

function Build-Images {
    Write-Host "==> Building Docker images..." -ForegroundColor Cyan
    docker compose build
}

function Start-Services {
    Write-Host "==> Starting all services..." -ForegroundColor Cyan
    docker compose up -d
    Write-Host "==> Services started!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  App:      http://localhost:8000" -ForegroundColor Yellow
    Write-Host "  API:      http://localhost:8000/api" -ForegroundColor Yellow
    Write-Host "  Database: localhost:5432" -ForegroundColor Yellow
    Write-Host "  Redis:    localhost:6379" -ForegroundColor Yellow
}

function Start-DevServices {
    Write-Host "==> Starting development services..." -ForegroundColor Cyan
    docker compose -f docker-compose.dev.yml up -d
    Write-Host "==> Development services started!" -ForegroundColor Green
}

function Stop-Services {
    Write-Host "==> Stopping all services..." -ForegroundColor Cyan
    docker compose down
}

function Stop-ServicesWithVolumes {
    Write-Host "==> Stopping all services and removing volumes..." -ForegroundColor Cyan
    docker compose down -v
}

function Show-Logs {
    Write-Host "==> Viewing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    docker compose logs -f
}

function Show-AppLogs {
    Write-Host "==> Viewing application logs..." -ForegroundColor Cyan
    docker compose logs -f app
}

function Show-DbLogs {
    Write-Host "==> Viewing database logs..." -ForegroundColor Cyan
    docker compose logs -f db
}

function Enter-Shell {
    Write-Host "==> Opening shell in app container..." -ForegroundColor Cyan
    docker compose exec app sh
}

function Run-Migrations {
    Write-Host "==> Running migrations..." -ForegroundColor Cyan
    docker compose exec app php artisan migrate --force
}

function Run-Seeders {
    Write-Host "==> Running seeders..." -ForegroundColor Cyan
    docker compose exec app php artisan db:seed --force
}

function Run-Fresh {
    Write-Host "==> Running fresh migrations and seeders..." -ForegroundColor Cyan
    docker compose exec app php artisan migrate:fresh --seed --force
}

function Run-Tests {
    Write-Host "==> Running tests..." -ForegroundColor Cyan
    docker compose exec app php artisan test
}

function Clear-Caches {
    Write-Host "==> Clearing all caches..." -ForegroundColor Cyan
    docker compose exec app php artisan optimize:clear
}

function Optimize-App {
    Write-Host "==> Optimizing application..." -ForegroundColor Cyan
    docker compose exec app php artisan optimize
}

function Restart-Services {
    Write-Host "==> Restarting all services..." -ForegroundColor Cyan
    docker compose restart
}

function Show-Status {
    Write-Host "==> Service status:" -ForegroundColor Cyan
    docker compose ps
}

function Clean-All {
    Write-Host "==> Cleaning all containers, volumes, and images..." -ForegroundColor Cyan
    docker compose down -v --rmi all --remove-orphans
}

# Main command switch
switch ($Command) {
    "build" { Build-Images }
    "up" { Start-Services }
    "dev" { Start-DevServices }
    "down" { Stop-Services }
    "down-v" { Stop-ServicesWithVolumes }
    "logs" { Show-Logs }
    "logs-app" { Show-AppLogs }
    "logs-db" { Show-DbLogs }
    "shell" { Enter-Shell }
    "migrate" { Run-Migrations }
    "seed" { Run-Seeders }
    "fresh" { Run-Fresh }
    "test" { Run-Tests }
    "clear" { Clear-Caches }
    "optimize" { Optimize-App }
    "restart" { Restart-Services }
    "status" { Show-Status }
    "clean" { Clean-All }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help
    }
}
