export type Suit = '♠'|'♥'|'♦'|'♣';
export type Rank = '6'|'7'|'8'|'9'|'10'|'J'|'Q'|'K'|'A';

export interface Card { id: string; suit: Suit; rank: Rank; }

export interface Player {
  id: string; name: string; avatar?: string; seat: number;
  hand: Card[]; status: 'idle'|'ready'|'playing'|'disconnected'; isBot?: boolean;
}

export interface TablePair { attack: Card; defend?: Card }
export interface TablePile { pairs: TablePair[] }

export interface GameState {
  phase: 'lobby'|'dealing'|'attack'|'defend'|'throwin'|'collect'|'refill'|'round_end'|'game_end';
  deckCount: number; trump: Suit; trumpCard?: Card;
  attackerSeat: number; defenderSeat: number;
  table: TablePile; discardCount: number; lastActionAt: number;
}

export interface RoomSettings {
  deckSize: 36|52; maxPlayers: 2|3|4|5|6;
  throwInOnlyOnRanksOnTable: boolean; transferable: boolean;
  maxAttacksPerRound: number; turnTimers: { attack:number; defend:number; between:number; };
}

export interface RoomSummary { id: string; name: string; players: number; maxPlayers: number; settings: RoomSettings; isPrivate: boolean; }
export interface Room { id: string; name: string; ownerId: string; isPrivate:boolean; pin?:string; settings: RoomSettings; players: Player[]; state: GameState; }
