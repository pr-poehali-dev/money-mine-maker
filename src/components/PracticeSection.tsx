import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

const PAIRS = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ARB/USDT'];
const INITIAL_BALANCE = 10000;

interface Trade {
  id: number;
  pair: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  pnl?: number;
  time: string;
  status: 'open' | 'closed';
}

interface PriceData {
  price: number;
  change: number;
  high: number;
  low: number;
}

const MOCK_PRICES: Record<string, PriceData> = {
  'BTC/USDT': { price: 67420, change: 2.34, high: 68100, low: 66800 },
  'ETH/USDT': { price: 3512, change: -1.12, high: 3580, low: 3480 },
  'BNB/USDT': { price: 412, change: 0.87, high: 418, low: 408 },
  'SOL/USDT': { price: 178, change: 4.21, high: 182, low: 171 },
  'ARB/USDT': { price: 1.24, change: -2.55, high: 1.29, low: 1.21 },
};

function MiniChart({ positive }: { positive: boolean }) {
  const points = Array.from({ length: 20 }, (_, i) => {
    const base = 50;
    const trend = positive ? i * 1.5 : -i * 1.5;
    const noise = (Math.random() - 0.5) * 15;
    return Math.max(5, Math.min(95, base + trend + noise));
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / 19) * 100} ${p}`).join(' ');
  const fillD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={`grad-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? '#00f5a0' : '#f05edc'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? '#00f5a0' : '#f05edc'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#grad-${positive})`} />
      <path d={pathD} fill="none" stroke={positive ? '#00f5a0' : '#f05edc'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function PracticeSection() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [prices, setPrices] = useState(MOCK_PRICES);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [notification, setNotification] = useState<string | null>(null);

  // simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(pair => {
          const delta = (Math.random() - 0.49) * next[pair].price * 0.003;
          const newPrice = +(next[pair].price + delta).toFixed(pair.includes('ARB') ? 4 : 0);
          next[pair] = {
            ...next[pair],
            price: newPrice,
            change: +((next[pair].change + (Math.random() - 0.5) * 0.1)).toFixed(2),
          };
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOrder = useCallback(() => {
    const qty = parseFloat(amount);
    if (!qty || qty <= 0) { showNotif('Введите корректное количество'); return; }

    const price = prices[selectedPair].price;
    const total = price * qty;

    if (orderType === 'buy') {
      if (total > balance) { showNotif('Недостаточно средств'); return; }
      setBalance(b => +(b - total).toFixed(2));
      setPortfolio(p => ({ ...p, [selectedPair]: (p[selectedPair] || 0) + qty }));
      setTrades(t => [{
        id: Date.now(), pair: selectedPair, type: 'buy',
        price, amount: qty, time: new Date().toLocaleTimeString('ru'), status: 'open'
      }, ...t.slice(0, 19)]);
      showNotif(`✅ Куплено ${qty} ${selectedPair.split('/')[0]} по $${price.toLocaleString('ru')}`);
    } else {
      const held = portfolio[selectedPair] || 0;
      if (qty > held) { showNotif(`Нет ${qty} ${selectedPair.split('/')[0]} в портфеле`); return; }
      const buyTrade = trades.find(t => t.pair === selectedPair && t.type === 'buy' && t.status === 'open');
      const pnl = buyTrade ? +((price - buyTrade.price) * qty).toFixed(2) : 0;
      setBalance(b => +(b + total).toFixed(2));
      setPortfolio(p => ({ ...p, [selectedPair]: p[selectedPair] - qty }));
      setTrades(t => [{
        id: Date.now(), pair: selectedPair, type: 'sell',
        price, amount: qty, pnl, time: new Date().toLocaleTimeString('ru'), status: 'closed'
      }, ...t.slice(0, 19)]);
      showNotif(`${pnl >= 0 ? '🚀' : '📉'} Продано. P&L: ${pnl >= 0 ? '+' : ''}$${pnl}`);
    }
    setAmount('');
  }, [amount, balance, orderType, portfolio, prices, selectedPair, trades]);

  const totalPnl = balance - INITIAL_BALANCE + Object.entries(portfolio).reduce((sum, [pair, qty]) => {
    return sum + (prices[pair]?.price || 0) * qty;
  }, 0);

  const currentPrice = prices[selectedPair];

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 tag bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 mb-3 text-sm px-3 py-1">
              <Icon name="FlaskConical" size={13} />
              Paper Trading
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-white">Торговый симулятор</h2>
            <p className="text-white/40 text-sm mt-1">Тренируйся без риска на виртуальные $10 000</p>
          </div>
          <button
            onClick={() => { setBalance(INITIAL_BALANCE); setTrades([]); setPortfolio({}); showNotif('Баланс сброшен'); }}
            className="glass-card text-white/50 hover:text-white text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Icon name="RotateCcw" size={13} />
            Сбросить
          </button>
        </div>

        {/* balance strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Баланс USDT', value: `$${balance.toLocaleString('ru', { maximumFractionDigits: 2 })}`, icon: '💵', color: '#00d9f5' },
            { label: 'Общий P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, icon: totalPnl >= 0 ? '📈' : '📉', color: totalPnl >= 0 ? '#00f5a0' : '#f05edc' },
            { label: 'Сделок', value: trades.length.toString(), icon: '⚡', color: '#a855f7' },
            { label: 'В портфеле', value: Object.values(portfolio).filter(v => v > 0).length + ' пар', icon: '🗂️', color: '#ff9d5c' },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-2xl p-4">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-lg font-display font-bold text-white" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* left: pairs */}
          <div className="space-y-2">
            <div className="text-xs text-white/40 font-medium mb-3 uppercase tracking-wider">Торговые пары</div>
            {PAIRS.map(pair => {
              const p = prices[pair];
              const pos = p.change >= 0;
              return (
                <button
                  key={pair}
                  onClick={() => setSelectedPair(pair)}
                  className={`w-full glass-card rounded-xl p-3 flex items-center gap-3 transition-all ${selectedPair === pair ? 'neon-border-green border' : 'border border-transparent hover:border-white/10'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base">
                    {pair.split('/')[0] === 'BTC' ? '₿' : pair.split('/')[0] === 'ETH' ? 'Ξ' : pair.split('/')[0][0]}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-bold text-white font-display">{pair}</div>
                    <div className="text-xs text-white/40">${p.price.toLocaleString('ru')}</div>
                  </div>
                  <div className="w-16 h-8">
                    <MiniChart positive={pos} />
                  </div>
                  <div className={`text-xs font-bold ${pos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pos ? '+' : ''}{p.change}%
                  </div>
                </button>
              );
            })}
          </div>

          {/* center: order panel */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xl font-display font-black text-white">{selectedPair}</div>
                <div className="text-2xl font-display font-black gradient-text">${currentPrice.price.toLocaleString('ru')}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${currentPrice.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentPrice.change >= 0 ? '+' : ''}{currentPrice.change}%
                </div>
                <div className="text-xs text-white/30">H: ${currentPrice.high.toLocaleString()} / L: ${currentPrice.low.toLocaleString()}</div>
              </div>
            </div>

            {/* buy/sell toggle */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-4">
              <button
                onClick={() => setOrderType('buy')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${orderType === 'buy' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white'}`}
              >
                Купить
              </button>
              <button
                onClick={() => setOrderType('sell')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${orderType === 'sell' ? 'bg-rose-500 text-white' : 'text-white/40 hover:text-white'}`}
              >
                Продать
              </button>
            </div>

            {/* amount */}
            <div className="mb-3">
              <label className="text-xs text-white/40 mb-1.5 block">Количество ({selectedPair.split('/')[0]})</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f5a0]/30 placeholder:text-white/20"
                />
                <div className="flex gap-1 absolute right-2 top-1/2 -translate-y-1/2">
                  {['25%', '50%', 'MAX'].map(pct => (
                    <button
                      key={pct}
                      onClick={() => {
                        const pctVal = pct === 'MAX' ? 1 : parseInt(pct) / 100;
                        if (orderType === 'buy') {
                          setAmount(((balance * pctVal) / currentPrice.price).toFixed(4));
                        } else {
                          setAmount(((portfolio[selectedPair] || 0) * pctVal).toFixed(4));
                        }
                      }}
                      className="text-[10px] text-white/40 hover:text-[#00f5a0] transition-colors"
                    >
                      {pct}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* total */}
            <div className="bg-white/5 rounded-xl px-4 py-3 mb-4 flex justify-between">
              <span className="text-xs text-white/40">Итого USDT</span>
              <span className="text-sm font-bold text-white">
                ${amount ? (parseFloat(amount) * currentPrice.price).toLocaleString('ru', { maximumFractionDigits: 2 }) : '0.00'}
              </span>
            </div>

            {portfolio[selectedPair] > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 mb-4 flex justify-between">
                <span className="text-xs text-emerald-400/70">В портфеле</span>
                <span className="text-xs font-bold text-emerald-400">{portfolio[selectedPair]} {selectedPair.split('/')[0]}</span>
              </div>
            )}

            <button
              onClick={handleOrder}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                orderType === 'buy'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white btn-glow'
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
              }`}
            >
              {orderType === 'buy' ? '🚀 Купить' : '📉 Продать'} {selectedPair.split('/')[0]}
            </button>
          </div>

          {/* right: history */}
          <div className="glass-card rounded-2xl p-5">
            <div className="text-xs text-white/40 font-medium mb-4 uppercase tracking-wider flex items-center justify-between">
              История сделок
              <span className="tag bg-white/5 text-white/40 border border-white/8">{trades.length}</span>
            </div>
            {trades.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-white/30 text-sm">Сделок пока нет</p>
                <p className="text-white/20 text-xs mt-1">Открой свою первую сделку</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-80 scrollbar-thin pr-1">
                {trades.map(trade => (
                  <div key={trade.id} className="bg-white/3 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`tag text-[10px] px-2 py-0.5 ${trade.type === 'buy' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border-rose-500/20'} border`}>
                          {trade.type === 'buy' ? 'Покупка' : 'Продажа'}
                        </span>
                        <span className="text-xs font-bold text-white">{trade.pair}</span>
                      </div>
                      <span className="text-[10px] text-white/30">{trade.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/50">{trade.amount} × ${trade.price.toLocaleString('ru')}</span>
                      {trade.pnl !== undefined && (
                        <span className={`text-xs font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* notification */}
        {notification && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card border border-white/10 px-5 py-3 rounded-2xl text-sm text-white font-medium z-50 animate-slide-up shadow-xl">
            {notification}
          </div>
        )}
      </div>
    </section>
  );
}
