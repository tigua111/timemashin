import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, FastForward, CheckCircle2, Rocket, ChevronDown, Sparkles } from 'lucide-react';

interface TimeOption {
  label: string;
  value: number;
}

const TIME_OPTIONS: TimeOption[] = [
  { label: '1 秒', value: 1000 },
  { label: '5 秒', value: 5000 },
  { label: '10 秒', value: 10000 },
  { label: '30 秒', value: 30000 },
  { label: '1 年', value: 31536000000 }
];

const TRAVEL_MESSAGES = [
  "羅技商城輸入優惠碼:LOGITIGUA",
  "訂閱我",
  "67其實是67的意思",
];

export default function App() {
  const [selectedOpt, setSelectedOpt] = useState<TimeOption>(TIME_OPTIONS[1]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'traveling' | 'arrived'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (status !== 'traveling') return;

    let rAF: number;
    const start = Date.now();
    const target = selectedOpt.value;

    const tick = () => {
      const now = Date.now();
      const passed = now - start;
      if (passed >= target) {
        setElapsed(target);
        setStatus('arrived');
      } else {
        setElapsed(passed);
        rAF = requestAnimationFrame(tick);
      }
    };

    rAF = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rAF);
  }, [status, selectedOpt]);

  const progress = Math.min((elapsed / selectedOpt.value) * 100, 100);
  const remainingSeconds = Math.max((selectedOpt.value - elapsed) / 1000, 0);

  const messageIndex = Math.floor(elapsed / 5000);
  const currentMessage = TRAVEL_MESSAGES[Math.min(messageIndex, TRAVEL_MESSAGES.length - 1)];

  return (
    <div className="min-h-screen bg-slate-950 font-sans overflow-hidden select-none flex items-center justify-center relative">
      {/* Subtle animated background map / noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-6 relative z-10"
          >
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/10 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse" />
                <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl relative">
                  <Sparkles className="w-10 h-10 text-indigo-400" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300">
                真正的時光機
              </h1>
              <p className="text-slate-400 font-mono text-sm mb-8 text-center leading-relaxed max-w-[250px]">
                真正的實時穿越體驗。<br/>
                選擇你要前往的未來，然後安靜地等待。
              </p>

              <div className="w-full relative mb-8" ref={dropdownRef}>
                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wide px-1">選擇穿越目標</label>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 text-slate-200 transition-all font-mono shadow-inner shadow-slate-900/50"
                >
                  <span className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    未來 {selectedOpt.label}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-20"
                    >
                      {TIME_OPTIONS.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => {
                            setSelectedOpt(opt);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-5 py-4 font-mono text-sm transition-colors ${
                            selectedOpt.label === opt.label
                              ? 'bg-indigo-500/10 text-indigo-300'
                              : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                          }`}
                        >
                          <span>穿梭到 {opt.label} 後</span>
                          {selectedOpt.label === opt.label && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setStatus('traveling')}
                className="group relative w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl text-lg transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FastForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  啟動時空引擎
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700" />
              </button>
            </div>
          </motion.div>
        )}

        {status === 'traveling' && (
          <motion.div
            key="traveling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
          >
            {/* Traveling visual effects */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{
                duration: selectedOpt.value > 10000 ? 5 : 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            >
              <div className="w-[150vw] h-[150vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent,theme(colors.indigo.500)_10%,transparent_30%,theme(colors.cyan.500)_60%,transparent_80%)] blur-3xl rounded-full" />
            </motion.div>

            {/* Star-like particles using CSS radial gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="z-10 flex flex-col items-center w-full max-w-md bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-800/50 shadow-2xl relative"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-30 rounded-full scale-150 animate-pulse" />
                <Rocket className="w-16 h-16 text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] relative z-10" />
              </motion.div>
              
              <h2 className="text-2xl font-bold tracking-[0.2em] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-indigo-200 animate-pulse">時空穿越中</h2>
              <p className="text-slate-400 font-mono text-sm mb-8">目標：未來相差 {selectedOpt.label}</p>

              <div className="w-full bg-slate-950/80 rounded-full h-4 overflow-hidden relative shadow-inner mb-4 border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 relative shadow-[0_0_15px_rgba(99,102,241,0.8)] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="w-full flex justify-between font-mono text-xs text-slate-400">
                <span>進度：{progress.toFixed(selectedOpt.value > 60000 ? 5 : 1)}%</span>
                <span className="tabular-nums text-cyan-200 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-800/50">剩餘 {remainingSeconds.toFixed(1)}s</span>
              </div>

              {/* Toast Messages every 5 seconds */}
              <div className="h-16 flex items-center justify-center mt-8 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={messageIndex}
                    initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -15, scale: 0.9, filter: 'blur(4px)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 px-6 py-3 rounded-2xl shadow-lg w-full text-center"
                  >
                    <p className="text-sm font-mono text-indigo-200">{currentMessage}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'arrived' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl"
           >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="bg-slate-900 border border-slate-700/80 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-[length:200%_100%] animate-[gradient_2s_linear_infinite]" />
                 
                 <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />

                 <div className="flex flex-col items-center text-center pt-4 relative z-10">
                     <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.5 }}
                        className="bg-emerald-500/10 p-4 rounded-full mb-6"
                     >
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                     </motion.div>
                     <h2 className="text-3xl font-bold mb-4 tracking-tight text-white">穿越成功！</h2>
                     <div className="text-slate-300 font-mono text-sm mb-10 leading-relaxed bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                         恭喜你，已經成功穿越來到
                         <br/>
                         <div className="mt-3">
                           <span className="text-emerald-300 font-bold text-lg bg-emerald-500/20 border border-emerald-500/30 px-4 py-1.5 rounded-xl shadow-inner inline-block">
                            {selectedOpt.label} 後
                           </span>
                         </div>
                         <br/>
                         的世界了！
                     </div>
                     <button
                         onClick={() => {
                             setStatus('idle');
                             setElapsed(0);
                         }}
                         className="w-full py-4 bg-white hover:bg-slate-200 text-slate-950 rounded-2xl font-bold transition-colors shadow-lg active:scale-95"
                     >
                         關閉視窗，繼續生活
                     </button>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
