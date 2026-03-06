import { Bot } from '@/data/bots';
import Icon from '@/components/ui/icon';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface CheckoutModalProps {
  bot: Bot | null;
  onClose: () => void;
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Банковская карта', icon: 'CreditCard' },
  { id: 'crypto', label: 'Криптовалюта', icon: 'Bitcoin' },
  { id: 'usdt', label: 'USDT (TRC-20)', icon: 'Wallet' },
];

export default function CheckoutModal({ bot, onClose }: CheckoutModalProps) {
  const { items, removeFromCart, clearCart, total } = useCart();
  const [method, setMethod] = useState('card');
  const [step, setStep] = useState<'cart' | 'pay' | 'done'>('cart');

  if (!bot && items.length === 0) return null;

  const checkoutItems = bot ? [{ bot, qty: 1 }] : items;
  const checkoutTotal = bot ? bot.price : total;

  const handlePay = () => {
    setStep('done');
    if (bot) {
      removeFromCart(bot.id);
    } else {
      clearCart();
    }
  };

  if (step === 'done') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="font-display font-bold text-white text-2xl mb-2">Оплата прошла!</h2>
          <p className="text-white/50 text-sm mb-6">Боты активированы в вашем аккаунте. Подключите биржу для начала торговли.</p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold btn-glow bg-[var(--neon-green)] text-black"
          >
            Готово
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
            <Icon name="ShoppingCart" size={18} className="text-[var(--neon-green)]" />
            <h2 className="font-display font-bold text-white text-lg">
              {step === 'cart' ? 'Корзина' : 'Оплата'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* items list */}
          <div className="space-y-2">
            {checkoutItems.map(({ bot: b }) => (
              <div key={b.id} className="flex items-center gap-3 bg-white/4 rounded-xl p-3">
                <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-xl flex-shrink-0">
                  {b.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm truncate">{b.name}</div>
                  <div className="text-xs text-white/40">{b.author}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  {b.price === 0 ? (
                    <span className="gradient-text font-bold text-sm">Free</span>
                  ) : (
                    <span className="font-bold text-white text-sm">${b.price}<span className="text-xs text-white/40">/мес</span></span>
                  )}
                </div>
                {!bot && (
                  <button onClick={() => removeFromCart(b.id)} className="ml-1 text-white/20 hover:text-rose-400 transition-colors">
                    <Icon name="Trash2" size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {step === 'pay' && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Способ оплаты</p>
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-medium ${
                    method === pm.id
                      ? 'border-[var(--neon-green)]/50 bg-[var(--neon-green)]/8 text-white'
                      : 'border-white/8 bg-white/4 text-white/50 hover:bg-white/8'
                  }`}
                >
                  <Icon name={pm.icon as 'CreditCard'} size={16} />
                  {pm.label}
                  {method === pm.id && <Icon name="Check" size={14} className="ml-auto text-[var(--neon-green)]" />}
                </button>
              ))}
            </div>
          )}

          {/* total */}
          <div className="flex items-center justify-between py-3 border-t border-white/8">
            <span className="text-white/50 text-sm">Итого / месяц</span>
            <span className="text-2xl font-bold font-display text-white">
              {checkoutTotal === 0 ? <span className="gradient-text">$0</span> : `$${checkoutTotal}`}
            </span>
          </div>

          {/* action */}
          {step === 'cart' ? (
            <button
              onClick={() => setStep('pay')}
              className="w-full py-3 rounded-xl font-bold btn-glow bg-[var(--neon-green)] text-black flex items-center justify-center gap-2"
            >
              <Icon name="ArrowRight" size={18} />
              Перейти к оплате
            </button>
          ) : (
            <button
              onClick={handlePay}
              className="w-full py-3 rounded-xl font-bold btn-glow bg-[var(--neon-green)] text-black flex items-center justify-center gap-2"
            >
              <Icon name="Zap" size={18} />
              Оплатить ${checkoutTotal}/мес
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
