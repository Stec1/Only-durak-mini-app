export const mockEarnings = {
  total: 250,
  week: 140,
  month: 250,
  series: [
    { x: '01', y: 10 },
    { x: '02', y: 20 },
    { x: '03', y: 30 },
    { x: '04', y: 45 },
    { x: '05', y: 60 },
    { x: '06', y: 80 },
    { x: '07', y: 110 },
    { x: '08', y: 150 },
    { x: '09', y: 250 },
  ],
};

export const mockSummary = {
  total: 12,
  wins: 8,
  losses: 4,
  winrate: 66.7,
  nftWon: 3,
  nftLost: 1,
  credits: 250,
};

export const mockRecent = [
  {
    id: 'm1',
    date: '2025-11-01',
    fan: '@neo',
    result: 'W' as const,
    nftChange: +1,
    credits: +40,
  },
  {
    id: 'm2',
    date: '2025-10-30',
    fan: '@mira',
    result: 'L' as const,
    nftChange: -1,
    credits: -10,
  },
  {
    id: 'm3',
    date: '2025-10-29',
    fan: '@alex',
    result: 'W' as const,
    nftChange: 0,
    credits: +25,
  },
  {
    id: 'm4',
    date: '2025-10-27',
    fan: '@ryu',
    result: 'W' as const,
    nftChange: +1,
    credits: +30,
  },
  {
    id: 'm5',
    date: '2025-10-26',
    fan: '@ivy',
    result: 'L' as const,
    nftChange: 0,
    credits: -5,
  },
];

export const mockJokers = [
  { id: 'bj', name: 'Black Joker', suit: 'spade' as const },
  { id: 'rj', name: 'Red Joker', suit: 'heart' as const },
];
