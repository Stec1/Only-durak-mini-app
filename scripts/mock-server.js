const { Server } = require('socket.io');

const PORT = 3001;

const rooms = new Map();
const players = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function generateDeck(size = 36) {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = size === 36 
    ? ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ id: generateId(), suit, rank });
    }
  }
  return deck;
}

function dealCards(room) {
  const deck = generateDeck(room.settings.deckSize);
  const cardsPerPlayer = 6;
  
  for (let i = 0; i < deck.length; i++) {
    deck[i] = deck[Math.floor(Math.random() * deck.length)];
  }
  
  room.players.forEach((player, idx) => {
    player.hand = deck.slice(idx * cardsPerPlayer, (idx + 1) * cardsPerPlayer);
  });
  
  const trumpCard = deck[deck.length - 1];
  room.state = {
    phase: 'attack',
    deckCount: deck.length - room.players.length * cardsPerPlayer,
    trump: trumpCard.suit,
    trumpCard,
    attackerSeat: 0,
    defenderSeat: 1,
    table: { pairs: [] },
    discardCount: 0,
    lastActionAt: Date.now()
  };
}

const io = new Server(PORT, {
  cors: { origin: '*' },
  transports: ['websocket']
});

console.log(`🎮 Mock OnlyDurak server running on port ${PORT}`);

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  players.set(socket.id, {
    id: socket.id,
    name: `Player${socket.id.substring(0, 4)}`,
    avatar: undefined,
    seat: -1,
    hand: [],
    status: 'idle',
    isBot: false
  });

  socket.on('room:list', () => {
    const roomList = Array.from(rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      players: r.players.length,
      maxPlayers: r.settings.maxPlayers,
      settings: r.settings,
      isPrivate: r.isPrivate
    }));
    socket.emit('room:list', roomList);
    console.log(`📋 Sent room list (${roomList.length} rooms)`);
  });

  socket.on('room:create', (params) => {
    const roomId = generateId();
    const player = players.get(socket.id);
    if (!player) return;

    player.seat = 0;
    player.status = 'idle';

    const room = {
      id: roomId,
      name: params.name || 'OnlyDurak Room',
      ownerId: socket.id,
      isPrivate: params.isPrivate || false,
      pin: params.pin,
      settings: params.settings || {
        deckSize: 36,
        maxPlayers: 4,
        throwInOnlyOnRanksOnTable: true,
        transferable: false,
        maxAttacksPerRound: 6,
        turnTimers: { attack: 30, defend: 40, between: 6 }
      },
      players: [player],
      state: {
        phase: 'lobby',
        deckCount: 0,
        trump: '♠',
        attackerSeat: 0,
        defenderSeat: 1,
        table: { pairs: [] },
        discardCount: 0,
        lastActionAt: Date.now()
      }
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit('room:joined', room);
    
    io.emit('room:list', Array.from(rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      players: r.players.length,
      maxPlayers: r.settings.maxPlayers,
      settings: r.settings,
      isPrivate: r.isPrivate
    })));

    console.log(`🎲 Room created: ${roomId} by ${socket.id}`);
  });

  socket.on('room:join', ({ roomId, pin }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('room:error', { code: 'NOT_FOUND', message: 'Room not found' });
      return;
    }

    if (room.isPrivate && room.pin !== pin) {
      socket.emit('room:error', { code: 'INVALID_PIN', message: 'Invalid PIN' });
      return;
    }

    if (room.players.length >= room.settings.maxPlayers) {
      socket.emit('room:error', { code: 'ROOM_FULL', message: 'Room is full' });
      return;
    }

    const player = players.get(socket.id);
    if (!player) return;

    player.seat = room.players.length;
    player.status = 'idle';
    room.players.push(player);

    socket.join(roomId);
    socket.emit('room:joined', room);
    io.to(roomId).emit('room:updated', { players: room.players });

    io.emit('room:list', Array.from(rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      players: r.players.length,
      maxPlayers: r.settings.maxPlayers,
      settings: r.settings,
      isPrivate: r.isPrivate
    })));

    console.log(`👤 Player ${socket.id} joined room ${roomId}`);
  });

  socket.on('room:ready', ({ roomId, ready }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    player.status = ready ? 'ready' : 'idle';
    io.to(roomId).emit('room:updated', { players: room.players });

    console.log(`✋ Player ${socket.id} is ${ready ? 'ready' : 'not ready'} in room ${roomId}`);
  });

  socket.on('game:start', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.ownerId !== socket.id) return;

    const allReady = room.players.length > 1 && room.players.every(p => p.status === 'ready');
    if (!allReady) {
      socket.emit('room:error', { code: 'NOT_READY', message: 'Not all players are ready' });
      return;
    }

    room.players.forEach(p => { p.status = 'playing'; });
    dealCards(room);

    io.to(roomId).emit('room:updated', { players: room.players, state: room.state });
    io.to(roomId).emit('game:state', room.state);

    console.log(`🎮 Game started in room ${roomId}`);
  });

  socket.on('room:leave', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== socket.id);
    
    if (room.players.length === 0) {
      rooms.delete(roomId);
      console.log(`🗑️ Room ${roomId} deleted (empty)`);
    } else {
      if (room.ownerId === socket.id) {
        room.ownerId = room.players[0].id;
      }
      io.to(roomId).emit('room:updated', { players: room.players, ownerId: room.ownerId });
    }

    socket.leave(roomId);
    
    io.emit('room:list', Array.from(rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      players: r.players.length,
      maxPlayers: r.settings.maxPlayers,
      settings: r.settings,
      isPrivate: r.isPrivate
    })));

    console.log(`👋 Player ${socket.id} left room ${roomId}`);
  });

  socket.on('game:attack', (data) => {
    console.log('🎯 Attack:', data);
  });

  socket.on('game:defend', (data) => {
    console.log('🛡️ Defend:', data);
  });

  socket.on('game:throwin', (data) => {
    console.log('➕ Throw-in:', data);
  });

  socket.on('game:take', (data) => {
    console.log('📥 Take:', data);
  });

  socket.on('game:done', (data) => {
    console.log('✅ Done:', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    
    rooms.forEach((room, roomId) => {
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          if (room.ownerId === socket.id) {
            room.ownerId = room.players[0].id;
          }
          io.to(roomId).emit('room:updated', { players: room.players, ownerId: room.ownerId });
        }
      }
    });

    players.delete(socket.id);
    
    io.emit('room:list', Array.from(rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      players: r.players.length,
      maxPlayers: r.settings.maxPlayers,
      settings: r.settings,
      isPrivate: r.isPrivate
    })));
  });
});
