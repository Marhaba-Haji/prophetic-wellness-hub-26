
import { spawn } from 'child_process';

const server = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

process.on('SIGTERM', () => server.kill('SIGTERM'));
process.on('SIGINT', () => server.kill('SIGINT'));
