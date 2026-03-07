import { Bot } from '@/data/bots';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface ExchangeConnectModalProps {
  bot: Bot | null;
  onClose: () => void;
}

const EXCHANGES = [
  { id: 'binance', name: 'Binance', emoji: '🟡' },
  { id: 'bybit', name: 'Bybit', emoji: '🟠' },
  { id: 'okx', name: 'OKX', emoji: '⚫' },
  { id: 'kucoin', name: 'KuCoin', emoji: '🟢' },
  { id: 'gate', name: 'Gate.io', emoji: '🔵' },
  { id: 'pocket_option', name: 'Pocket Option', emoji: '💜' },
];

type Step = 'select' | 'keys' | 'done';

export default function ExchangeConnectModal({ bot, onClose }: ExchangeConnectModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [exchange, setExchange] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);

  if (!bot) return null;

  const selectedEx = EXCHANGES.find(e => e.id === exchange);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('done');
    }, 1800);
  };

  if (step === 'done') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">{selectedEx?.emoji}</span>
          </div>
          <h2 className="font-display font-bold text-white text-2xl mb-2">{selectedEx?.name} подключена!</h2>
          <p className="text-white/50 text-sm mb-1">
            Бот <span className="text-white font-bold">{bot.emoji} {bot.name}</span> успешно подключён.
          </p>
          <p className="text-white/40 text-xs mb-6">Торговля начнётся автоматически согласно стратегии.</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all">
            Отлично!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Icon name="Link" size={18} className="text-cyan-400" />
            <h2 className="font-display font-bold text-white text-lg">Подключить биржу</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* bot info */}
          <div className="flex items-center gap-3 bg-white/4 rounded-xl p-3">
            <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-xl">{bot.emoji}</div>
            <div>
              <div className="font-bold text-white text-sm">{bot.name}</div>
              <div className="text-xs text-white/40">будет торговать на выбранной бирже</div>
            </div>
          </div>

          {step === 'select' && (
            <>
              <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Выберите биржу</p>
              <div className="space-y-2">
                {EXCHANGES.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setExchange(ex.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-medium ${
                      exchange === ex.id
                        ? 'border-cyan-400/50 bg-cyan-400/8 text-white'
                        : 'border-white/8 bg-white/4 text-white/50 hover:bg-white/8'
                    }`}
                  >
                    <span className="text-xl">{ex.emoji}</span>
                    {ex.name}
                    {exchange === ex.id && <Icon name="Check" size={14} className="ml-auto text-cyan-400" />}
                  </button>
                ))}
              </div>
              <button
                disabled={!exchange}
                onClick={() => setStep('keys')}
                className="w-full py-3 rounded-xl font-bold border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Icon name="ArrowRight" size={18} />
                Далее — ввести API ключи
              </button>
            </>
          )}

          {step === 'keys' && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => setStep('select')} className="text-white/30 hover:text-white transition-colors">
                  <Icon name="ArrowLeft" size={16} />
                </button>
                <p className="text-sm text-white/60">API ключи <span className="font-bold text-white">{selectedEx?.name}</span></p>
              </div>

              <div className="bg-amber-400/8 border border-amber-400/20 rounded-xl p-3 text-xs text-amber-400/80 flex gap-2">
                <Icon name="ShieldAlert" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Создайте API ключ с правами на торговлю, без права вывода средств. Ключ хранится зашифрованно.</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">API Key</label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="Вставьте API Key..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">API Secret</label>
                  <input
                    type="password"
                    value={apiSecret}
                    onChange={e => setApiSecret(e.target.value)}
                    placeholder="Вставьте API Secret..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                  />
                </div>
              </div>

              <button
                disabled={!apiKey || !apiSecret || loading}
                onClick={handleConnect}
                className="w-full py-3 rounded-xl font-bold border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" />
                    Подключение...
                  </>
                ) : (
                  <>
                    <Icon name="Link" size={18} />
                    Подключить
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}