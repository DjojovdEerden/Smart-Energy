 // ws-server/server.js
 const WebSocket = require('ws');
 const fs = require('fs');
 const path = require('path');

 const wss = new WebSocket.Server({ port: 8080 });

 function getLatestData() {
   const csvPath = path.join(__dirname, '../public/data/energy.csv');
   const data = fs.readFileSync(csvPath, 'utf8');
   const lines = data.trim().split('\n');
   const headers = lines[0].split(';');
   const last = lines[lines.length - 1].split(';');
   const obj = {};
   headers.forEach((h, i) => obj[h] = last[i]);
   return obj;
 }

 wss.on('connection', ws => {
   // Send initial data
   ws.send(JSON.stringify({ type: 'init', data: getLatestData() }));

   // Send new data every 10 seconds (simulate real-time)
   const interval = setInterval(() => {
     ws.send(JSON.stringify({ type: 'update', data: getLatestData() }));
   }, 10000);

   ws.on('close', () => clearInterval(interval));
 });

 console.log('WebSocket server running on ws://localhost:8080');