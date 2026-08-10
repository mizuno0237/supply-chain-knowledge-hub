# Prepare local Docker Compose on Windows: .env + frontend/dist + compose config check
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.docker.example") {
        Copy-Item ".env.docker.example" ".env"
        Write-Host "[prepare-compose] created .env from .env.docker.example"
    } elseif (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[prepare-compose] created .env from .env.example"
    } else {
        throw "No .env.docker.example or .env.example found"
    }
}

$dist = Join-Path "frontend" "dist"
$needsBuild = -not (Test-Path $dist) -or ((Get-ChildItem $dist -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0)
if ($needsBuild) {
    Write-Host "[prepare-compose] building frontend/dist..."
    $env:VITE_IS_DOCKER = "true"
    Push-Location frontend
    npm ci
    npm run build
    Pop-Location
} else {
    Write-Host "[prepare-compose] frontend/dist already present"
}

$docker = Get-Command docker -ErrorAction SilentlyContinue
if ($docker) {
    docker compose config | Out-Null
    Write-Host "[prepare-compose] docker compose config OK"
} else {
    Write-Host "[prepare-compose] docker not in PATH — install Docker Desktop, then: docker compose up -d"
}

Write-Host "[prepare-compose] ready: docker compose up -d"
