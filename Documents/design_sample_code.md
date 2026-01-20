import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Sword, 
  Feather, 
  Check, 
  X, 
  Settings, 
  BookOpen, 
  Trophy,
  Volume2,
  ArrowRight,
  Sparkles,
  Gift,
  Smile,
  Footprints,
  Ghost,
  Flame,
  Hand,
  Zap,
  Maximize2,
  Minus,
  Square
} from 'lucide-react';

// --- Styles & Animations ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap');
  body { font-family: 'M PLUS Rounded 1c', sans-serif; }
  .inner-shadow { box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05); }
  
  /* --- Keyframes --- */
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px) rotate(-5deg); }
    75% { transform: translateX(6px) rotate(5deg); }
  }
  .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.25); }
    100% { transform: scale(1); }
  }
  .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }

  @keyframes walk {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .animate-walk { animation: walk 0.6s ease-in-out infinite; }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float { animation: float 3s ease-in-out infinite; }

  @keyframes float-clouds {
    0% { background-position: 0 0; }
    100% { background-position: 100px 50px; }
  }
  .animate-clouds { animation: float-clouds 20s linear infinite; }

  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  .animate-pulse-ring::before {
    content: '';
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    border-radius: inherit;
    border: 4px solid currentColor;
    animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  }

  @keyframes stroke-guide {
    0% { offset-distance: 0%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { offset-distance: 100%; opacity: 0; }
  }

  @keyframes combo-pop {
    0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
    50% { transform: scale(1.5) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  .animate-combo-pop { animation: combo-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }

  @keyframes text-float-up {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
  }
  .animate-text-float { animation: text-float-up 1s ease-out forwards; }
`;

// --- Components ---

// 1. Combo Badge (PC Layout Adjustment)
const ComboBadge = ({ count }) => {
  if (count < 2) return null;
  const isHighCombo = count >= 5;
  
  return (
    <div className={`absolute top-24 left-8 z-20 pointer-events-none transition-all duration-300 ${isHighCombo ? 'scale-110' : 'scale-100'}`}>
      <div className="relative animate-combo-pop" key={count}>
        <div className={`absolute inset-0 rounded-full blur-md opacity-50 animate-pulse ${isHighCombo ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
        <div className={`
          relative bg-gradient-to-b text-white font-extrabold border-4 border-white shadow-xl rounded-2xl px-6 py-3 flex flex-col items-center transform -rotate-6
          ${isHighCombo ? 'from-orange-500 to-red-600' : 'from-yellow-300 to-orange-400'}
        `}>
          <span className="text-5xl leading-none drop-shadow-md filter">{count}</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${isHighCombo ? 'text-white' : 'text-yellow-900'}`}>
            {isHighCombo ? 'FEVER!!' : 'れんぞく！'}
          </span>
        </div>
        <div className="absolute -top-4 -right-4 text-yellow-500 animate-bounce">
          {isHighCombo ? <Zap size={40} fill="#fbbf24" className="text-red-500" /> : <Flame size={32} fill="currentColor" />}
        </div>
      </div>
    </div>
  );
};

// 2. Floating Feedback Text
const FloatingFeedback = ({ text, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
      <div className="animate-text-float text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600 drop-shadow-[0_4px_0_rgba(255,255,255,1)] stroke-white">
        {text}
      </div>
    </div>
  );
};

// 3. Living Background
const LivingBackground = ({ variant = 'adventure', fever = false }) => {
  if (variant === 'adventure') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 transition-all duration-1000 ${fever ? 'opacity-80' : 'opacity-40'}`}>
        <div className={`absolute inset-0 transition-colors duration-500 ${fever ? 'bg-orange-100' : 'bg-slate-50'}`}></div>
        <div className="absolute inset-0 animate-clouds" style={{
          backgroundImage: `radial-gradient(circle at center, #fed7aa 2px, transparent 2.5px), radial-gradient(circle at center, #fdba74 1px, transparent 1.5px)`,
          backgroundSize: '40px 40px',
          opacity: 0.4
        }}></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        {fever && (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iI2ZmYjAyNCIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] animate-pulse opacity-50"></div>
        )}
      </div>
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/washi.png')]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent"></div>
    </div>
  );
};

// 4. GameButton
const GameButton = ({ 
  variant = 'primary', 
  size = 'default', 
  state = 'idle', 
  attention = false, 
  confetti = false,
  children, 
  onClick, 
  className = '' 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const baseStyles = "relative font-bold rounded-2xl transition-all duration-100 flex items-center justify-center select-none cursor-pointer overflow-hidden";
  
  const variants = {
    primary: "bg-orange-500 text-white shadow-[0_6px_0_#c2410c] hover:brightness-110",
    mastery: "bg-indigo-700 text-white shadow-lg shadow-indigo-200 border-b-4 border-indigo-900 hover:bg-indigo-600",
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100/50"
  };

  let stateStyles = "";
  let animationClass = "";

  if (state === 'correct') {
    stateStyles = "!bg-green-500 !text-white !border-green-600 !shadow-[0_6px_0_#15803d]";
    animationClass = "animate-pop";
  } else if (state === 'wrong') {
    stateStyles = "!bg-rose-500 !text-white !border-rose-600 !shadow-[0_6px_0_#be123c]";
    animationClass = "animate-shake";
  }

  const attentionClass = attention ? "animate-pulse-ring z-20" : "";
  const activeStyles = isPressed && state === 'idle' ? "scale-95 translate-y-[2px] shadow-none border-b-0" : "";

  const sizes = {
    default: "h-14 px-6 text-lg min-w-[120px]", 
    icon: "h-14 w-14 text-xl",
    lg: "h-16 px-8 text-xl min-w-[200px]"
  };

  const handleClick = (e) => {
    if (confetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`
        ${baseStyles} ${variants[variant]} ${sizes[size] || sizes.default} 
        ${stateStyles} ${activeStyles} ${animationClass} ${attentionClass} ${className}
      `}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handleClick}
    >
      {showConfetti && (
        <>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-2 h-2 rounded-full animate-confetti top-1/2 left-1/2"
              style={{
                '--tw-translate-x': `${(Math.random() - 0.5) * 100}px`,
                '--tw-rotate': `${Math.random() * 360}deg`,
                backgroundColor: ['#fbbf24', '#34d399', '#f472b6', '#60a5fa'][i % 4],
                animationDelay: `${i * 0.05}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">
        {state === 'correct' && <Check size={28} strokeWidth={4} />}
        {state === 'wrong' && <X size={28} strokeWidth={4} />}
        {children}
      </span>
    </button>
  );
};

// 5. NarrativeProgress
const NarrativeProgress = ({ value, max = 100, characterIcon: Icon = Ghost }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="w-full relative pt-6 pb-2">
      <div className="h-6 bg-slate-200 rounded-full w-full overflow-hidden relative border border-slate-300 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik0wIDIwTDIwIDBIMTBMMCAxMFoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTA 2MEwyMCAxMFYyMEwxMCAyMFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
      </div>
      <div 
        className="absolute top-1 transition-all duration-500 ease-out z-10"
        style={{ left: `calc(${percentage}% - 20px)` }}
      >
        <div className="bg-white p-1.5 rounded-full shadow-md border-2 border-orange-500 animate-walk transform -translate-y-2">
          <Icon size={24} className="text-orange-500 fill-orange-100" />
        </div>
        {percentage > 5 && percentage < 100 && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg font-bold animate-float after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-800">
            {percentage > 80 ? 'もうすぐ！' : 'GO!'}
          </div>
        )}
      </div>
      <div className="absolute top-1 right-0 -mr-3 z-0">
         <div className="bg-yellow-100 p-2 rounded-full border-2 border-yellow-400 shadow-sm transform rotate-12 group -translate-y-1">
            <Gift size={24} className="text-yellow-600 group-hover:scale-110 transition-transform" />
         </div>
      </div>
    </div>
  );
};

// 6. GhostGuide
const GhostGuide = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid meet">
        <path 
          id="guide-path-1"
          d="M 128 40 L 128 220" 
          fill="none" 
          stroke="transparent"
        />
        <circle r="12" fill="rgba(67, 56, 202, 0.3)" className="animate-ping" style={{ offsetPath: "path('M 128 40 L 128 220')", animationDuration: "2s" }}>
          <animateMotion dur="2s" repeatCount="indefinite" path="M 128 40 L 128 220" />
        </circle>
        
        <g>
          <animateMotion dur="2s" repeatCount="indefinite" path="M 128 40 L 128 220" rotate="auto" />
          <foreignObject width="32" height="32" x="-16" y="-16">
            <div className="text-indigo-600 filter drop-shadow-md">
              <Hand size={32} fill="white" />
            </div>
          </foreignObject>
        </g>
      </svg>
      <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md font-bold opacity-80">
        ここから ↓
      </div>
    </div>
  );
}

// 7. EmotiveDialog
const EmotiveDialog = ({ variant = 'joy', isOpen, onClose, children }) => {
  if (!isOpen) return null;
  const styles = {
    joy: {
      bg: "bg-gradient-to-b from-yellow-50 to-white",
      border: "border-4 border-yellow-400",
      icon: <Sparkles className="text-yellow-500 animate-spin-slow" size={32} />,
      shadow: "shadow-[0_0_40px_rgba(250,204,21,0.3)]"
    },
    encourage: {
      bg: "bg-gradient-to-b from-orange-50 to-white",
      border: "border-4 border-orange-300",
      icon: <Smile className="text-orange-500 animate-bounce" size={32} />,
      shadow: "shadow-[0_0_40px_rgba(249,115,22,0.2)]"
    },
    zen: {
      bg: "bg-[#FAFAF9] bg-[url('https://www.transparenttextures.com/patterns/washi.png')]",
      border: "border-4 border-slate-700",
      icon: <Feather className="text-slate-700" size={32} />,
      shadow: "shadow-2xl"
    }
  };
  const currentStyle = styles[variant] || styles.joy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-sm rounded-3xl p-6 ${currentStyle.bg} ${currentStyle.border} ${currentStyle.shadow} animate-in zoom-in-95 duration-300`}>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white p-3 rounded-full shadow-lg border-2 border-inherit">
          {currentStyle.icon}
        </div>
        <div className="mt-8 text-center space-y-4">
          {children}
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-black/5">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

const AppCard = ({ children, className = '', highlight = false }) => {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${highlight ? 'ring-4 ring-orange-200' : ''} ${className}`}>
      {children}
    </div>
  );
};

// --- Browser Window Wrapper ---
const BrowserWindow = ({ children, title = "Web Site" }) => (
  <div className="w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px]">
    {/* Browser Bar */}
    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <div className="flex-1 bg-white h-8 rounded-md border border-slate-200 flex items-center px-3 text-xs text-slate-400 font-mono">
        https://yorichan.study/adventure
      </div>
    </div>
    {/* Content */}
    <div className="flex-1 relative bg-[#FAFAF9] overflow-hidden">
      {children}
    </div>
  </div>
);

// --- Main Layout ---

export default function DesignSystem() {
  const [activeTab, setActiveTab] = useState('demo');
  const [demoLevel, setDemoLevel] = useState(1);
  const [demoXp, setDemoXp] = useState(60);
  const [buttonState, setButtonState] = useState('idle');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVariant, setDialogVariant] = useState('joy');
  
  // Non-blocking Flow
  const [combo, setCombo] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [floatingText, setFloatingText] = useState(null);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setButtonState('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      setTimeout(() => {
        if (newCombo >= 3) {
           setFloatingText(newCombo >= 5 ? "FEVER!!" : "すごーい！");
        }
        setShowNextButton(true);
        handleXpGain(); 
        setButtonState('idle');
      }, 600);
    } else {
      setButtonState('wrong');
      setCombo(0); 
      setTimeout(() => {
        setDialogVariant('encourage');
        setDialogOpen(true);
        setButtonState('idle');
      }, 800);
    }
  };

  const handleXpGain = () => {
    const newXp = demoXp + 20;
    if (newXp >= 100) {
      setDemoXp(0);
      setDemoLevel(l => l + 1);
    } else {
      setDemoXp(newXp);
    }
  };

  const handleNextProblem = () => {
    setShowNextButton(false);
    setButtonState('idle');
    setFloatingText(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans pb-20">
      <style>{globalStyles}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <Star size={18} fill="currentColor" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              デザインの <span className="text-orange-500">しんか</span>
            </h1>
          </div>
          <div className="flex gap-2">
            {['top1', 'demo', 'ui'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab === 'top1' && 'NO.1 かいぜん'}
                {tab === 'demo' && 'PCデモ (New!)'}
                {tab === 'ui' && 'ぶひん'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* --- Tab: Top 1 Improvement --- */}
        {activeTab === 'top1' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                集中を切らさない 「熱狂のUI」
              </h2>
              <p className="text-slate-500">
                ポップアップを廃止し、リズムに乗れる改善を行いました。
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <AppCard className="relative overflow-hidden border-orange-400 bg-orange-50 ring-4 ring-orange-100">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={120} />
                </div>
                <div className="relative z-10 p-4">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                        <span className="font-extrabold text-3xl">1</span>
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-slate-900">ノンブロッキング演出</h3>
                        <p className="text-sm font-bold text-orange-600">Popups are banned for Success!</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex gap-3">
                        <Check className="text-green-500 flex-shrink-0" />
                        <p className="text-slate-700 font-medium">コンボ時はダイアログを出さず、画面端のバッジと背景演出のみで盛り上げる。</p>
                     </div>
                     <div className="flex gap-3">
                        <Check className="text-green-500 flex-shrink-0" />
                        <p className="text-slate-700 font-medium">「つぎへ」ボタンが即座に押せる状態をキープ。思考を止めない。</p>
                     </div>
                     <div className="flex gap-3">
                        <Check className="text-green-500 flex-shrink-0" />
                        <p className="text-slate-700 font-medium">5連鎖以上で「Feverモード」へ。背景が変化し没入感を深める。</p>
                     </div>
                  </div>

                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => setActiveTab('demo')}
                      className="w-full bg-slate-900 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                      PC版レイアウトで試す <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </AppCard>
            </div>
          </div>
        )}

        {/* --- Tab: Demo (PC Layout) --- */}
        {activeTab === 'demo' && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Adventure Mode Demo (Desktop) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-orange-600 flex items-center gap-2">
                  <Sword size={20} />
                  モード：ぼうけん (PC Wide View)
                </h3>
              </div>

              {/* Browser Window Mockup */}
              <BrowserWindow>
                {/* 1. Living Background */}
                <LivingBackground variant="adventure" fever={combo >= 5} />
                
                {/* 2. Combo Badge (Positined for Desktop) */}
                <ComboBadge count={combo} />

                {/* 3. Floating Feedback */}
                {floatingText && (
                  <FloatingFeedback text={floatingText} onComplete={() => setFloatingText(null)} />
                )}

                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 pointer-events-none">
                   <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm flex items-center gap-3 border border-slate-100">
                      <div className="flex items-center gap-1 text-yellow-600 font-bold">
                        <Star size={16} fill="currentColor" /> Lv.{demoLevel}
                      </div>
                      <div className="h-4 w-[1px] bg-slate-200"></div>
                      <div className="text-slate-500 text-sm font-bold">よりちゃん</div>
                   </div>
                   <button className="pointer-events-auto p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                     <Settings size={20} className="text-slate-500" />
                   </button>
                </div>

                {/* Main Desktop Grid Layout */}
                <div className="h-full flex flex-col pt-16 pb-8 px-12 relative z-10">
                  
                  {/* Top: Progress */}
                  <div className="w-full max-w-3xl mx-auto mb-8">
                    <NarrativeProgress value={demoXp} />
                  </div>

                  {/* Center: 2-Column Game Area */}
                  <div className="flex-1 grid grid-cols-12 gap-8 items-center max-w-5xl mx-auto w-full">
                    
                    {/* Left Col: Question Card (Big) */}
                    <div className="col-span-5 h-full max-h-[400px]">
                      <div className="h-full bg-white rounded-[2rem] p-8 shadow-xl border-b-8 border-slate-100 flex flex-col items-center justify-center space-y-6 animate-float" style={{ animationDuration: '6s' }}>
                        <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-sm font-bold">
                          よんでみよう
                        </span>
                        <div className="flex-1 flex items-center justify-center">
                          <h2 className="text-8xl font-extrabold text-slate-900 tracking-widest drop-shadow-sm">
                            海
                          </h2>
                        </div>
                        <button className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition-colors transform hover:scale-110">
                          <Volume2 size={32} />
                        </button>
                      </div>
                    </div>

                    {/* Right Col: Choices & Next Button */}
                    <div className="col-span-7 flex flex-col justify-center h-full max-h-[400px]">
                       <div className="grid grid-cols-2 gap-4 h-full">
                        {!showNextButton ? (
                          <>
                            <GameButton variant="secondary" onClick={() => handleAnswer(false)} className="text-2xl h-auto rounded-3xl">
                              みち
                            </GameButton>
                            <GameButton variant="secondary" onClick={() => handleAnswer(true)} state={buttonState} className="text-2xl h-auto rounded-3xl border-b-8">
                              うみ
                            </GameButton>
                            <GameButton variant="secondary" onClick={() => handleAnswer(false)} className="text-2xl h-auto rounded-3xl">
                              かわ
                            </GameButton>
                            <GameButton variant="secondary" onClick={() => handleAnswer(false)} className="text-2xl h-auto rounded-3xl">
                              そら
                            </GameButton>
                          </>
                        ) : (
                          <div className="col-span-2 flex flex-col items-center justify-center bg-white/40 rounded-[2rem] border-2 border-white/50 backdrop-blur-sm animate-in zoom-in duration-300">
                             <Check size={64} className="text-green-500 mb-4 drop-shadow-sm" strokeWidth={3} />
                             <p className="text-2xl font-bold text-green-700">だいせいかい！</p>
                          </div>
                        )}
                       </div>
                    </div>
                  </div>

                  {/* Bottom: Next Button Area */}
                  <div className="h-20 flex items-center justify-center mt-6">
                     {showNextButton ? (
                       <GameButton 
                          variant="primary" 
                          size="lg"
                          className="w-full max-w-md shadow-xl text-2xl h-20" 
                          onClick={handleNextProblem} 
                          confetti={true}
                          attention={true} 
                       >
                         つぎの もんだいへ
                         <ArrowRight className="ml-3" size={28} />
                       </GameButton>
                     ) : (
                       <div className="text-slate-400 font-bold animate-pulse">どれかな？</div>
                     )}
                  </div>
                </div>
              </BrowserWindow>
            </div>

            {/* Mastery Mode Demo (Desktop) */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                  <Feather size={20} />
                  モード：しゅうれん (PC Wide View)
                </h3>
               </div>

               <BrowserWindow>
                 <LivingBackground variant="zen" />
                 
                 {/* PC Layout: Sidebar + Canvas */}
                 <div className="flex h-full relative z-10">
                    
                    {/* Left: Tools Sidebar */}
                    <div className="w-24 bg-white/80 backdrop-blur-sm border-r border-slate-200 flex flex-col items-center py-6 gap-6">
                       <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                          <Feather size={24} />
                       </button>
                       <button className="p-3 bg-white text-slate-400 border border-slate-200 rounded-xl hover:text-slate-600 hover:bg-slate-50 transition-colors">
                          <Square size={24} />
                       </button>
                       <button className="p-3 bg-white text-slate-400 border border-slate-200 rounded-xl hover:text-slate-600 hover:bg-slate-50 transition-colors">
                          <Minus size={24} />
                       </button>
                       <div className="flex-1"></div>
                       <button className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                          <X size={24} />
                       </button>
                    </div>

                    {/* Center: Canvas Area */}
                    <div className="flex-1 p-8 flex flex-col items-center justify-center">
                        <div className="bg-white rounded-[40px] shadow-2xl border-4 border-indigo-50 aspect-square h-[400px] relative overflow-hidden">
                           {/* Grid Lines */}
                           <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                              <div className="border-r-2 border-dashed border-indigo-100"></div>
                              <div className="border-b-2 border-dashed border-indigo-100 col-start-1 row-start-1"></div>
                              <div className="border-t-2 border-dashed border-indigo-100 col-start-2 row-start-2"></div>
                              <div className="border-l-2 border-dashed border-indigo-100 col-start-2 row-start-1 row-span-2"></div>
                           </div>
                           
                           {/* Kanji Guide */}
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                              <span className="text-[280px] font-serif text-slate-900 leading-none mt-[-20px]">木</span>
                           </div>

                           {/* Ghost Guide */}
                           <GhostGuide />
                        </div>
                        
                        <div className="mt-4 text-indigo-900/40 font-bold bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm">
                           大きく かいてみよう
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="w-64 p-6 flex flex-col justify-center gap-4">
                       <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-auto">
                          <h4 className="font-bold text-slate-600 mb-2 text-sm">おてほん</h4>
                          <div className="bg-slate-50 rounded-xl aspect-square flex items-center justify-center border border-slate-200">
                             <span className="text-4xl font-serif">木</span>
                          </div>
                       </div>

                       <GameButton variant="mastery" className="w-full text-xl py-8" onClick={() => { setDialogVariant('zen'); setDialogOpen(true); }}>
                         かけた！
                       </GameButton>
                    </div>

                 </div>
               </BrowserWindow>
            </div>

          </div>
        )}

        {/* --- Tab: UI Components (Reference) --- */}
        {activeTab === 'ui' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold">コンポーネント一覧</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2 col-span-2">
                   <p className="text-sm font-bold text-slate-500">Combo Badge (High Level)</p>
                   <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                      <ComboBadge count={5} />
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                        Displays 'FEVER' at 5+
                      </div>
                   </div>
                 </div>
              </div>
           </div>
        )}

      </main>

      {/* Global Dialog Component */}
      <EmotiveDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        variant={dialogVariant}
      >
        {dialogVariant === 'encourage' && (
          <>
            <h3 className="text-2xl font-extrabold text-orange-600">おしい！</h3>
            <p className="text-lg font-bold text-slate-700">もうすこし！<br/>あきらめないで！</p>
            <div className="pt-4">
               <GameButton variant="secondary" onClick={() => setDialogOpen(false)} className="w-full">
                もういっかい
              </GameButton>
            </div>
          </>
        )}
        {dialogVariant === 'zen' && (
          <>
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">天晴</h3>
            <p className="text-lg font-serif text-slate-600">
              こころをこめて<br/>よく かけました。
            </p>
            <div className="pt-6">
               <GameButton variant="mastery" onClick={() => setDialogOpen(false)} className="w-full">
                とじる
              </GameButton>
            </div>
          </>
        )}
      </EmotiveDialog>
    </div>
  );
}