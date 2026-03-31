export function UserSettingsNsdigiTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 py-8 select-none">

      {/* Badge */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
          <span className="text-white font-black text-xs tracking-tight">NSDIGI</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">
          Núcleo de Saúde Digital
        </p>
        <p className="font-mono text-[9px] text-slate-400 dark:text-slate-500">SES/GAB/ATI-NSDIGI</p>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
        Radar Minas Digital
      </h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
        Secretaria de Estado de Saúde MG
      </p>

      <div className="mt-8 w-full max-w-xs space-y-5">

        {/* Coordenador */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-teal-600 dark:text-teal-400 mb-1">
            Coordenador
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Jonathan Henrique Souza</p>
        </div>

        <div className="w-16 h-px bg-slate-200 dark:bg-slate-700 mx-auto" />

        {/* Concepção & Desenvolvimento */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-teal-600 dark:text-teal-400 mb-1">
            Concepção &amp; Desenvolvimento · Radar
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Clévio Clênio Ferreira Da Silva Júnior
          </p>
        </div>

        <div className="w-16 h-px bg-slate-200 dark:bg-slate-700 mx-auto" />

        {/* Concepção HUB */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-teal-600 dark:text-teal-400 mb-1">
            Concepção · HUB
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">João Paulo Gomes Carvalho</p>
        </div>

        <div className="w-16 h-px bg-slate-200 dark:bg-slate-700 mx-auto" />

        {/* Apoio Geral */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-teal-600 dark:text-teal-400 mb-2">
            Apoio Geral
          </p>
          <div className="space-y-1">
            {[
              'Gabrielle Guimarães Gonçalves',
              'Alice Isabelle Gonçalves da Silva',
              'Sande Cristina Evangelista Ribeiro',
              'Elisiane Ribeiro Sales',
            ].map((name) => (
              <p key={name} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {name}
              </p>
            ))}
          </div>
        </div>

      </div>

      <p className="mt-10 font-mono text-[9px] text-slate-400 dark:text-slate-600 uppercase tracking-widest">
        Minas Gerais · Brasil
      </p>
    </div>
  );
}
