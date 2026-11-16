@echo off
setlocal
pushd "%~dp0" || exit /b 1
if not exist ".env.v2.local" (
  echo Fichier .env.v2.local absent. Voir docs\v2-tests-isoles.md.
  goto :failure
)
docker compose --env-file .env.v2.local -f compose.v2.yml down
if errorlevel 1 goto :failure
echo Pile V2 arretee. Les comptes et la base de test sont conserves.
popd
pause
exit /b 0

:failure
echo Echec de l'arret. Verifier Docker Desktop.
popd
pause
exit /b 1
