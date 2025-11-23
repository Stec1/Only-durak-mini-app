import { create } from 'zustand';
import type { RoomSummary, Room, GameState } from '@/src/game/types';
import { connect, getSocket, emit, on } from '@/src/lib/socket';

interface GameStore {
  rooms: RoomSummary[];
  myRoom?: Room;
  phase?: GameState['phase'];
  legal?: any;
  actions: {
    connect: ()=>void;
    listRooms: ()=>void;
    createRoom: (p:any)=>void;
    joinRoom: (roomId:string, pin?:string)=>void;
    leaveRoom: ()=>void;
    ready: (ready:boolean)=>void;
    start: ()=>void;
  }
}

export const useGameStore = create<GameStore>((set, get)=>({
  rooms: [],
  actions: {
    connect() {
      connect();
      const s = getSocket();
      if (!s) {
        console.info('[GameStore] Demo mode: Socket not available (web platform)');
        set({rooms: []});
        return;
      }
      
      on('room:list', (rooms)=>set({rooms}));
      on('room:joined', (room)=>set({myRoom: room, phase: room.state?.phase}));
      on('room:updated', (partial)=>set((st)=>({myRoom: {...(st.myRoom||{} as any), ...partial}})));
      on('game:state', (delta)=>set((st)=>({myRoom: st.myRoom ? ({...st.myRoom, state: {...st.myRoom.state, ...delta}}) : st.myRoom, phase: delta.phase || st.phase })));
      on('game:legalMoves', (legal)=>set({legal}));
      on('room:error', (e)=>console.warn('ROOM ERROR', e));
    },
    listRooms(){ 
      if (!getSocket()) {
        console.info('[GameStore] Demo mode: No rooms available on web');
        return;
      }
      emit('room:list'); 
    },
    createRoom(p){ 
      if (!getSocket()) {
        console.info('[GameStore] Demo mode: Cannot create room on web');
        return;
      }
      emit('room:create', p); 
    },
    joinRoom(roomId, pin){ 
      if (!getSocket()) {
        console.info('[GameStore] Demo mode: Cannot join room on web');
        return;
      }
      emit('room:join', {roomId, pin}); 
    },
    leaveRoom(){ 
      const r=get().myRoom; 
      if(!r) return;
      if (!getSocket()) {
        set({myRoom: undefined});
        return;
      }
      emit('room:leave',{roomId:r.id}); 
      set({myRoom: undefined}); 
    },
    ready(ready){ 
      const r=get().myRoom; 
      if(!r) return;
      if (!getSocket()) {
        console.info('[GameStore] Demo mode: Cannot set ready on web');
        return;
      }
      emit('room:ready',{roomId:r.id, ready}); 
    },
    start(){ 
      const r=get().myRoom; 
      if(!r) return;
      if (!getSocket()) {
        console.info('[GameStore] Demo mode: Cannot start game on web');
        return;
      }
      emit('game:start',{roomId:r.id}); 
    },
  }
}));
