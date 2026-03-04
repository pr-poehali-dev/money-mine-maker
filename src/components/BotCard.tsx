import { Bot, riskLabels, typeLabels } from '@/data/bots';
import Icon from '@/components/ui/icon';

interface BotCardProps {
  bot: Bot;
  style?: React.CSSProperties;
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

export default function BotCard({ bot, style }: BotCardProps) {
  return (
    <div
      className="glass-card rounded-2xl p-5 card-hover cursor-pointer relative overflow-hidden group"
      style={style}
    >
      {/* gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bot.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* badges */}
      <div className="absolute top-4 right-4 flex gap-1.5 z-10">
        {bot.author === 'Мой бот' && (
          <span className="tag bg-cyan-400/15 text-cyan-400 border border-cyan-400/25">⚙️ Мой</span>
        )}
        {bot.isPopular && (
          <span className="tag bg-amber-400/15 text-amber-400 border border-amber-400/25">🔥 Топ</span>
        )}
        {bot.isNew && (
          <span className="tag bg-emerald-400/15 text-emerald-400 border border-emerald-400/25">✨ Новый</span>
        )}
        {bot.isPro && (
          <span className="tag bg-purple-400/15 text-purple-400 border border-purple-400/25">⚡ Pro</span>
        )}
      </div>

      <div className="relative z-10">
        {/* header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
            {bot.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-white text-base leading-tight truncate">{bot.name}</h3>
            <p className="text-xs text-white/40 mt-0.5">by {bot.author}</p>
          </div>
        </div>

        {/* description */}
        <p className="text-sm text-white/55 leading-relaxed mb-4 line-clamp-2">{bot.description}</p>

        {/* stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/5 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold font-display gradient-text">+{bot.roi}%</div>
            <div className="text-[10px] text-white/40 mt-0.5">ROI / год</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold font-display text-white">{bot.winRate}%</div>
            <div className="text-[10px] text-white/40 mt-0.5">Точность</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center">
            <div className="text-lg font-bold font-display text-white">{bot.trades.toLocaleString('ru')}</div>
            <div className="text-[10px] text-white/40 mt-0.5">Сделок</div>
          </div>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="tag bg-white/5 text-white/50 border border-white/8">{typeLabels[bot.type]}</span>
          <span className={`tag border ${riskColors[bot.risk]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${riskDot[bot.risk]} mr-1.5`} />
            {riskLabels[bot.risk]} риск
          </span>
          {bot.tags.slice(0, 2).map(t => (
            <span key={t} className="tag bg-white/5 text-white/40 border border-white/8">{t}</span>
          ))}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className={`text-xs ${s <= Math.round(bot.rating) ? 'text-amber-400' : 'text-white/15'}`}>★</span>
              ))}
            </div>
            <span className="text-xs text-white/50">{bot.rating} ({bot.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-display text-white">
              {bot.price === 0 ? (
                <span className="gradient-text">Free</span>
              ) : (
                <>${bot.price}<span className="text-xs font-normal text-white/40">/мес</span></>
              )}
            </span>
            <button className="btn-glow bg-[var(--neon-green)] text-black text-xs font-bold px-3 py-1.5 rounded-lg">
              Купить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}