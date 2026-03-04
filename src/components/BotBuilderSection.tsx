import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useBots } from '@/context/BotsContext';
import { Bot, BotType, RiskLevel } from '@/data/bots';

type Step = 'basics' | 'strategy' | 'risk' | 'signals' | 'preview';

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'basics', label: 'Основы', icon: 'Settings' },
  { id: 'strategy', label: 'Стратегия', icon: 'TrendingUp' },
  { id: 'risk', label: 'Риски', icon: 'Shield' },
  { id: 'signals', label: 'Сигналы', icon: 'Zap' },
  { id: 'preview', label: 'Итог', icon: 'Rocket' },
];

const STRATEGIES = [
  { id: 'grid', name: 'Сетка', desc: 'Покупки и продажи в диапазоне цен', emoji: '🔲', risk: 'Низкий' },
  { id: 'scalp', name: 'Скальпинг', desc: 'Быстрые сделки на малых движениях', emoji: '⚡', risk: 'Средний' },
  { id: 'trend', name: 'Следование тренду', desc: 'Торговля в направлении тренда', emoji: '📈', risk: 'Средний' },
  { id: 'reversal', name: 'Разворот', desc: 'Ловит точки разворота рынка', emoji: '🔄', risk: 'Высокий' },
  { id: 'dca', name: 'DCA', desc: 'Усреднение по расписанию', emoji: '🗓️', risk: 'Низкий' },
  { id: 'breakout', name: 'Пробой уровней', desc: 'Торгует при пробое ключевых уровней', emoji: '💥', risk: 'Высокий' },
];

const INDICATORS = [
  { id: 'rsi', name: 'RSI', desc: 'Индекс относительной силы', color: '#00f5a0' },
  { id: 'macd', name: 'MACD', desc: 'Схождение/расхождение скользящих', color: '#00d9f5' },
  { id: 'bb', name: 'Bollinger Bands', desc: 'Полосы Боллинджера', color: '#a855f7' },
  { id: 'ema', name: 'EMA', desc: 'Экспоненциальная скользящая', color: '#ff9d5c' },
  { id: 'vol', name: 'Volume', desc: 'Объём торгов', color: '#f05edc' },
  { id: 'cci', name: 'CCI', desc: 'Индекс товарного канала', color: '#00f5a0' },
];

const PAIRS = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ARB/USDT', 'DOGE/USDT'];
const EXCHANGES = ['Binance', 'Bybit', 'OKX', 'Huobi', 'Gate.io'];
const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'];

interface BotConfig {
  name: string;
  pair: string;
  exchange: string;
  timeframe: string;
  strategy: string;
  deposit: number;
  stopLoss: number;
  takeProfit: number;
  maxTrades: number;
  indicators: string[];
  entryCondition: string;
  exitCondition: string;
}

const DEFAULT_CONFIG: BotConfig = {
  name: '',
  pair: 'BTC/USDT',
  exchange: 'Binance',
  timeframe: '1h',
  strategy: '',
  deposit: 1000,
  stopLoss: 2,
  takeProfit: 5,
  maxTrades: 3,
  indicators: [],
  entryCondition: 'rsi_oversold',
  exitCondition: 'tp_sl',
};

const ENTRY_CONDITIONS = [
  { id: 'rsi_oversold', label: 'RSI перепродан (< 30)' },
  { id: 'ema_cross', label: 'Пересечение EMA 9/21' },
  { id: 'bb_touch', label: 'Касание нижней полосы BB' },
  { id: 'volume_spike', label: 'Всплеск объёма > 200%' },
  { id: 'support_level', label: 'Отскок от уровня поддержки' },
];

const EXIT_CONDITIONS = [
  { id: 'tp_sl', label: 'Take Profit / Stop Loss' },
  { id: 'rsi_overbought', label: 'RSI перекуплен (> 70)' },
  { id: 'trailing_stop', label: 'Трейлинг стоп' },
  { id: 'time_exit', label: 'Выход по времени' },
];

function estimateRoi(config: BotConfig) {
  const base = config.strategy === 'grid' || config.strategy === 'dca' ? 35 : 75;
  const indBonus = config.indicators.length * 8;
  const tfBonus = config.timeframe === '1m' ? 20 : config.timeframe === '5m' ? 15 : 5;
  return Math.min(base + indBonus + tfBonus, 200);
}

function estimateRisk(config: BotConfig) {
  const s = STRATEGIES.find(s => s.id === config.strategy);
  if (!s) return 'Не определён';
  return s.risk;
}

const STRATEGY_TYPE_MAP: Record<string, BotType> = {
  grid: 'grid',
  scalp: 'scalping',
  trend: 'trend',
  reversal: 'swing',
  dca: 'swing',
  breakout: 'trend',
};

const STRATEGY_RISK_MAP: Record<string, RiskLevel> = {
  grid: 'low',
  scalp: 'medium',
  trend: 'medium',
  reversal: 'high',
  dca: 'low',
  breakout: 'high',
};

const GRADIENTS = [
  'from-emerald-500/20 to-cyan-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-blue-500/20 to-indigo-500/20',
  'from-orange-500/20 to-yellow-500/20',
  'from-teal-500/20 to-green-500/20',
];

export default function BotBuilderSection({ onGoToCatalog }: { onGoToCatalog?: () => void }) {
  const { addBot } = useBots();
  const [step, setStep] = useState<Step>('basics');
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const stepIndex = STEPS.findIndex(s => s.id === step);

  const toggleIndicator = (id: string) => {
    setConfig(c => ({
      ...c,
      indicators: c.indicators.includes(id)
        ? c.indicators.filter(i => i !== id)
        : [...c.indicators, id],
    }));
  };

  const canProceed = () => {
    if (step === 'basics') return config.name.length > 0 && config.pair && config.exchange;
    if (step === 'strategy') return config.strategy !== '';
    if (step === 'signals') return config.indicators.length > 0;
    return true;
  };

  const handleSave = () => {
    if (saved) return;
    const strategy = STRATEGIES.find(s => s.id === config.strategy);
    const newBot: Bot = {
      id: Date.now(),
      name: config.name,
      description: `Стратегия: ${strategy?.name}. Пара: ${config.pair}, таймфрейм ${config.timeframe}. Индикаторы: ${config.indicators.join(', ').toUpperCase()}. SL: -${config.stopLoss}%, TP: +${config.takeProfit}%.`,
      type: STRATEGY_TYPE_MAP[config.strategy] ?? 'trend',
      risk: STRATEGY_RISK_MAP[config.strategy] ?? 'medium',
      roi: estimateRoi(config),
      winRate: 55 + config.indicators.length * 3,
      trades: 0,
      price: 0,
      rating: 0,
      reviews: 0,
      author: 'Мой бот',
      tags: [config.pair.split('/')[0], config.timeframe, ...config.indicators],
      exchanges: [config.exchange],
      isNew: true,
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      emoji: strategy?.emoji ?? '🤖',
    };
    addBot(newBot);
    setSaved(true);
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 tag bg-purple-400/10 text-purple-400 border border-purple-400/20 mb-3 text-sm px-3 py-1">
            <Icon name="Wrench" size={13} />
            Bot Builder
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-white">Конструктор бота</h2>
          <p className="text-white/40 text-sm mt-1">Собери собственную торговую стратегию без кода</p>
        </div>

        {/* stepper */}
        <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-shrink-0">
              <button
                onClick={() => i <= stepIndex + 1 && setStep(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  s.id === step
                    ? 'bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-black font-bold'
                    : i < stepIndex
                    ? 'text-[#00f5a0] cursor-pointer hover:bg-white/5'
                    : 'text-white/30 cursor-default'
                }`}
              >
                {i < stepIndex ? (
                  <span className="w-5 h-5 rounded-full bg-[#00f5a0] text-black flex items-center justify-center text-xs font-bold">✓</span>
                ) : (
                  <Icon name={s.icon} size={15} fallback="Circle" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 rounded-full transition-colors ${i < stepIndex ? 'bg-[#00f5a0]/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* step content */}
        <div className="glass-card rounded-2xl p-6 mb-5">
          {/* BASICS */}
          {step === 'basics' && (
            <div className="space-y-5">
              <h3 className="text-lg font-display font-bold text-white mb-4">Основные настройки</h3>
              <div>
                <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">Название бота *</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={e => setConfig(c => ({ ...c, name: e.target.value }))}
                  placeholder="Мой первый бот"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00f5a0]/30 placeholder:text-white/20"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">Торговая пара</label>
                  <select
                    value={config.pair}
                    onChange={e => setConfig(c => ({ ...c, pair: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f5a0]/30"
                  >
                    {PAIRS.map(p => <option key={p} value={p} className="bg-[#0a0f1a]">{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">Биржа</label>
                  <select
                    value={config.exchange}
                    onChange={e => setConfig(c => ({ ...c, exchange: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f5a0]/30"
                  >
                    {EXCHANGES.map(ex => <option key={ex} value={ex} className="bg-[#0a0f1a]">{ex}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">Таймфрейм</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TIMEFRAMES.map(tf => (
                      <button
                        key={tf}
                        onClick={() => setConfig(c => ({ ...c, timeframe: tf }))}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${config.timeframe === tf ? 'bg-[#00f5a0] text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STRATEGY */}
          {step === 'strategy' && (
            <div>
              <h3 className="text-lg font-display font-bold text-white mb-4">Выбери стратегию</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {STRATEGIES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setConfig(c => ({ ...c, strategy: s.id }))}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      config.strategy === s.id
                        ? 'bg-[#00f5a0]/10 border-[#00f5a0]/40 neon-border-green'
                        : 'bg-white/3 border-white/8 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-3xl mb-2">{s.emoji}</div>
                    <div className="font-display font-bold text-white text-sm mb-1">{s.name}</div>
                    <div className="text-xs text-white/40 mb-3 leading-relaxed">{s.desc}</div>
                    <span className={`tag text-[10px] border ${
                      s.risk === 'Низкий' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
                      s.risk === 'Средний' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                      'text-rose-400 bg-rose-400/10 border-rose-400/20'
                    }`}>
                      {s.risk} риск
                    </span>
                    {config.strategy === s.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00f5a0] flex items-center justify-center text-black text-xs font-bold">✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RISK */}
          {step === 'risk' && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-bold text-white mb-4">Управление рисками</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">
                    Депозит (USDT): <span className="text-[#00f5a0] font-bold">${config.deposit}</span>
                  </label>
                  <input
                    type="range" min={100} max={50000} step={100}
                    value={config.deposit}
                    onChange={e => setConfig(c => ({ ...c, deposit: +e.target.value }))}
                    className="w-full accent-[#00f5a0]"
                  />
                  <div className="flex justify-between text-xs text-white/20 mt-1"><span>$100</span><span>$50 000</span></div>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">
                    Макс. одновременных сделок: <span className="text-[#00f5a0] font-bold">{config.maxTrades}</span>
                  </label>
                  <input
                    type="range" min={1} max={10}
                    value={config.maxTrades}
                    onChange={e => setConfig(c => ({ ...c, maxTrades: +e.target.value }))}
                    className="w-full accent-[#a855f7]"
                  />
                  <div className="flex justify-between text-xs text-white/20 mt-1"><span>1</span><span>10</span></div>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">
                    Stop Loss: <span className="text-rose-400 font-bold">-{config.stopLoss}%</span>
                  </label>
                  <input
                    type="range" min={0.5} max={20} step={0.5}
                    value={config.stopLoss}
                    onChange={e => setConfig(c => ({ ...c, stopLoss: +e.target.value }))}
                    className="w-full accent-[#f05edc]"
                  />
                  <div className="flex justify-between text-xs text-white/20 mt-1"><span>-0.5%</span><span>-20%</span></div>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-2 block uppercase tracking-wider">
                    Take Profit: <span className="text-emerald-400 font-bold">+{config.takeProfit}%</span>
                  </label>
                  <input
                    type="range" min={0.5} max={50} step={0.5}
                    value={config.takeProfit}
                    onChange={e => setConfig(c => ({ ...c, takeProfit: +e.target.value }))}
                    className="w-full accent-[#00f5a0]"
                  />
                  <div className="flex justify-between text-xs text-white/20 mt-1"><span>+0.5%</span><span>+50%</span></div>
                </div>
              </div>

              {/* risk/reward preview */}
              <div className="bg-white/3 rounded-2xl p-4 border border-white/8">
                <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Соотношение риск / доходность</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-rose-500/20 rounded-lg h-8 flex items-center px-3">
                    <span className="text-xs text-rose-400 font-bold">Риск: -{config.stopLoss}%</span>
                  </div>
                  <div className="text-white/40 font-bold">→</div>
                  <div
                    className="bg-emerald-500/20 rounded-lg h-8 flex items-center px-3"
                    style={{ flex: config.takeProfit / config.stopLoss }}
                  >
                    <span className="text-xs text-emerald-400 font-bold">Профит: +{config.takeProfit}%</span>
                  </div>
                </div>
                <div className="text-xs text-white/30 mt-2">
                  Коэффициент R/R: <span className="text-white/60 font-bold">{(config.takeProfit / config.stopLoss).toFixed(1)}x</span>
                </div>
              </div>
            </div>
          )}

          {/* SIGNALS */}
          {step === 'signals' && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-bold text-white mb-1">Индикаторы и условия входа</h3>
              <div>
                <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Выбери индикаторы * (мин. 1)</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {INDICATORS.map(ind => (
                    <button
                      key={ind.id}
                      onClick={() => toggleIndicator(ind.id)}
                      className={`p-3 rounded-xl text-left transition-all border ${
                        config.indicators.includes(ind.id)
                          ? 'border-opacity-50 bg-opacity-10'
                          : 'bg-white/3 border-white/8 hover:border-white/20'
                      }`}
                      style={config.indicators.includes(ind.id) ? {
                        borderColor: ind.color + '60',
                        backgroundColor: ind.color + '12',
                      } : {}}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white font-display">{ind.name}</span>
                        {config.indicators.includes(ind.id) && (
                          <span className="text-xs" style={{ color: ind.color }}>✓</span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/40">{ind.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Условие входа</div>
                  <div className="space-y-2">
                    {ENTRY_CONDITIONS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig(cfg => ({ ...cfg, entryCondition: c.id }))}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left transition-all border ${
                          config.entryCondition === c.id
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/3 border-white/8 text-white/50 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${config.entryCondition === c.id ? 'border-emerald-400 bg-emerald-400' : 'border-white/20'}`}>
                          {config.entryCondition === c.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Условие выхода</div>
                  <div className="space-y-2">
                    {EXIT_CONDITIONS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig(cfg => ({ ...cfg, exitCondition: c.id }))}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left transition-all border ${
                          config.exitCondition === c.id
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-white/3 border-white/8 text-white/50 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${config.exitCondition === c.id ? 'border-rose-400 bg-rose-400' : 'border-white/20'}`}>
                          {config.exitCondition === c.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PREVIEW */}
          {step === 'preview' && (
            <div>
              <h3 className="text-lg font-display font-bold text-white mb-6">Твой бот готов 🚀</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* bot card preview */}
                <div className="glass-card rounded-2xl p-5 border border-[#00f5a0]/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00f5a0]/10 border border-[#00f5a0]/20 flex items-center justify-center text-2xl">
                      {STRATEGIES.find(s => s.id === config.strategy)?.emoji || '🤖'}
                    </div>
                    <div>
                      <div className="font-display font-black text-white">{config.name || 'Мой бот'}</div>
                      <div className="text-xs text-white/40">{config.exchange} · {config.pair} · {config.timeframe}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="text-lg font-bold font-display gradient-text">+{estimateRoi(config)}%</div>
                      <div className="text-[10px] text-white/40">ROI прогноз</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="text-lg font-bold font-display text-white">${config.deposit}</div>
                      <div className="text-[10px] text-white/40">Депозит</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="text-lg font-bold font-display text-white">{config.maxTrades}</div>
                      <div className="text-[10px] text-white/40">Макс. сделок</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/40">Стратегия</span>
                      <span className="text-white">{STRATEGIES.find(s => s.id === config.strategy)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Уровень риска</span>
                      <span className="text-white">{estimateRisk(config)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Stop Loss / TP</span>
                      <span className="text-white">-{config.stopLoss}% / +{config.takeProfit}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Индикаторы</span>
                      <span className="text-white">{config.indicators.join(', ').toUpperCase() || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* actions */}
                <div className="space-y-3">
                  <div className="bg-[#00f5a0]/5 border border-[#00f5a0]/15 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="TrendingUp" size={15} className="text-[#00f5a0]" />
                      <span className="text-sm font-bold text-white">Прогноз доходности</span>
                    </div>
                    <div className="text-3xl font-display font-black gradient-text">+{estimateRoi(config)}%</div>
                    <div className="text-xs text-white/40 mt-1">Ориентировочный годовой ROI на основе настроек</div>
                  </div>

                  <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
                    <div className="text-xs text-white/40 mb-3">Следующие шаги</div>
                    {[
                      'Подключи API ключи биржи',
                      'Запусти на демо-аккаунте',
                      'Проверь результаты 7 дней',
                      'Переведи на реальный счёт',
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2.5 py-1.5">
                        <div className="w-5 h-5 rounded-full bg-white/8 text-white/30 text-[10px] flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
                        <span className="text-xs text-white/60">{step}</span>
                      </div>
                    ))}
                  </div>

                  {saved ? (
                    <div className="space-y-3">
                      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-center">
                        <div className="text-2xl mb-1">🎉</div>
                        <div className="text-sm font-bold text-emerald-400 mb-0.5">Бот сохранён в каталог!</div>
                        <div className="text-xs text-white/40">Найди его в разделе «Каталог»</div>
                      </div>
                      <button
                        onClick={onGoToCatalog}
                        className="w-full btn-glow bg-[#00f5a0] text-black font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                      >
                        <Icon name="LayoutGrid" size={15} />
                        Перейти в каталог
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        className="flex-1 btn-glow bg-[#00f5a0] text-black font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                      >
                        <Icon name="Save" size={15} />
                        Сохранить в каталог
                      </button>
                      <button className="flex-1 glass-card text-white/70 hover:text-white font-medium py-3 rounded-xl text-sm transition-colors">
                        Тестировать
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* nav buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              const prev = STEPS[stepIndex - 1];
              if (prev) setStep(prev.id);
            }}
            disabled={stepIndex === 0}
            className="glass-card text-white/50 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Icon name="ChevronLeft" size={16} />
            Назад
          </button>

          {step !== 'preview' && (
            <button
              onClick={() => {
                const next = STEPS[stepIndex + 1];
                if (next) setStep(next.id);
              }}
              disabled={!canProceed()}
              className="btn-glow bg-[#00f5a0] text-black font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Далее
              <Icon name="ChevronRight" size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}