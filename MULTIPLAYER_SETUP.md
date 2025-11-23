# Multiplayer Setup Guide

## Overview

OnlyDurak uses WebSockets for real-time multiplayer. The game works in two modes:

- **Native (iOS/Android)**: Full multiplayer with WebSocket connection
- **Web**: Demo mode - UI works but multiplayer is disabled

## Running on Native Devices

### Step 1: Find Your Local IP Address

**macOS/Linux:**
```bash
ifconfig | grep inet
# Look for 192.168.x.x or 10.0.x.x
```

**Windows:**
```bash
ipconfig
# Look for IPv4 Address: 192.168.x.x
```

### Step 2: Update Environment Variable

Edit the `env` file and replace `XXX` with your IP:

```bash
# Before
EXPO_PUBLIC_WS_URL=ws://192.168.1.XXX:3001

# After (example)
EXPO_PUBLIC_WS_URL=ws://192.168.1.100:3001
```

### Step 3: Start Mock Server

In a **separate terminal**, run:

```bash
npm run mock-server
# or
bun scripts/mock-server.js
# or
node scripts/mock-server.js
```

You should see:
```
🎮 Mock OnlyDurak server running on port 3001
```

**Keep this terminal running** while testing!

### Step 4: Start Expo App

```bash
npm start
# or
bun start
```

Scan QR code with Expo Go app on your phone/tablet.

### Step 5: Test Multiplayer

1. **Create Room**: Go to Game tab → Create Room
2. **Join from another device**: Use same QR code on second device → Join Room
3. **Ready up**: Both players press "I'm Ready"
4. **Start**: Room owner sees "Start Game" button

## Web Preview

When running on web (localhost or Rork preview), multiplayer is **disabled by design**:

- No WebSocket connections
- UI remains functional for visual testing
- Console shows: `[GameStore] Demo mode: ...`

This prevents build errors and allows rapid UI iteration.

## Production Server

For production, replace the mock server with a real Node.js/Deno/Bun backend:

1. Deploy WebSocket server (Railway, Fly.io, etc.)
2. Update `EXPO_PUBLIC_WS_URL` to production URL
3. Implement full game logic in `src/game/` (currently mocked)

## Troubleshooting

**"Cannot connect to server"**
- Verify IP address is correct
- Check mock server is running
- Ensure devices are on same WiFi network
- Firewall may block port 3001

**"Demo mode" on native**
- Check `EXPO_PUBLIC_WS_URL` in env file
- Restart Expo after changing env variables
- Verify socket.io-client is installed

**Build errors**
- Never import Node.js modules (http, fs, net) in app code
- Keep server code in `scripts/` folder only
- `socket.io-client` is allowed, `socket.io` is server-only
