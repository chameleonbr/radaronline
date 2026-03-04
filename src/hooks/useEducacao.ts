import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Course, Trail, EducationStats, CourseCategory, CourseLevel, CourseFormat } from '../types/education.types';

// =====================================================
// DTO → Domain Mappers
// =====================================================

function mapCourse(row: Record<string, unknown>): Course {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    duration: row.duration as string,
    enrolled: (row.enrolled as number) || 0,
    category: row.category as CourseCategory,
    level: row.level as CourseLevel,
    format: row.format as CourseFormat,
    url: row.url as string | null,
    progress: (row.progress as number) || 0,
    createdAt: row.created_at as string,
  };
}

function mapTrail(row: Record<string, unknown>): Trail {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    coursesCount: (row.courses_count as number) || 0,
    totalHours: (row.total_hours as number) || 0,
    enrolled: (row.enrolled as number) || 0,
    progress: (row.progress as number) || 0,
    createdAt: row.created_at as string,
  };
}

// =====================================================
// Hook
// =====================================================

export interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  category: CourseCategory;
  level: CourseLevel;
  format: CourseFormat;
  url?: string;
}

export interface TrailFormData {
  title: string;
  description: string;
  coursesCount: number;
  totalHours: number;
}

export function useEducacao() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [coursesRes, trailsRes] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('trails').select('*').order('created_at', { ascending: false }),
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (trailsRes.error) throw trailsRes.error;

      setCourses((coursesRes.data || []).map(mapCourse));
      setTrails((trailsRes.data || []).map(mapTrail));

      // enrolled courses = those with progress > 0
      setEnrolledCourses(
        (coursesRes.data || []).filter((c: Record<string, unknown>) => (c.progress as number) > 0).map(mapCourse)
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de educação');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const stats: EducationStats = {
    totalCourses: courses.length,
    totalTrails: trails.length,
    inProgress: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
    completed: enrolledCourses.filter(c => c.progress >= 100).length,
  };

  const addCourse = useCallback(async (data: CourseFormData): Promise<boolean> => {
    try {
      const { error } = await supabase.from('courses').insert({
        title: data.title,
        description: data.description,
        duration: data.duration,
        category: data.category,
        level: data.level,
        format: data.format,
        url: data.url || null,
      });
      if (error) throw error;
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  const addTrail = useCallback(async (data: TrailFormData): Promise<boolean> => {
    try {
      const { error } = await supabase.from('trails').insert({
        title: data.title,
        description: data.description,
        courses_count: data.coursesCount,
        total_hours: data.totalHours,
      });
      if (error) throw error;
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [fetchData]);

  const enrollInCourse = useCallback(async (courseId: string): Promise<boolean> => {
    try {
      // Simple enrollment - just mark progress start
      const { error } = await supabase
        .from('courses')
        .update({ enrolled: courses.find(c => c.id === courseId)?.enrolled ?? 0 + 1 })
        .eq('id', courseId);
      if (error) throw error;
      await fetchData();
      return true;
    } catch {
      return false;
    }
  }, [courses, fetchData]);

  return { courses, trails, enrolledCourses, loading, error, stats, addCourse, addTrail, enrollInCourse, refetch: fetchData };
}
