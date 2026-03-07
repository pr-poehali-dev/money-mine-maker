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
  codeSnippet: string;
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
    codeSnippet: `import ccxt
import time

exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

SYMBOL = 'BTC/USDT'
ORDER_SIZE = 0.001

def get_order_book_imbalance():
    ob = exchange.fetch_order_book(SYMBOL, limit=20)
    bid_vol = sum(b[1] for b in ob['bids'])
    ask_vol = sum(a[1] for a in ob['asks'])
    return (bid_vol - ask_vol) / (bid_vol + ask_vol)

def run():
    while True:
        imbalance = get_order_book_imbalance()
        ticker = exchange.fetch_ticker(SYMBOL)
        price = ticker['last']

        if imbalance > 0.15:
            exchange.create_market_buy_order(SYMBOL, ORDER_SIZE)
            print(f"BUY  {SYMBOL} @ {price:.2f}  imbalance={imbalance:.2f}")
        elif imbalance < -0.15:
            exchange.create_market_sell_order(SYMBOL, ORDER_SIZE)
            print(f"SELL {SYMBOL} @ {price:.2f}  imbalance={imbalance:.2f}")

        time.sleep(1)

if __name__ == '__main__':
    run()`,
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
    codeSnippet: `import ccxt
import numpy as np

exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

SYMBOL = 'ETH/USDT'
GRID_LEVELS = 10
GRID_STEP_PCT = 0.5
ORDER_SIZE = 0.01

def build_grid(mid_price):
    levels = []
    for i in range(-GRID_LEVELS // 2, GRID_LEVELS // 2 + 1):
        price = mid_price * (1 + i * GRID_STEP_PCT / 100)
        levels.append(round(price, 2))
    return levels

def place_grid_orders(levels):
    ticker = exchange.fetch_ticker(SYMBOL)
    current = ticker['last']
    for price in levels:
        side = 'buy' if price < current else 'sell'
        exchange.create_limit_order(SYMBOL, side, ORDER_SIZE, price)
        print(f"Placed {side.upper()} limit @ {price}")

def run():
    ticker = exchange.fetch_ticker(SYMBOL)
    mid = ticker['last']
    print(f"Building grid around {mid}")
    grid = build_grid(mid)
    place_grid_orders(grid)

if __name__ == '__main__':
    run()`,
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
    codeSnippet: `import ccxt
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

SYMBOL = 'BTC/USDT'
model = GradientBoostingClassifier(n_estimators=200)

def fetch_features():
    ohlcv = exchange.fetch_ohlcv(SYMBOL, '1h', limit=100)
    closes = np.array([c[4] for c in ohlcv])
    returns = np.diff(closes) / closes[:-1]
    sma20 = np.mean(closes[-20:])
    sma50 = np.mean(closes[-50:])
    vol = np.std(returns[-20:])
    return np.array([returns[-1], sma20/sma50 - 1, vol])

def predict_direction(features):
    prob = model.predict_proba([features])[0]
    return 'buy' if prob[1] > 0.6 else 'sell' if prob[0] > 0.6 else 'hold'

def run():
    features = fetch_features()
    signal = predict_direction(features)
    print(f"AI Signal: {signal.upper()}")
    if signal == 'buy':
        exchange.create_market_buy_order(SYMBOL, 0.001)
    elif signal == 'sell':
        exchange.create_market_sell_order(SYMBOL, 0.001)

if __name__ == '__main__':
    run()`,
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
    codeSnippet: `import ccxt

SYMBOL = 'ETH/USDT'
ORDER_SIZE = 0.05
MIN_PROFIT_PCT = 0.3

exchanges = {
    'binance': ccxt.binance({'apiKey': 'KEY', 'secret': 'SECRET'}),
    'bybit':   ccxt.bybit({'apiKey': 'KEY', 'secret': 'SECRET'}),
    'okx':     ccxt.okx({'apiKey': 'KEY', 'secret': 'SECRET'}),
}

def get_prices():
    prices = {}
    for name, ex in exchanges.items():
        ticker = ex.fetch_ticker(SYMBOL)
        prices[name] = {'bid': ticker['bid'], 'ask': ticker['ask']}
    return prices

def find_opportunity(prices):
    best_buy  = min(prices, key=lambda x: prices[x]['ask'])
    best_sell = max(prices, key=lambda x: prices[x]['bid'])
    buy_price  = prices[best_buy]['ask']
    sell_price = prices[best_sell]['bid']
    profit_pct = (sell_price - buy_price) / buy_price * 100
    return best_buy, best_sell, profit_pct

def run():
    prices = get_prices()
    buy_ex, sell_ex, profit = find_opportunity(prices)
    print(f"Spread: {profit:.3f}%  buy@{buy_ex} sell@{sell_ex}")
    if profit > MIN_PROFIT_PCT:
        exchanges[buy_ex].create_market_buy_order(SYMBOL, ORDER_SIZE)
        exchanges[sell_ex].create_market_sell_order(SYMBOL, ORDER_SIZE)
        print(f"ARB executed! Expected profit: {profit:.2f}%")

if __name__ == '__main__':
    run()`,
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
    codeSnippet: `import ccxt
import numpy as np

exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

SYMBOL = 'BTC/USDT'

def rsi(closes, period=14):
    deltas = np.diff(closes)
    gains = np.where(deltas > 0, deltas, 0)
    losses = np.where(deltas < 0, -deltas, 0)
    avg_gain = np.mean(gains[-period:])
    avg_loss = np.mean(losses[-period:])
    rs = avg_gain / (avg_loss + 1e-9)
    return 100 - 100 / (1 + rs)

def fib_levels(high, low):
    diff = high - low
    return {
        '0.236': low + diff * 0.236,
        '0.382': low + diff * 0.382,
        '0.618': low + diff * 0.618,
    }

def run():
    ohlcv = exchange.fetch_ohlcv(SYMBOL, '4h', limit=100)
    closes = np.array([c[4] for c in ohlcv])
    highs  = np.array([c[2] for c in ohlcv])
    lows   = np.array([c[3] for c in ohlcv])

    current_rsi = rsi(closes)
    fibs = fib_levels(highs[-20:].max(), lows[-20:].min())
    price = closes[-1]

    print(f"RSI: {current_rsi:.1f}  Price: {price:.2f}")
    print(f"Fib levels: {fibs}")

    if current_rsi < 35 and price <= fibs['0.382']:
        exchange.create_market_buy_order(SYMBOL, 0.001)
        print("SWING BUY signal triggered")
    elif current_rsi > 65 and price >= fibs['0.618']:
        exchange.create_market_sell_order(SYMBOL, 0.001)
        print("SWING SELL signal triggered")

if __name__ == '__main__':
    run()`,
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
    codeSnippet: `import ccxt
import time
from datetime import datetime, timezone

exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

SYMBOL = 'BTC/USDT'
ASIAN_SESSION_START = 1   # UTC hour
ASIAN_SESSION_END   = 9   # UTC hour
ORDER_SIZE = 0.001
SPREAD_THRESHOLD = 0.05   # %

def is_asian_session():
    hour = datetime.now(timezone.utc).hour
    return ASIAN_SESSION_START <= hour < ASIAN_SESSION_END

def get_spread_pct():
    ob = exchange.fetch_order_book(SYMBOL, limit=5)
    best_bid = ob['bids'][0][0]
    best_ask = ob['asks'][0][0]
    return (best_ask - best_bid) / best_bid * 100

def run():
    while True:
        if not is_asian_session():
            print("Outside Asian session, sleeping...")
            time.sleep(60)
            continue

        spread = get_spread_pct()
        print(f"Spread: {spread:.3f}%")

        if spread < SPREAD_THRESHOLD:
            ob = exchange.fetch_order_book(SYMBOL, limit=1)
            mid = (ob['bids'][0][0] + ob['asks'][0][0]) / 2
            exchange.create_limit_buy_order(SYMBOL, ORDER_SIZE, ob['bids'][0][0])
            exchange.create_limit_sell_order(SYMBOL, ORDER_SIZE, ob['asks'][0][0])
            print(f"Placed scalp orders around {mid:.2f}")

        time.sleep(5)

if __name__ == '__main__':
    run()`,
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
    codeSnippet: `from web3 import Web3
import json, time

RPC_URL = 'https://bsc-dataseed.binance.org/'
w3 = Web3(Web3.HTTPProvider(RPC_URL))

WALLET   = '0xYOUR_WALLET'
PRIV_KEY = 'YOUR_PRIVATE_KEY'

POOLS = [
    {'name': 'Pancake USDT-BNB', 'address': '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae', 'apy': 0},
    {'name': 'Pancake BUSD-BNB', 'address': '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16', 'apy': 0},
]

def fetch_apy(pool_address):
    # Simplified APY fetch via contract call
    return round(15 + hash(pool_address) % 40, 2)

def best_pool():
    for pool in POOLS:
        pool['apy'] = fetch_apy(pool['address'])
        print(f"{pool['name']}: {pool['apy']}% APY")
    return max(POOLS, key=lambda p: p['apy'])

def rebalance(pool):
    print(f"Moving liquidity to {pool['name']} @ {pool['apy']}% APY")
    # Here: withdraw from current pool, deposit to best pool
    # Actual tx signing via w3.eth.account.sign_transaction(...)

def run():
    while True:
        top = best_pool()
        rebalance(top)
        time.sleep(3600)  # rebalance every hour

if __name__ == '__main__':
    run()`,
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
    codeSnippet: `import ccxt

exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

SYMBOL     = 'BTC/USDT'
DEPOSIT    = 100      # USDT
GRID_COUNT = 5
STEP_PCT   = 1.0

def auto_grid(deposit, symbol, levels, step_pct):
    ticker = exchange.fetch_ticker(symbol)
    price  = ticker['last']
    size   = round(deposit / levels / price, 5)

    print(f"Price: {price}  Order size: {size} BTC")
    print(f"Placing {levels} grid orders with {step_pct}% step\n")

    for i in range(1, levels + 1):
        buy_price  = round(price * (1 - i * step_pct / 100), 2)
        sell_price = round(price * (1 + i * step_pct / 100), 2)
        exchange.create_limit_buy_order(symbol, size, buy_price)
        exchange.create_limit_sell_order(symbol, size, sell_price)
        print(f"Level {i}: BUY @ {buy_price}  |  SELL @ {sell_price}")

if __name__ == '__main__':
    auto_grid(DEPOSIT, SYMBOL, GRID_COUNT, STEP_PCT)`,
  },
  {
    id: 9,
    name: 'PocketPulse Pro',
    description: 'Автоматический бот для торговли бинарными опционами на Pocket Option. Анализирует волатильность и входит в сделки по сигналам RSI + Bollinger Bands. Сделки длительностью 1–5 минут.',
    type: 'scalping',
    risk: 'high',
    roi: 184.6,
    winRate: 72.3,
    trades: 9814,
    price: 59,
    rating: 4.6,
    reviews: 143,
    author: 'PocketTeam',
    tags: ['Pocket Option', 'бинарные опционы', 'RSI', 'Bollinger'],
    exchanges: ['Pocket Option'],
    isNew: true,
    isPopular: true,
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
    emoji: '💜',
    codeSnippet: `import numpy as np
import time
import requests

API_URL  = 'https://api.pocketoption.com/v1'
API_KEY  = 'YOUR_API_KEY'
ASSET    = 'EURUSD'
DURATION = 60   # seconds
AMOUNT   = 10   # USD

def fetch_candles(asset, count=50):
    r = requests.get(f"{API_URL}/candles",
        params={'asset': asset, 'count': count},
        headers={'Authorization': f'Bearer {API_KEY}'})
    return [c['close'] for c in r.json()['candles']]

def bollinger(closes, period=20, k=2):
    sma = np.mean(closes[-period:])
    std = np.std(closes[-period:])
    return sma - k * std, sma, sma + k * std

def rsi(closes, period=14):
    d = np.diff(closes)
    gains  = np.where(d > 0, d, 0)
    losses = np.where(d < 0, -d, 0)
    rs = np.mean(gains[-period:]) / (np.mean(losses[-period:]) + 1e-9)
    return 100 - 100 / (1 + rs)

def place_trade(direction):
    requests.post(f"{API_URL}/trade",
        json={'asset': ASSET, 'amount': AMOUNT,
              'direction': direction, 'duration': DURATION},
        headers={'Authorization': f'Bearer {API_KEY}'})
    print(f"Trade placed: {direction.upper()}  ${AMOUNT}  {DURATION}s")

def run():
    while True:
        closes = fetch_candles(ASSET)
        lower, mid, upper = bollinger(closes)
        r = rsi(closes)
        price = closes[-1]
        print(f"Price: {price:.5f}  RSI: {r:.1f}  BB: [{lower:.5f} - {upper:.5f}]")

        if price <= lower and r < 30:
            place_trade('call')
        elif price >= upper and r > 70:
            place_trade('put')

        time.sleep(30)

if __name__ == '__main__':
    run()`,
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
