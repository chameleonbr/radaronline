import { ArrowUp, Lightbulb, MapPin, Plus } from 'lucide-react';
import type { Suggestion } from '../userSettings.types';

interface UserSettingsRoadmapTabProps {
  onOpenSuggestionModal: () => void;
  onVote: (id: string) => void;
  suggestions: Suggestion[];
}

export function UserSettingsRoadmapTab({
  onOpenSuggestionModal,
  onVote,
  suggestions,
}: UserSettingsRoadmapTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white rounded-2xl relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Lightbulb size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-2xl mb-2 flex items-center gap-2">
            Roadmap Colaborativo <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white/90">BETA</span>
          </h3>
          <p className="text-indigo-100 leading-relaxed mb-6 max-w-lg">
            Voce sugere, a rede vota, a gente constroi. Participe da evolucao do Radar.
          </p>
          <button
            onClick={onOpenSuggestionModal}
            className="px-6 py-3 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Sugerir Melhoria
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Top Sugestoes</span>
        </div>

        {[...suggestions].sort((left, right) => right.votes - left.votes).map((suggestion, index) => (
          <div
            key={suggestion.id}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 flex gap-4 border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex flex-col items-center justify-center gap-1 min-w-[40px]">
              <button
                onClick={() => onVote(suggestion.id)}
                disabled={suggestion.hasVoted}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${suggestion.hasVoted
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 border border-slate-200 dark:border-slate-600'
                  }`}
              >
                <ArrowUp size={20} strokeWidth={3} />
              </button>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{suggestion.votes}</span>
            </div>

            <div className="flex-1 min-w-0 py-1">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                  {suggestion.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={10} /> {suggestion.authorMunicipality}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">{suggestion.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{suggestion.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
