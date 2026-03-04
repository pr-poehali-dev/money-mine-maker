import { createContext, useContext, useState, ReactNode } from 'react';
import { Bot, bots as initialBots } from '@/data/bots';

interface BotsContextValue {
  bots: Bot[];
  addBot: (bot: Bot) => void;
}

const BotsContext = createContext<BotsContextValue | null>(null);

export function BotsProvider({ children }: { children: ReactNode }) {
  const [bots, setBots] = useState<Bot[]>(initialBots);

  const addBot = (bot: Bot) => {
    setBots(prev => [bot, ...prev]);
  };

  return (
    <BotsContext.Provider value={{ bots, addBot }}>
      {children}
    </BotsContext.Provider>
  );
}

export function useBots() {
  const ctx = useContext(BotsContext);
  if (!ctx) throw new Error('useBots must be used within BotsProvider');
  return ctx;
}
