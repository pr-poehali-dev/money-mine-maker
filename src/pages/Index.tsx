import { useState, useMemo } from 'react';
import { botTypes, riskLevels, sortOptions } from '@/data/bots';
import { useBots } from '@/context/BotsContext';
import BotCard from '@/components/BotCard';
import StatsSection from '@/components/StatsSection';
import PracticeSection from '@/components/PracticeSection';
import BotBuilderSection from '@/components/BotBuilderSection';
import Icon from '@/components/ui/icon';

type Tab = 'catalog' | 'stats' | 'practice' | 'builder';

export default function Index() {
  const { bots } = useBots();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sort, setSort] = useState('popular');
  const [activeTab, setActiveTab] = useState<Tab>('catalog');

  const filtered = useMemo(() => {
    let result = [...bots];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q)) ||
        b.author.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'all') result = result.filter(b => b.type === typeFilter);
    if (riskFilter !== 'all') result = result.filter(b => b.risk === riskFilter);

    result.sort((a, b) => {
      if (sort === 'roi') return b.roi - a.roi;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });

    return result;
  }, [search, typeFilter, riskFilter, sort]);

  return (
    <div className="min-h-screen bg-background mesh-bg">
      {/* noise overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />

      {/* header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f5a0] to-[#00d9f5] flex items-center justify-center text-black font-black font-display text-sm">TB</div>
            <div>
              <div className="font-display font-black text-white text-base leading-tight">TradeBase</div>
              <div className="text-[10px] text-white/30 leading-tight">Marketplace</div>
            </div>
          </div>

          <div className="flex bg-white/5 rounded-xl p-1 border border-white/8 overflow-x-auto">
            {([
              { id: 'catalog', label: 'Каталог', icon: 'LayoutGrid' },
              { id: 'practice', label: 'Практика', icon: 'FlaskConical' },
              { id: 'builder', label: 'Конструктор', icon: 'Wrench' },
              { id: 'stats', label: 'Статистика', icon: 'BarChart3' },
            ] as { id: Tab; label: string; icon: string }[]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#00f5a0] text-black' : 'text-white/60 hover:text-white'}`}
              >
                <Icon name={tab.icon} size={13} fallback="Circle" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <button className="btn-glow hidden md:flex items-center gap-2 bg-[#00f5a0] text-black text-sm font-bold px-4 py-2 rounded-xl">
            <Icon name="Plus" size={16} />
            Добавить бота
          </button>
        </div>
      </header>

      {activeTab === 'catalog' ? (
        <>
          {/* hero */}
          <section className="pt-16 pb-12 px-4 text-center relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-1/4 w-64 h-64 bg-[#00f5a0]/5 rounded-full blur-3xl" />
              <div className="absolute top-10 right-1/4 w-64 h-64 bg-[#a855f7]/5 rounded-full blur-3xl" />
            </div>
            <div className="relative max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 tag bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 mb-5 text-sm px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
                1240+ стратегий уже доступны
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-[1.1] mb-4">
                Маркетплейс{' '}
                <span className="gradient-text">торговых</span>
                <br />
                <span className="gradient-text-purple">ботов</span> и стратегий
              </h1>

              <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Готовые алгоритмы для автоматической торговли на крипто-биржах. Запускайте за 3 минуты.
              </p>

              <div className="relative max-w-xl mx-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Icon name="Search" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Поиск по названию, тегам, стратегии..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 glass-card rounded-2xl text-white placeholder:text-white/30 text-base border-0 focus:outline-none focus:ring-2 focus:ring-[#00f5a0]/30 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['BTC', 'ETH', 'AI', 'скальпинг', 'арбитраж', 'DeFi', 'бесплатный'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="tag bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-xs px-3 py-1"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* filters */}
          <div className="px-4 mb-8">
            <div className="max-w-6xl mx-auto">
              <div className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Icon name="SlidersHorizontal" size={15} />
                    Фильтры:
                  </div>

                  <div className="flex bg-white/5 rounded-xl p-1 border border-white/8 flex-wrap gap-1">
                    {botTypes.map(t => (
                      <button
                        key={t.value}
                        onClick={() => setTypeFilter(t.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${typeFilter === t.value ? 'bg-[#00f5a0] text-black' : 'text-white/50 hover:text-white'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex bg-white/5 rounded-xl p-1 border border-white/8">
                    {riskLevels.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setRiskFilter(r.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${riskFilter === r.value ? 'bg-[#a855f7] text-white' : 'text-white/50 hover:text-white'}`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-white/30 text-xs">Сортировать:</span>
                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      className="bg-white/5 border border-white/10 text-white/70 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00f5a0]/30"
                    >
                      {sortOptions.map(o => (
                        <option key={o.value} value={o.value} className="bg-[#0a0f1a]">{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* catalog grid */}
          <div className="px-4 pb-20">
            <div className="max-w-6xl mx-auto">
              {/* my bots strip */}
              {bots.filter(b => b.author === 'Мой бот').length > 0 && !search && typeFilter === 'all' && riskFilter === 'all' && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-cyan-400">⚙️ Мои боты</span>
                      <span className="tag bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 text-xs">{bots.filter(b => b.author === 'Мой бот').length}</span>
                    </div>
                    <button onClick={() => setActiveTab('builder')} className="text-xs text-white/40 hover:text-[#00f5a0] transition-colors flex items-center gap-1">
                      <Icon name="Plus" size={12} />
                      Создать ещё
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {bots.filter(b => b.author === 'Мой бот').map((bot, i) => (
                      <BotCard key={bot.id} bot={bot} style={{ animationDelay: `${i * 60}ms` }} />
                    ))}
                  </div>
                  <div className="border-t border-white/5 mt-6 mb-6" />
                </div>
              )}

              <div className="flex items-center justify-between mb-5">
                <div className="text-white/50 text-sm">
                  Найдено <span className="text-white font-bold">{filtered.length}</span> {filtered.length === 1 ? 'бот' : filtered.length < 5 ? 'бота' : 'ботов'}
                </div>
                {(search || typeFilter !== 'all' || riskFilter !== 'all') && (
                  <button
                    onClick={() => { setSearch(''); setTypeFilter('all'); setRiskFilter('all'); }}
                    className="text-xs text-[#00f5a0]/70 hover:text-[#00f5a0] transition-colors flex items-center gap-1"
                  >
                    <Icon name="X" size={12} />
                    Сбросить фильтры
                  </button>
                )}
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((bot, i) => (
                    <BotCard
                      key={bot.id}
                      bot={bot}
                      style={{ animationDelay: `${i * 60}ms` }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="font-display font-bold text-white text-xl mb-2">Ничего не найдено</h3>
                  <p className="text-white/40 text-sm">Попробуйте изменить параметры поиска</p>
                  <button
                    onClick={() => { setSearch(''); setTypeFilter('all'); setRiskFilter('all'); }}
                    className="mt-4 btn-glow bg-[#00f5a0] text-black text-sm font-bold px-5 py-2 rounded-xl"
                  >
                    Сбросить всё
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : activeTab === 'practice' ? (
        <PracticeSection />
      ) : activeTab === 'builder' ? (
        <BotBuilderSection onGoToCatalog={() => setActiveTab('catalog')} />
      ) : (
        <StatsSection />
      )}

      {/* footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00f5a0] to-[#00d9f5] flex items-center justify-center text-black font-black font-display text-xs">TB</div>
            <span className="text-white/30 text-sm">TradeBase © 2024</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="#" className="hover:text-white/70 transition-colors">Условия</a>
            <a href="#" className="hover:text-white/70 transition-colors">Безопасность</a>
            <a href="#" className="hover:text-white/70 transition-colors">Поддержка</a>
            <a href="#" className="hover:text-white/70 transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}