import React, { useState } from 'react';
import { EyeOff, Eye, Sun, CloudRain, Wind, Calculator } from 'lucide-react';

interface DiscretionShieldProps {
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const DiscretionShield: React.FC<DiscretionShieldProps> = ({
  isActive,
  onToggle,
  children
}) => {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [activeCamouflage, setActiveCamouflage] = useState<'calculator' | 'weather'>('calculator');

  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      try {
        // Safe evaluation
        const clean = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${clean})`)();
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay('0');
      }
    } else {
      setCalcDisplay(prev => (prev === '0' ? val : prev + val));
    }
  };

  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col font-sans select-none animate-fadeIn">
      {/* Camouflage Mode Header with Secret Unlock */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            {activeCamouflage === 'calculator' ? 'Standard Calculator' : 'Dubai Weather'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveCamouflage(c => c === 'calculator' ? 'weather' : 'calculator')}
            className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px]"
          >
            {activeCamouflage === 'calculator' ? 'Switch to Weather' : 'Switch to Calc'}
          </button>
          {/* Discreet Exit Button */}
          <button
            onClick={onToggle}
            title="Exit Discretion Camouflage"
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeCamouflage === 'calculator' ? (
        /* Realistic Working iOS Calculator */
        <div className="flex-1 flex flex-col max-w-sm mx-auto w-full p-6 justify-end pb-12">
          <div className="text-right text-6xl font-light mb-6 tracking-tight overflow-x-auto text-zinc-100 font-mono">
            {calcDisplay}
          </div>
          <div className="grid grid-cols-4 gap-3 text-2xl font-normal">
            {['C', '+/-', '%', '/'].map(btn => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn === '/' ? '/' : btn)}
                className="h-16 rounded-full bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-zinc-100 font-medium transition-all"
              >
                {btn}
              </button>
            ))}
            {['7', '8', '9', '*'].map(btn => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className={`h-16 rounded-full ${btn === '*' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-zinc-800 hover:bg-zinc-700'} text-zinc-100 transition-all`}
              >
                {btn === '*' ? '×' : btn}
              </button>
            ))}
            {['4', '5', '6', '-'].map(btn => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className={`h-16 rounded-full ${btn === '-' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-zinc-800 hover:bg-zinc-700'} text-zinc-100 transition-all`}
              >
                {btn}
              </button>
            ))}
            {['1', '2', '3', '+'].map(btn => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className={`h-16 rounded-full ${btn === '+' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-zinc-800 hover:bg-zinc-700'} text-zinc-100 transition-all`}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => handleCalcClick('0')}
              className="col-span-2 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-left pl-7 transition-all"
            >
              0
            </button>
            <button
              onClick={() => handleCalcClick('.')}
              className="h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-all"
            >
              .
            </button>
            <button
              onClick={() => handleCalcClick('=')}
              className="h-16 rounded-full bg-amber-600 hover:bg-amber-500 text-zinc-100 transition-all"
            >
              =
            </button>
          </div>
          <div className="text-center mt-6">
            <span 
              onClick={onToggle}
              className="text-[11px] text-zinc-600 cursor-pointer hover:text-zinc-400 select-none"
            >
              Tap here to resume SilentPass
            </span>
          </div>
        </div>
      ) : (
        /* Realistic Weather Screen */
        <div className="flex-1 max-w-sm mx-auto w-full p-6 flex flex-col justify-between">
          <div className="text-center mt-8">
            <h2 className="text-3xl font-semibold text-zinc-100">Dubai</h2>
            <p className="text-sm text-zinc-400 mt-1">Sunny & Clear</p>
            <div className="text-7xl font-extralight text-amber-300 mt-4">29°C</div>
            <div className="flex justify-center space-x-4 text-xs text-zinc-400 mt-2">
              <span>H: 32°</span>
              <span>L: 22°</span>
              <span>Humidity: 48%</span>
            </div>
          </div>

          <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800 space-y-3">
            <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Hourly Forecast</div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-zinc-800/60 rounded-xl">
                <div>Now</div>
                <Sun className="w-5 h-5 mx-auto my-1 text-amber-400" />
                <div>29°</div>
              </div>
              <div className="p-2 bg-zinc-800/60 rounded-xl">
                <div>15:00</div>
                <Sun className="w-5 h-5 mx-auto my-1 text-amber-400" />
                <div>31°</div>
              </div>
              <div className="p-2 bg-zinc-800/60 rounded-xl">
                <div>18:00</div>
                <CloudRain className="w-5 h-5 mx-auto my-1 text-blue-400" />
                <div>27°</div>
              </div>
              <div className="p-2 bg-zinc-800/60 rounded-xl">
                <div>21:00</div>
                <Wind className="w-5 h-5 mx-auto my-1 text-zinc-400" />
                <div>24°</div>
              </div>
            </div>
          </div>

          <div className="text-center pb-8">
            <button
              onClick={onToggle}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Resume SilentPass Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
