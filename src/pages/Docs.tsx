import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const steps = [
  {
    id: 1,
    icon: 'Download',
    title: 'Скачайте файл бота',
    description: 'Откройте карточку любого бота, перейдите на вкладку «Python код» и нажмите «Скачать .py».',
    code: null,
  },
  {
    id: 2,
    icon: 'Terminal',
    title: 'Установите Python',
    description: 'Убедитесь, что у вас установлен Python 3.10 или выше. Проверьте версию командой:',
    code: 'python --version',
  },
  {
    id: 3,
    icon: 'Package',
    title: 'Установите зависимости',
    description: 'Установите библиотеку ccxt для работы с биржами через pip:',
    code: 'pip install ccxt numpy requests',
  },
  {
    id: 4,
    icon: 'Key',
    title: 'Добавьте API-ключи',
    description: 'Откройте скачанный .py файл в любом текстовом редакторе. Замените YOUR_API_KEY и YOUR_SECRET на ключи вашей биржи.',
    code: `exchange = ccxt.binance({
    'apiKey': 'вставьте_ваш_ключ',
    'secret': 'вставьте_ваш_секрет',
})`,
  },
  {
    id: 5,
    icon: 'Play',
    title: 'Запустите бота',
    description: 'Запустите скрипт из терминала. Бот начнёт работу и будет выводить лог сделок.',
    code: 'python alphascalper_pro.py',
  },
];

const faqs = [
  {
    q: 'Где получить API-ключи биржи?',
    a: 'Зайдите в настройки вашего аккаунта на бирже (Binance, Bybit, OKX и др.) → раздел «API Management» → создайте новый ключ с правами на торговлю. Никогда не давайте разрешение на вывод средств!',
  },
  {
    q: 'Можно ли запустить бота на VPS-сервере?',
    a: 'Да, это рекомендуемый способ. Бот будет работать 24/7 без зависимости от вашего компьютера. Подойдёт любой VPS с Ubuntu от $5/мес (DigitalOcean, Hetzner, Timeweb).',
  },
  {
    q: 'Безопасно ли вводить API-ключи в код?',
    a: 'Используйте переменные окружения вместо хардкода. Создайте файл .env с ключами и читайте их через os.environ["API_KEY"]. Никогда не публикуйте файл с ключами в открытый доступ.',
  },
  {
    q: 'Что такое testnet и как им пользоваться?',
    a: 'Testnet — тестовая среда биржи с виртуальными деньгами. Рекомендуем сначала проверить бота на testnet. Для Binance: замените ccxt.binance() на ccxt.binance({"options": {"defaultType": "future"}}) и используйте ключи от testnet.binance.vision.',
  },
  {
    q: 'Бот завис или выдаёт ошибку — что делать?',
    a: 'Проверьте: 1) правильность API-ключей, 2) достаточно ли средств на балансе, 3) не превышен ли лимит запросов к бирже. Добавьте time.sleep(1) между запросами если получаете ошибку 429.',
  },
];

export default function Docs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const handleCopy = (code: string, stepId: number) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background mesh-bg text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '128px' }}
      />

      {/* header */}
      <header className="border-b border-white/8 bg-black/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <Icon name="ArrowLeft" size={16} />
            Назад к каталогу
          </Link>
          <span className="text-white/20">·</span>
          <span className="text-white/60 text-sm">Документация</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">

        {/* hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/20 mb-2">
            <Icon name="BookOpen" size={32} />
          </div>
          <h1 className="text-3xl font-bold font-display">Как запустить бота</h1>
          <p className="text-white/50 text-lg">Пошаговая инструкция от скачивания до первой сделки</p>
        </div>

        {/* steps */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80">Шаги запуска</h2>
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                <div className="p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/20 flex items-center justify-center flex-shrink-0">
                    <Icon name={step.icon} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--neon-green)] font-mono">Шаг {step.id}</span>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {step.code && (
                  <div className="border-t border-white/8">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/3">
                      <span className="text-xs text-white/30 font-mono">terminal</span>
                      <button
                        onClick={() => handleCopy(step.code!, step.id)}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
                      >
                        <Icon name={copiedStep === step.id ? 'Check' : 'Copy'} size={12} />
                        {copiedStep === step.id ? 'Скопировано' : 'Копировать'}
                      </button>
                    </div>
                    <pre className="px-4 py-3 text-xs font-mono text-emerald-400 bg-black/30 overflow-x-auto">{step.code}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* tip */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex gap-4">
          <Icon name="AlertTriangle" size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400 mb-1">Важно перед запуском</p>
            <p className="text-sm text-white/50 leading-relaxed">
              Торговые боты работают с реальными деньгами. Всегда тестируйте стратегию на минимальных суммах перед увеличением объёма. Используйте только те средства, потерю которых вы можете себе позволить.
            </p>
          </div>
        </div>

        {/* faq */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80">Частые вопросы</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  <Icon name={openFaq === i ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-white/40 flex-shrink-0" />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/8 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* cta */}
        <div className="text-center space-y-4 pb-8">
          <p className="text-white/40 text-sm">Готовы начать?</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold btn-glow bg-[var(--neon-green)] text-black hover:brightness-110 transition-all"
          >
            <Icon name="ArrowLeft" size={16} />
            Выбрать бота в каталоге
          </Link>
        </div>
      </div>
    </div>
  );
}