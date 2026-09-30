# PAxMEDIA - Docker Management Script for Windows
# Usage: .\docker-manage.ps1 [command]

param(
    [Parameter(Position = 0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host ""
    Write-Host "PAxMEDIA - Full Stack Docker Management" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\docker-manage.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  build       Build all Docker images"
    Write-Host "  up          Start all services (frontend + backend + db)"
    Write-Host "  down        Stop all services"
    Write-Host "  down-v      Stop all services and remove volumes"
    Write-Host "  logs        View all service logs"
    Write-Host "  logs-fe     View frontend logs"
    Write-Host "  logs-be     View backend logs"
    Write-Host "  logs-db     View database logs"
    Write-Host "  shell-be    Open shell in backend container"
    Write-Host "  shell-db    Open shell in database container"
    Write-Host "  migrate     Run database migrations"
    Write-Host "  seed        Run database seeders"
    Write-Host "  fresh       Fresh migrate and seed"
    Write-Host "  restart     Restart all services"
    Write-Host "  status      Show service status"
    Write-Host "  clean       Clean all containers, volumes, and images"
    Write-Host "  help        Show this help message"
    Write-Host ""
    Write-Host "Services:" -ForegroundColor Green
    Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Yellow
    Write-Host "  Backend:   http://localhost:8000/api" -ForegroundColor Yellow
    Write-Host "  Database:  localhost:5432 (Navicat)" -ForegroundColor Yellow
    Write-Host "  Redis:     localhost:6379" -ForegroundColor Yellow
    Write-Host ""
}

function Build-Images {
    Write-Host "==> Building all Docker images..." -ForegroundColor Cyan
    docker compose build
}

function Start-Services {
    Write-Host "==> Starting all services..." -ForegroundColor Cyan
    docker compose up -d
    Write-Host ""
    Write-Host "==> Services started!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Yellow
    Write-Host "  Backend:   http://localhost:8000/api" -ForegroundColor Yellow
    Write-Host "  Database:  localhost:5432 (Navicat)" -ForegroundColor Yellow
    Write-Host "  Redis:     localhost:6379" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Database credentials for Navicat:" -ForegroundColor Cyan
    Write-Host "    Host:     localhost" -ForegroundColor White
    Write-Host "    Port:     5432" -ForegroundColor White
    Write-Host "    Database: paxmedia" -ForegroundColor White
    Write-Host "    Username: paxmedia" -ForegroundColor White
    Write-Host "    Password: paxmedia_secret" -ForegroundColor White
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

function Show-FrontendLogs {
    Write-Host "==> Viewing frontend logs..." -ForegroundColor Cyan
    docker compose logs -f frontend
}

function Show-BackendLogs {
    Write-Host "==> Viewing backend logs..." -ForegroundColor Cyan
    docker compose logs -f backend
}

function Show-DbLogs {
    Write-Host "==> Viewing database logs..." -ForegroundColor Cyan
    docker compose logs -f postgres
}

function Enter-BackendShell {
    Write-Host "==> Opening shell in backend container..." -ForegroundColor Cyan
    docker compose exec backend sh
}

function Enter-DbShell {
    Write-Host "==> Opening shell in database container..." -ForegroundColor Cyan
    docker compose exec postgres psql -U paxmedia -d paxmedia
}

function Run-Migrations {
    Write-Host "==> Running migrations..." -ForegroundColor Cyan
    docker compose exec backend php artisan migrate --force
}

function Run-Seeders {
    Write-Host "==> Running seeders..." -ForegroundColor Cyan
    docker compose exec backend php artisan db:seed --force
}

function Run-Fresh {
    Write-Host "==> Running fresh migrations and seeders..." -ForegroundColor Cyan
    docker compose exec backend php artisan migrate:fresh --seed --force
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
    "down" { Stop-Services }
    "down-v" { Stop-ServicesWithVolumes }
    "logs" { Show-Logs }
    "logs-fe" { Show-FrontendLogs }
    "logs-be" { Show-BackendLogs }
    "logs-db" { Show-DbLogs }
    "shell-be" { Enter-BackendShell }
    "shell-db" { Enter-DbShell }
    "migrate" { Run-Migrations }
    "seed" { Run-Seeders }
    "fresh" { Run-Fresh }
    "restart" { Restart-Services }
    "status" { Show-Status }
    "clean" { Clean-All }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help
    }
}
