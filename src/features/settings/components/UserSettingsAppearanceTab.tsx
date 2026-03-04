interface UserSettingsAppearanceTabProps {
  theme: 'light' | 'dark' | 'system';
  toggleTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export function UserSettingsAppearanceTab({
  theme,
  toggleTheme,
}: UserSettingsAppearanceTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Aparencia</h3>
        <p className="text-slate-500 dark:text-slate-400">Personalize a interface do sistema.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <button
          onClick={() => toggleTheme('light')}
          className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${theme === 'light'
            ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20'
            : 'border-slate-200 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800'
            }`}
        >
          <div className="w-16 h-10 bg-white border border-slate-200 rounded-lg shadow-sm" />
          <span className="font-medium text-slate-700 dark:text-slate-300">Claro</span>
        </button>

        <button
          onClick={() => toggleTheme('dark')}
          className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${theme === 'dark'
            ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20'
            : 'border-slate-200 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800'
            }`}
        >
          <div className="w-16 h-10 bg-slate-900 border border-slate-700 rounded-lg shadow-sm" />
          <span className="font-medium text-slate-700 dark:text-slate-300">Escuro</span>
        </button>

        <button
          onClick={() => toggleTheme('system')}
          className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${theme === 'system'
            ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20'
            : 'border-slate-200 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800'
            }`}
        >
          <div className="w-16 h-10 bg-gradient-to-r from-white to-slate-900 border border-slate-200 rounded-lg shadow-sm" />
          <span className="font-medium text-slate-700 dark:text-slate-300">Sistema</span>
        </button>
      </div>
    </div>
  );
}
