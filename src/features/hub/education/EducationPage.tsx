import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Clock,
  Users,
  BookOpen,
  Play,
  Search,
  ArrowRight,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useEducacao } from '../../../hooks/useEducacao';
import type { Course, Trail, CourseCategory, CourseLevel, CourseFormat } from '../../../types/education.types';
import { LEVEL_CONFIG, FORMAT_CONFIG, CATEGORIES } from '../../../types/education.types';

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

// =====================================================
// Sub-components
// =====================================================

const LevelBadge: React.FC<{ level: CourseLevel }> = ({ level }) => {
  const config = LEVEL_CONFIG[level];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.bg} ${config.color}`}>{config.label}</span>;
};

const FormatBadge: React.FC<{ format: CourseFormat }> = ({ format }) => {
  const config = FORMAT_CONFIG[format];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.bg} ${config.color}`}>{config.label}</span>;
};

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all ${value >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`}
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

const CourseCard: React.FC<{ course: Course; onEnroll: (id: string) => void }> = React.memo(({ course, onEnroll }) => (
  <motion.div
    variants={fadeIn}
    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all group"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center shrink-0">
        <GraduationCap size={24} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <LevelBadge level={course.level} />
          <FormatBadge format={course.format} />
          <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">{course.category}</span>
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-1">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{course.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-3">
          <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
          <span className="flex items-center gap-1"><Users size={12} /> {course.enrolled} inscritos</span>
        </div>

        {/* Progress */}
        {course.progress > 0 ? (
          <div>
            <ProgressBar value={course.progress} />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-slate-400">{course.progress}% concluído</span>
              {course.progress >= 100 && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
                  <CheckCircle2 size={10} /> Concluído
                </span>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => onEnroll(course.id)}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
          >
            <Play size={12} /> Iniciar Curso <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  </motion.div>
));

const TrailCard: React.FC<{ trail: Trail }> = React.memo(({ trail }) => (
  <motion.div
    variants={fadeIn}
    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition-all"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 flex items-center justify-center shrink-0">
        <Layers size={24} className="text-purple-600 dark:text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{trail.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{trail.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-3">
          <span className="flex items-center gap-1"><BookOpen size={12} /> {trail.coursesCount} cursos</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {trail.totalHours}h total</span>
          <span className="flex items-center gap-1"><Users size={12} /> {trail.enrolled} inscritos</span>
        </div>
        {trail.progress > 0 && (
          <div>
            <ProgressBar value={trail.progress} />
            <span className="text-[10px] text-slate-400 mt-1 block">{trail.progress}% da trilha</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
));

// =====================================================
// Main Education Page
// =====================================================

interface EducationPageProps {
  userId?: string;
}

export const EducationPage: React.FC<EducationPageProps> = React.memo(({ userId: _userId }) => {
  const [activeTab, setActiveTab] = useState<'cursos' | 'trilhas' | 'meus'>('cursos');
  const [categoryFilter, setCategoryFilter] = useState<CourseCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { courses, trails, enrolledCourses, loading, stats, enrollInCourse } = useEducacao();

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, categoryFilter]);

  const handleEnroll = useCallback(async (courseId: string) => {
    await enrollInCourse(courseId);
  }, [enrollInCourse]);

  const tabs = [
    { id: 'cursos' as const, label: 'Cursos', icon: GraduationCap },
    { id: 'trilhas' as const, label: 'Trilhas', icon: Layers },
    { id: 'meus' as const, label: 'Meus Cursos', icon: BookOpen },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div {...fadeIn} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Educação Permanente</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cursos, trilhas formativas e oficinas de qualificação</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-900/20 p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Cursos Disponíveis</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalCourses}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Trilhas Formativas</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTrails}</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-900/20 p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Em Andamento</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.inProgress}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/20 p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Concluídos</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
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

        {/* Filters (courses tab only) */}
        {activeTab === 'cursos' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar cursos..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${categoryFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
              >
                Todos
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${categoryFilter === cat ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'cursos' && (
          filteredCourses.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <GraduationCap size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhum curso disponível</p>
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
              ))}
            </motion.div>
          )
        )}

        {/* Trails Tab */}
        {activeTab === 'trilhas' && (
          trails.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <Layers size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhuma trilha disponível</p>
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
              {trails.map(trail => <TrailCard key={trail.id} trail={trail} />)}
            </motion.div>
          )
        )}

        {/* My Courses Tab */}
        {activeTab === 'meus' && (
          enrolledCourses.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <BookOpen size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Você ainda não está inscrito em nenhum curso</p>
              <button onClick={() => setActiveTab('cursos')} className="mt-3 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline">
                Explorar Cursos
              </button>
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
              {enrolledCourses.map(course => (
                <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
              ))}
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  );
});
