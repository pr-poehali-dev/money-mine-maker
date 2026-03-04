export type BotType = 'scalping' | 'swing' | 'arbitrage' | 'grid' | 'trend';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Bot {
  id: number;
  name: string;
  description: string;
  type: BotType;
  risk: RiskLevel;
  roi: number;
  winRate: number;
  trades: number;
  price: number;
  rating: number;
  reviews: number;
  author: string;
  tags: string[];
  exchanges: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isPro?: boolean;
  gradient: string;
  emoji: string;
}

export const bots: Bot[] = [
  {
    id: 1,
    name: 'AlphaScalper Pro',
    description: 'Высокочастотный скальпинг на основе анализа стакана ордеров и ленты сделок. Работает 24/7 на спотовом рынке.',
    type: 'scalping',
    risk: 'medium',
    roi: 127.4,
    winRate: 68.2,
    trades: 12847,
    price: 49,
    rating: 4.9,
    reviews: 234,
    author: 'CryptoLab',
    tags: ['BTC', 'ETH', 'spot', 'высокочастотный'],
    exchanges: ['Binance', 'Bybit'],
    isPopular: true,
    gradient: 'from-emerald-500/20 to-cyan-500/20',
    emoji: '⚡',
  },
  {
    id: 2,
    name: 'GridMaster Ultimate',
    description: 'Сетевая стратегия с адаптивным шагом. Идеально для флетовых рынков. Автоматически перестраивает сетку при выходе из диапазона.',
    type: 'grid',
    risk: 'low',
    roi: 43.8,
    winRate: 81.5,
    trades: 8923,
    price: 29,
    rating: 4.7,
    reviews: 189,
    author: 'GridWizard',
    tags: ['ETH', 'BNB', 'фьючерсы', 'сетка'],
    exchanges: ['Binance', 'OKX'],
    isNew: false,
    gradient: 'from-blue-500/20 to-purple-500/20',
    emoji: '🔲',
  },
  {
    id: 3,
    name: 'TrendRider AI',
    description: 'ИИ-модель на основе трансформеров предсказывает тренды с точностью 73%. Использует on-chain аналитику и sentiment анализ.',
    type: 'trend',
    risk: 'medium',
    roi: 89.6,
    winRate: 62.8,
    trades: 3241,
    price: 99,
    rating: 4.8,
    reviews: 156,
    author: 'AI_Traders',
    tags: ['AI', 'BTC', 'ETH', 'тренд', 'on-chain'],
    exchanges: ['Binance', 'Bybit', 'OKX'],
    isPro: true,
    isPopular: true,
    gradient: 'from-purple-500/20 to-pink-500/20',
    emoji: '🤖',
  },
  {
    id: 4,
    name: 'ArbitrageX',
    description: 'Межбиржевой арбитраж между 12 биржами. Минимальный риск, стабильный доход. Использует WebSocket для мгновенного исполнения.',
    type: 'arbitrage',
    risk: 'low',
    roi: 28.3,
    winRate: 94.1,
    trades: 45621,
    price: 149,
    rating: 4.6,
    reviews: 98,
    author: 'ArbPro Team',
    tags: ['арбитраж', 'мультибиржа', 'стабильный'],
    exchanges: ['Binance', 'Bybit', 'OKX', 'Huobi'],
    isPro: true,
    gradient: 'from-orange-500/20 to-yellow-500/20',
    emoji: '⚖️',
  },
  {
    id: 5,
    name: 'SwingSniper',
    description: 'Свинг-трейдинг на дневных и 4-часовых графиках. Использует уровни Фибоначчи, RSI и MACD для входа в позицию.',
    type: 'swing',
    risk: 'medium',
    roi: 67.2,
    winRate: 58.9,
    trades: 1872,
    price: 39,
    rating: 4.5,
    reviews: 127,
    author: 'SwingMaster',
    tags: ['свинг', 'Fibonacci', 'RSI', 'MACD'],
    exchanges: ['Binance', 'Bybit'],
    isNew: true,
    gradient: 'from-teal-500/20 to-green-500/20',
    emoji: '🎯',
  },
  {
    id: 6,
    name: 'NightScalper',
    description: 'Ночной скальпинг во время азиатской сессии. Использует низкую волатильность для безопасных сделок с высокой точностью.',
    type: 'scalping',
    risk: 'low',
    roi: 52.1,
    winRate: 74.3,
    trades: 7234,
    price: 35,
    rating: 4.4,
    reviews: 83,
    author: 'NightOwl',
    tags: ['ночной', 'азиатская сессия', 'низкий риск'],
    exchanges: ['Binance', 'Bybit', 'OKX'],
    gradient: 'from-indigo-500/20 to-blue-500/20',
    emoji: '🌙',
  },
  {
    id: 7,
    name: 'DeFi Yield Bot',
    description: 'Автоматическая оптимизация yield farming в DeFi протоколах. Перекладывает ликвидность в самые доходные пулы.',
    type: 'trend',
    risk: 'high',
    roi: 213.5,
    winRate: 71.2,
    trades: 892,
    price: 199,
    rating: 4.7,
    reviews: 61,
    author: 'DeFiLabs',
    tags: ['DeFi', 'yield', 'farming', 'высокий доход'],
    exchanges: ['Uniswap', 'PancakeSwap'],
    isPro: true,
    isNew: true,
    gradient: 'from-pink-500/20 to-rose-500/20',
    emoji: '🌾',
  },
  {
    id: 8,
    name: 'GridBot Lite',
    description: 'Простой сетевой бот для начинающих. Интуитивная настройка, автоматический расчёт параметров по размеру депозита.',
    type: 'grid',
    risk: 'low',
    roi: 31.7,
    winRate: 77.4,
    trades: 4521,
    price: 0,
    rating: 4.3,
    reviews: 312,
    author: 'EasyBot',
    tags: ['для новичков', 'бесплатный', 'сетка'],
    exchanges: ['Binance'],
    gradient: 'from-cyan-500/20 to-sky-500/20',
    emoji: '🟢',
  },
];

export const botTypes = [
  { value: 'all', label: 'Все типы' },
  { value: 'scalping', label: 'Скальпинг' },
  { value: 'swing', label: 'Свинг' },
  { value: 'arbitrage', label: 'Арбитраж' },
  { value: 'grid', label: 'Сетка' },
  { value: 'trend', label: 'Тренд' },
];

export const riskLevels = [
  { value: 'all', label: 'Любой риск' },
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export const sortOptions = [
  { value: 'popular', label: 'Популярные' },
  { value: 'roi', label: 'Доходность' },
  { value: 'rating', label: 'Рейтинг' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
];

export const riskLabels: Record<RiskLevel, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const typeLabels: Record<BotType, string> = {
  scalping: 'Скальпинг',
  swing: 'Свинг',
  arbitrage: 'Арбитраж',
  grid: 'Сетка',
  trend: 'Тренд',
};
