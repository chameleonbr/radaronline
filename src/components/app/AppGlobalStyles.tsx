export function AppGlobalStyles() {
  return (
    <style>{`
      .pattern-diagonal-lines {
        background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(251, 146, 60, 0.2) 5px, rgba(251, 146, 60, 0.2) 10px);
      }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 9999px; border: 2px solid transparent; background-clip: content-box; }
      ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
      :focus-visible { outline: 2px solid #0891b2; outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
      @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fade-in 0.2s ease-out; }
      @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      .animate-shimmer { animation: shimmer 2s infinite; }
      @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      .animate-pulse-soft { animation: pulse-soft 2s infinite; }
    `}</style>
  );
}
