const net = require('net');
const child_process = require('child_process');
const port = 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;
child_process.exec('node scripts/start.js');
child_process.exec('electron src/app-client.js');
