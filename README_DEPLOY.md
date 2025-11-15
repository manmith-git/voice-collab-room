FINAL WORKING PROJECT - Render-ready

Structure:
  server/
    server.js        <- Express + socket.io + y-websocket
    package.json
    public/          <- web client (index.html + assets)
  extension/         <- VS Code extension (webview) - default SERVER URL set to https://yourapp.onrender.com

How to deploy on Render:
  1. In the Render dashboard, create a new Web Service pointing at this repository.
  2. Set the root to /server (if Render asks).
  3. Build command: npm install
  4. Start command: npm start
  5. After deploy, open https://yourapp.onrender.com (replace with actual Render URL)

Notes:
  - The web client uses window.location.origin, so when served from Render it will connect correctly.
  - Y-WebSocket is served at wss(s)://<yourapp>/yjs
  - Socket.io signaling is available at the same origin.
  - If you want the VS Code extension to connect to your deployed server, open the extension's webview JS and replace the server URL with your Render URL.

Quick local test:
  cd server
  npm install
  npm start
  open http://localhost:3000

