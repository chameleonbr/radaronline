import { AtSign, Building, Layers, MapPin, Palette } from 'lucide-react';
import { getMicroregiaoById } from '../../../data/microregioes';
import type { User } from '../../../types/auth.types';
import { getAvatarUrl } from '../avatarUtils';

interface UserSettingsProfileTabProps {
  user: User;
}

export function UserSettingsProfileTab({ user }: UserSettingsProfileTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Editar Perfil</h3>
        <p className="text-slate-500 dark:text-slate-400">Gerencie suas informacoes pessoais e avatar.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <img
              src={getAvatarUrl(user.avatarId || 'zg10')}
              alt="Avatar"
              className="relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl object-cover bg-white"
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h4 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{user.nome}</h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                {user.role}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-slate-500">
                  <AtSign className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate" title={user.email}>
                    {user.email}
                  </div>
                </div>
              </div>

              {user.municipio && (
                <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-slate-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Municipio</div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{user.municipio}</div>
                  </div>
                </div>
              )}

              {user.microregiaoId && (
                <>
                  <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-slate-500">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Microrregiao</div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {getMicroregiaoById(user.microregiaoId)?.nome || '(Nao definida)'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-slate-500">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Macrorregiao</div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {getMicroregiaoById(user.microregiaoId)?.macrorregiao || '(Nao definida)'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-2xl">
        <div className="shrink-0 text-teal-600 dark:text-teal-400 bg-white dark:bg-teal-900/40 p-3 rounded-xl h-fit">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h5 className="font-bold text-teal-800 dark:text-teal-300">Quer mudar seu visual?</h5>
          <p className="text-sm text-teal-600/80 dark:text-teal-400/80 mt-1">
            Para alterar seu avatar, feche esta tela e clique diretamente na sua foto de perfil no menu lateral.
          </p>
        </div>
      </div>
    </div>
  );
}
