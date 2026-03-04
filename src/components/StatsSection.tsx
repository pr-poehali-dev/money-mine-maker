import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  icon: string;
  color: string;
  delay: number;
}

function StatItem({ value, suffix, label, icon, color, delay }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      let start = 0;
      const duration = 1500;
      const step = Math.ceil(value / (duration / 16));
      const interval = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      className="glass-card rounded-2xl p-6 text-center relative overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
    >
      <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }} />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          {icon}
        </div>
        <div className="text-3xl font-display font-black text-white mb-1">
          {count.toLocaleString('ru')}{suffix}
        </div>
        <div className="text-sm text-white/50">{label}</div>
      </div>
    </div>
  );
}

const stats = [
  { value: 1240, suffix: '+', label: 'Ботов и стратегий', icon: '🤖', color: '#00f5a0', delay: 0 },
  { value: 47800, suffix: '+', label: 'Активных пользователей', icon: '👥', color: '#00d9f5', delay: 150 },
  { value: 284, suffix: 'M$', label: 'Объём торгов / мес', icon: '💰', color: '#a855f7', delay: 300 },
  { value: 96, suffix: '%', label: 'Довольных клиентов', icon: '⭐', color: '#f05edc', delay: 450 },
  { value: 12, suffix: '', label: 'Поддерживаемых бирж', icon: '🏦', color: '#ff9d5c', delay: 600 },
  { value: 3, suffix: ' мин', label: 'Среднее время запуска', icon: '⚡', color: '#00f5a0', delay: 750 },
];

export default function StatsSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 tag bg-purple-400/10 text-purple-400 border border-purple-400/20 mb-4 text-sm px-4 py-1.5">
            <Icon name="BarChart3" size={14} />
            Статистика платформы
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-3">
            Цифры говорят{' '}
            <span className="gradient-text-purple">сами за себя</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto">
            TradeBase — крупнейший маркетплейс торговых алгоритмов в СНГ
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <StatItem key={i} {...s} />
          ))}
        </div>

        {/* Chart teaser */}
        <div className="glass-card rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-white text-lg">Доходность топ-10 ботов</h3>
              <p className="text-white/40 text-sm mt-0.5">Последние 30 дней</p>
            </div>
            <span className="tag bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-sm px-3 py-1">+31.4% avg</span>
          </div>

          {/* Visual bars */}
          <div className="space-y-3">
            {[
              { name: 'DeFi Yield Bot', value: 89, roi: '+213%' },
              { name: 'AlphaScalper Pro', value: 72, roi: '+127%' },
              { name: 'TrendRider AI', value: 60, roi: '+89%' },
              { name: 'SwingSniper', value: 45, roi: '+67%' },
              { name: 'GridMaster Ultimate', value: 30, roi: '+43%' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-28 text-xs text-white/60 text-right truncate">{item.name}</div>
                <div className="flex-1 h-7 bg-white/5 rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg relative overflow-hidden"
                    style={{
                      width: `${item.value}%`,
                      background: `linear-gradient(90deg, #00f5a0, #00d9f5)`,
                      transition: 'width 1s ease',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                  </div>
                </div>
                <div className="w-14 text-xs font-bold text-emerald-400 font-display text-right">{item.roi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
