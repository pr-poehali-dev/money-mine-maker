import { Bot, riskLabels, typeLabels } from '@/data/bots';
import Icon from '@/components/ui/icon';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface BotModalProps {
  bot: Bot | null;
  onClose: () => void;
  onCheckout: (bot: Bot) => void;
  onConnect: (bot: Bot) => void;
}

const riskColors = {
  low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  high: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

const riskDot = {
  low: 'bg-emerald-400',
  medium: 'bg-amber-400',
  high: 'bg-rose-400',
};

function highlight(code: string) {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(#[^\n]*)/g, '<span style="color:#6a9955">$1</span>')
    .replace(/\b(import|from|def|if|elif|else|while|for|in|return|and|or|not|True|False|None|class|with|as|pass|break|continue|lambda|try|except|raise|yield|global|nonlocal|del|is)\b/g, '<span style="color:#569cd6">$1</span>')
    .replace(/('[^']*'|"[^"]*")/g, '<span style="color:#ce9178">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#b5cea8">$1</span>')
    .replace(/\b([A-Z_][A-Z0-9_]{2,})\b/g, '<span style="color:#9cdcfe">$1</span>');
}

export default function BotModal({ bot, onClose, onCheckout, onConnect }: BotModalProps) {
  const { addToCart, items } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [tab, setTab] = useState<'overview' | 'code'>('overview');
  const [copied, setCopied] = useState(false);

  if (!bot) return null;

  const inCart = items.some(i => i.bot.id === bot.id);

  const handleAddToCart = () => {
    addToCart(bot);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bot.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([bot.codeSnippet], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bot.name.replace(/\s+/g, '_').toLowerCase()}.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        {/* gradient header */}
        <div className={`relative h-32 bg-gradient-to-br ${bot.gradient} opacity-80 flex-shrink-0`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
          <div className="absolute bottom-4 left-5 flex items-end gap-3">
            <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
              {bot.emoji}
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-xl leading-tight">{bot.name}</h2>
              <p className="text-xs text-white/50">by {bot.author}</p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="flex border-b border-white/10 flex-shrink-0">
          <button
            onClick={() => setTab('overview')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === 'overview' ? 'text-white border-b-2 border-[var(--neon-green)]' : 'text-white/40 hover:text-white/70'}`}
          >
            Обзор
          </button>
          <button
            onClick={() => setTab('code')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${tab === 'code' ? 'text-white border-b-2 border-[var(--neon-green)]' : 'text-white/40 hover:text-white/70'}`}
          >
            <Icon name="Code2" size={14} />
            Python код
          </button>
        </div>

        {/* scrollable content */}
        <div className="overflow-y-auto flex-1">
          {tab === 'overview' ? (
            <div className="p-5 space-y-5">
              <p className="text-sm text-white/60 leading-relaxed">{bot.description}</p>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold font-display gradient-text">+{bot.roi}%</div>
                  <div className="text-[10px] text-white/40 mt-0.5">ROI / год</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold font-display text-white">{bot.winRate}%</div>
                  <div className="text-[10px] text-white/40 mt-0.5">Точность</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold font-display text-white">{bot.trades.toLocaleString('ru')}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">Сделок</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="tag bg-white/5 text-white/50 border border-white/8">{typeLabels[bot.type]}</span>
                <span className={`tag border ${riskColors[bot.risk]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${riskDot[bot.risk]} mr-1.5`} />
                  {riskLabels[bot.risk]} риск
                </span>
                {bot.exchanges.map(ex => (
                  <span key={ex} className="tag bg-white/5 text-white/40 border border-white/8">{ex}</span>
                ))}
                {bot.tags.map(t => (
                  <span key={t} className="tag bg-white/5 text-white/40 border border-white/8">{t}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-sm ${s <= Math.round(bot.rating) ? 'text-amber-400' : 'text-white/15'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-white/50">{bot.rating} · {bot.reviews} отзывов</span>
                </div>
                <span className="text-2xl font-bold font-display text-white">
                  {bot.price === 0 ? (
                    <span className="gradient-text text-xl">Бесплатно</span>
                  ) : (
                    <>${bot.price}<span className="text-sm font-normal text-white/40">/мес</span></>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/8">
                <span className="text-xs text-white/40 font-mono">{bot.name.replace(/\s+/g, '_').toLowerCase()}.py</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    <Icon name="Download" size={13} />
                    Скачать .py
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    <Icon name={copied ? 'Check' : 'Copy'} size={13} />
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>
              </div>
              <pre
                className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-white/80 bg-[#0a0f16]"
                dangerouslySetInnerHTML={{ __html: highlight(bot.codeSnippet) }}
              />
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex gap-2 p-5 pt-3 border-t border-white/8 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              inCart
                ? 'bg-white/5 border-white/10 text-white/30 cursor-default'
                : addedToCart
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
            }`}
          >
            <Icon name={inCart ? 'Check' : addedToCart ? 'Check' : 'ShoppingCart'} size={16} />
            {inCart ? 'В корзине' : addedToCart ? 'Добавлено!' : 'В корзину'}
          </button>

          <button
            onClick={() => onConnect(bot)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all"
          >
            <Icon name="Link" size={16} />
            Подключить биржу
          </button>

          <button
            onClick={() => onCheckout(bot)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold btn-glow bg-[var(--neon-green)] text-black hover:brightness-110 transition-all"
          >
            <Icon name="Zap" size={16} />
            Купить
          </button>
        </div>
      </div>
    </div>
  );
}