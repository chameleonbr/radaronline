export function LandingGlobalStyles() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
            html { scroll-behavior: smooth; }
            ::selection { background: rgba(30,107,255,0.25); color: #04110C; }

            ::-webkit-scrollbar { width: 12px; }
            ::-webkit-scrollbar-track { background: #06140F; }
            ::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, rgba(24,195,160,1), rgba(53,211,255,1), rgba(30,107,255,1));
              border: 3px solid #06140F;
              border-radius: 10px;
            }
        `}</style>
    );
}
