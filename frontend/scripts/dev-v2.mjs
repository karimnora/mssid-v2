import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const child = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/tsx/dist/cli.mjs', import.meta.url)), 'server.ts'], {
  cwd: fileURLToPath(new URL('../', import.meta.url)), stdio: 'inherit', env: { ...process.env, PORT: '3002' },
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
