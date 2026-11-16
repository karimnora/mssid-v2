@echo off
setlocal
pushd "%~dp0" || exit /b 1
if not exist ".env.v2.local" (
  echo Fichier .env.v2.local absent. Voir docs\v2-tests-isoles.md.
  goto :failure
)
docker version --format "{{.Server.Version}}" >nul 2>&1
if errorlevel 1 (
  echo Docker est inaccessible. Demarrer Docker Desktop puis reessayer.
  goto :failure
)
docker image inspect mssid-v2-stack-backend mssid-v2-stack-web postgres:16 >nul 2>&1
if errorlevel 1 (
  echo Les images de la pile V2 ne sont pas toutes disponibles.
  echo Aucun build ni telechargement automatique. Voir docs\v2-tests-isoles.md.
  goto :failure
)
docker compose --env-file .env.v2.local -f compose.v2.yml up -d --no-build --pull never --wait --wait-timeout 120
if errorlevel 1 goto :failure
echo Conteneurs V2 demarres. Site : http://localhost:3002
popd
pause
exit /b 0

:failure
echo La pile V2 n'a pas pu demarrer. Aucun volume n'a ete efface.
popd
pause
exit /b 1
