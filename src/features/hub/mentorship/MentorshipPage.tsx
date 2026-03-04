import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Star,
  MapPin,
  Award,
  BookOpen,
  ChevronRight,
  Search,
  CheckCircle2,
  ArrowLeft,
  Target,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useMentors, useMentorProfile, useMentorshipMatches, useMentorshipBadges } from '../../../hooks/useMentorship';
import type { Mentor, MentorshipSpecialty } from '../../../types/mentorship.types';
import { SPECIALTY_CONFIG, JOURNEY_PHASE_CONFIG, BADGE_CONFIG } from '../../../types/mentorship.types';

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

// =====================================================
// Sub-components
// =====================================================

const SpecialtyBadge: React.FC<{ specialty: MentorshipSpecialty; size?: 'sm' | 'md' }> = ({ specialty, size = 'sm' }) => {
  const config = SPECIALTY_CONFIG[specialty];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.bg} ${config.color} ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
      {config.icon} {config.label}
    </span>
  );
};

const RatingStars: React.FC<{ rating: number; count?: number }> = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={12}
        className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}
      />
    ))}
    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 ml-1">{rating.toFixed(1)}</span>
    {count !== undefined && <span className="text-[10px] text-slate-400">({count})</span>}
  </div>
);

const MentorCard: React.FC<{ mentor: Mentor; onSelect: (m: Mentor) => void }> = React.memo(({ mentor, onSelect }) => {
  const hasCapacity = mentor.currentMentees < mentor.maxMentees;

  return (
    <motion.button
      variants={fadeIn}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(mentor)}
      className="group w-full text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-teal-500/20">
          {(mentor.profile?.fullName || 'M')[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
              {mentor.profile?.fullName || 'Mentor'}
            </h3>
            {mentor.isVerified && <CheckCircle2 size={14} className="text-teal-500 shrink-0" />}
          </div>

          {mentor.profile?.jobTitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{mentor.profile.jobTitle}</p>
          )}

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mentor.specialties.slice(0, 3).map(s => (
              <SpecialtyBadge key={s} specialty={s} />
            ))}
            {mentor.specialties.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">+{mentor.specialties.length - 3}</span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400 dark:text-slate-500">
            <RatingStars rating={mentor.avgRating} count={mentor.ratingCount} />
            {mentor.municipality && (
              <span className="flex items-center gap-1"><MapPin size={11} /> {mentor.municipality}</span>
            )}
            <span className="flex items-center gap-1"><BookOpen size={11} /> {mentor.yearsExperience}a exp.</span>
            <span className={`flex items-center gap-1 ${hasCapacity ? 'text-emerald-500' : 'text-amber-500'}`}>
              <Users size={11} /> {mentor.currentMentees}/{mentor.maxMentees}
            </span>
          </div>
        </div>

        <ChevronRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-teal-500 transition-colors mt-1 shrink-0" />
      </div>
    </motion.button>
  );
});

// =====================================================
// Mentor Profile Modal
// =====================================================

const MentorProfileView: React.FC<{
  mentor: Mentor;
  onBack: () => void;
}> = React.memo(({ mentor, onBack }) => {
  const _phaseName = (phase: string) => JOURNEY_PHASE_CONFIG[phase as keyof typeof JOURNEY_PHASE_CONFIG]?.label || phase;

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors">
        <ArrowLeft size={16} /> Voltar
      </button>

      {/* Profile card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-teal-500/20 shrink-0">
            {(mentor.profile?.fullName || 'M')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{mentor.profile?.fullName}</h2>
              {mentor.isVerified && <CheckCircle2 size={18} className="text-teal-500" />}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{mentor.profile?.jobTitle}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              {mentor.municipality && <span className="flex items-center gap-1"><MapPin size={12} />{mentor.municipality}</span>}
              <span className="flex items-center gap-1"><BookOpen size={12} />{mentor.yearsExperience} anos de experiência</span>
            </div>
          </div>
        </div>

        {mentor.bio && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{mentor.bio}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="rounded-xl bg-teal-50 dark:bg-teal-900/20 p-3 text-center">
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{mentor.totalSessions}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sessões</p>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{mentor.totalHours}h</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Horas</p>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3 text-center">
            <RatingStars rating={mentor.avgRating} />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Avaliação</p>
          </div>
          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3 text-center">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{mentor.currentMentees}/{mentor.maxMentees}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Mentorados</p>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Especialidades</h3>
        <div className="flex flex-wrap gap-2">
          {mentor.specialties.map(s => <SpecialtyBadge key={s} specialty={s} size="md" />)}
        </div>
      </div>

      {/* Request button */}
      {mentor.currentMentees < mentor.maxMentees && (
        <button className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all">
          Solicitar Mentoria
        </button>
      )}
    </motion.div>
  );
});

// =====================================================
// Main Mentorship Page
// =====================================================

interface MentorshipPageProps {
  userId?: string;
}

export const MentorshipPage: React.FC<MentorshipPageProps> = React.memo(({ userId }) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'my' | 'dashboard'>('directory');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<MentorshipSpecialty | 'all'>('all');

  const { mentors, loading } = useMentors();
  const { matches } = useMentorshipMatches(userId);
  const { badges } = useMentorshipBadges(userId);
  const { mentor: myMentorProfile } = useMentorProfile(userId);

  const filteredMentors = useMemo(() => {
    return mentors.filter(m => {
      const matchesSearch = !searchTerm || (m.profile?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'all' || m.specialties.includes(specialtyFilter);
      return matchesSearch && matchesSpecialty;
    });
  }, [mentors, searchTerm, specialtyFilter]);

  const activeMatches = useMemo(() => matches.filter(m => m.status === 'active'), [matches]);

  // Mentor profile detail
  if (selectedMentor) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <MentorProfileView mentor={selectedMentor} onBack={() => setSelectedMentor(null)} />
      </div>
    );
  }

  const tabs = [
    { id: 'directory' as const, label: 'Diretório', icon: Users },
    { id: 'my' as const, label: 'Minhas Mentorias', icon: Target },
    { id: 'dashboard' as const, label: 'Dashboard', icon: TrendingUp },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div {...fadeIn} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mentorias</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Conecte-se com profissionais experientes para aprendizado prático</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-teal-200 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-900/20 p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mentores Ativos</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{mentors.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mentorias Ativas</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeMatches.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Badges Conquistados</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{badges.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Especialidades</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{Object.keys(SPECIALTY_CONFIG).length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Directory Tab */}
        {activeTab === 'directory' && (
          <motion.div {...fadeIn} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar mentores..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <select
                value={specialtyFilter}
                onChange={e => setSpecialtyFilter(e.target.value as MentorshipSpecialty | 'all')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none"
              >
                <option value="all">Todas especialidades</option>
                {(Object.keys(SPECIALTY_CONFIG) as MentorshipSpecialty[]).map(s => (
                  <option key={s} value={s}>{SPECIALTY_CONFIG[s].icon} {SPECIALTY_CONFIG[s].label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
            ) : filteredMentors.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <Users size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhum mentor encontrado</p>
              </div>
            ) : (
              <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                {filteredMentors.map(mentor => (
                  <MentorCard key={mentor.id} mentor={mentor} onSelect={setSelectedMentor} />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* My Mentorships Tab */}
        {activeTab === 'my' && (
          <motion.div {...fadeIn} className="space-y-4">
            {activeMatches.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <Target size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhuma mentoria ativa</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Explore o diretório para encontrar um mentor</p>
              </div>
            ) : (
              activeMatches.map(match => (
                <div key={match.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${JOURNEY_PHASE_CONFIG[match.currentPhase].bg} ${JOURNEY_PHASE_CONFIG[match.currentPhase].color}`}>
                        {JOURNEY_PHASE_CONFIG[match.currentPhase].icon} {JOURNEY_PHASE_CONFIG[match.currentPhase].label}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">Score: {match.matchScore || '--'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {match.matchedSpecialties.map(s => <SpecialtyBadge key={s} specialty={s} />)}
                  </div>
                  {/* Progress bar */}
                  <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all" style={{ width: `${match.phaseProgress}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 text-right">{match.phaseProgress}% da fase</p>
                </div>
              ))
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-amber-500" /> Badges</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {badges.map(badge => (
                    <div key={badge.id} className="text-center p-3 rounded-xl bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                      <span className="text-2xl">{badge.badgeIcon || BADGE_CONFIG[badge.badgeType]?.icon || '🏅'}</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">{badge.badgeName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div {...fadeIn} className="space-y-4">
            {myMentorProfile ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Dashboard do Mentor</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl bg-teal-50 dark:bg-teal-900/20 p-4 text-center">
                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{myMentorProfile.currentMentees}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Mentorados</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{myMentorProfile.totalSessions}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sessões</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{myMentorProfile.totalHours}h</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Horas</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-4 text-center">
                    <RatingStars rating={myMentorProfile.avgRating} />
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Avaliação</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <Award size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Você ainda não é um mentor</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4">Compartilhe suas experiências e ajude a rede!</p>
                <button className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20">
                  Tornar-me Mentor
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});
