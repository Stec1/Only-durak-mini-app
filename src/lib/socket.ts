import { Platform } from 'react-native';
import type { RoomSummary, Room, GameState } from '@/src/game/types';

type ServerToClient = {
  'room:list': (rooms: RoomSummary[]) => void;
  'room:joined': (room: Room) => void;
  'room:updated': (partial: Partial<Room>) => void;
  'game:state': (delta: Partial<GameState>) => void;
  'game:legalMoves': (data: any) => void;
  'room:error': (e: {code:string; message:string}) => void;
};

type ClientToServer = {
  'room:list': () => void;
  'room:create': (p: any) => void;
  'room:join': (p: {roomId:string; pin?:string}) => void;
  'room:leave': (p:{roomId:string}) => void;
  'room:ready': (p:{roomId:string; ready:boolean}) => void;
  'game:start': (p:{roomId:string}) => void;
  'game:attack': (p:any)=>void; 
  'game:defend':(p:any)=>void; 
  'game:throwin':(p:any)=>void;
  'game:take':(p:any)=>void; 
  'game:done':(p:any)=>void;
};

const IS_WEB = Platform.OS === 'web';

let socket: any = null;

export function connect(url?: string): void {
  if (IS_WEB) {
    return;
  }

  if (socket) return;
  
  const { io } = require('socket.io-client');
  const URL = url || process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001';
  console.log('[Socket] Connecting to:', URL);
  socket = io(URL, { transports: ['websocket'] });
}

export function disconnect(): void {
  if (IS_WEB || !socket) return;
  socket.disconnect();
  socket = null;
  console.log('[Socket] Disconnected');
}

export function getSocket(): any {
  return IS_WEB ? null : socket;
}

export function emit<K extends keyof ClientToServer>(
  event: K,
  ...args: Parameters<ClientToServer[K]>
): void {
  if (IS_WEB || !socket) {
    return;
  }
  socket.emit(event, ...args as any);
}

export function on<K extends keyof ServerToClient>(
  event: K,
  callback: ServerToClient[K]
): void {
  if (IS_WEB || !socket) {
    return;
  }
  socket.on(event, callback);
}

export function off<K extends keyof ServerToClient>(
  event: K,
  callback?: ServerToClient[K]
): void {
  if (IS_WEB || !socket) return;
  socket.off(event, callback as any);
}
