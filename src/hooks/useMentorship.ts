import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Mentor,
  Mentee as _Mentee,
  MentorshipMatch,
  MentorshipSession,
  MentorshipGoal,
  MentorshipBadge,
  MentorProfile,
  MentorshipSpecialty,
  MentorAvailability,
} from '../types/mentorship.types';

// =====================================================
// DTO → Domain Mappers
// =====================================================

function mapProfile(row: Record<string, unknown>): MentorProfile {
  return {
    id: row.id as string,
    fullName: row.full_name as string | null,
    avatarUrl: row.avatar_url as string | null,
    jobTitle: row.job_title as string | null,
  };
}

function mapMentor(row: Record<string, unknown>, profile?: MentorProfile, avail?: MentorAvailability[]): Mentor {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    bio: row.bio as string | null,
    yearsExperience: row.years_experience as number,
    municipality: row.municipality as string | null,
    organization: row.organization as string | null,
    specialties: (row.specialties || []) as MentorshipSpecialty[],
    maxMentees: row.max_mentees as number,
    currentMentees: row.current_mentees as number,
    isActive: row.is_active as boolean,
    isVerified: row.is_verified as boolean,
    totalSessions: row.total_sessions as number,
    totalHours: row.total_hours as number,
    avgRating: row.avg_rating as number,
    ratingCount: row.rating_count as number,
    linkedinUrl: row.linkedin_url as string | null,
    availabilityNotes: row.availability_notes as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    profile,
    availability: avail,
  };
}

// =====================================================
// Hooks
// =====================================================

export function useMentors(filters?: {
  specialty?: MentorshipSpecialty;
  municipality?: string;
  verifiedOnly?: boolean;
}) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('mentors').select('*').eq('is_active', true);

      if (filters?.verifiedOnly) query = query.eq('is_verified', true);
      if (filters?.municipality) query = query.eq('municipality', filters.municipality);

      const { data, error: dbError } = await query.order('avg_rating', { ascending: false });
      if (dbError) throw dbError;
      if (!data?.length) { setMentors([]); return; }

      // Fetch profiles
      const userIds = data.map((m: Record<string, unknown>) => m.user_id as string);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, job_title')
        .in('id', userIds);

      const profileMap = new Map((profiles || []).map((p: Record<string, unknown>) => [p.id, mapProfile(p)]));

      let mapped = data.map((m: Record<string, unknown>) => mapMentor(m, profileMap.get(m.user_id as string)));

      // Client-side specialty filter
      if (filters?.specialty) {
        mapped = mapped.filter(m => m.specialties.includes(filters.specialty!));
      }

      setMentors(mapped);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mentores');
    } finally {
      setLoading(false);
    }
  }, [filters?.specialty, filters?.municipality, filters?.verifiedOnly]);

  useEffect(() => { void fetchMentors(); }, [fetchMentors]);
  return { mentors, loading, error, refetch: fetchMentors };
}

export function useMentorProfile(userId: string | undefined) {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('mentors')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (data) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, job_title')
            .eq('id', userId)
            .maybeSingle();

          setMentor(mapMentor(data, profile ? mapProfile(profile) : undefined));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return { mentor, loading };
}

export function useMentorshipMatches(userId: string | undefined) {
  const [matches, setMatches] = useState<MentorshipMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('mentorship_matches')
          .select('*')
          .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (!data?.length) { setMatches([]); return; }

        setMatches(data.map((m: Record<string, unknown>) => ({
          id: m.id as string,
          mentorId: m.mentor_id as string,
          menteeId: m.mentee_id as string,
          status: m.status as MentorshipMatch['status'],
          matchScore: m.match_score as number | null,
          matchedSpecialties: (m.matched_specialties || []) as MentorshipSpecialty[],
          startDate: m.start_date as string | null,
          endDate: m.end_date as string | null,
          goals: m.goals as string | null,
          currentPhase: m.current_phase as MentorshipMatch['currentPhase'],
          phaseProgress: m.phase_progress as number,
          createdAt: m.created_at as string,
        })));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return { matches, loading };
}

export function useMentorshipSessions(matchId: string | undefined) {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('mentorship_sessions')
          .select('*')
          .eq('match_id', matchId)
          .order('session_number');

        setSessions((data || []).map((s: Record<string, unknown>) => ({
          id: s.id as string,
          matchId: s.match_id as string,
          sessionType: s.session_type as MentorshipSession['sessionType'],
          sessionNumber: s.session_number as number,
          scheduledAt: s.scheduled_at as string,
          durationMinutes: s.duration_minutes as number,
          status: s.status as MentorshipSession['status'],
          meetingLink: s.meeting_link as string | null,
          agenda: s.agenda as string | null,
          notes: s.notes as string | null,
          rating: s.rating as number | null,
          skillsPracticed: (s.skills_practiced || []) as MentorshipSpecialty[],
          actionItems: (s.action_items || []) as string[],
          completedAt: s.completed_at as string | null,
          createdAt: s.created_at as string,
        })));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [matchId]);

  return { sessions, loading };
}

export function useMentorshipGoals(matchId: string | undefined) {
  const [goals, setGoals] = useState<MentorshipGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('mentorship_goals')
          .select('*')
          .eq('match_id', matchId)
          .order('created_at');

        setGoals((data || []).map((g: Record<string, unknown>) => ({
          id: g.id as string,
          matchId: g.match_id as string,
          title: g.title as string,
          description: g.description as string | null,
          specialty: g.specialty as MentorshipSpecialty | null,
          targetDate: g.target_date as string | null,
          status: g.status as MentorshipGoal['status'],
          progressPercentage: g.progress_percentage as number,
          completedAt: g.completed_at as string | null,
          createdAt: g.created_at as string,
        })));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [matchId]);

  return { goals, loading };
}

export function useMentorshipBadges(userId: string | undefined) {
  const [badges, setBadges] = useState<MentorshipBadge[]>([]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('mentorship_badges')
          .select('*')
          .eq('user_id', userId)
          .order('earned_at', { ascending: false });

        setBadges((data || []).map((b: Record<string, unknown>) => ({
          id: b.id as string,
          userId: b.user_id as string,
          badgeType: b.badge_type as string,
          badgeName: b.badge_name as string,
          badgeDescription: b.badge_description as string | null,
          badgeIcon: b.badge_icon as string | null,
          earnedAt: b.earned_at as string,
          specialty: b.specialty as MentorshipSpecialty | null,
        })));
      } catch {
        // silently fail
      }
    })();
  }, [userId]);

  return { badges };
}

export function useRequestMentorship() {
  const [requesting, setRequesting] = useState(false);

  const requestMentorship = useCallback(async (mentorId: string, menteeId: string, specialties: MentorshipSpecialty[], goals: string) => {
    try {
      setRequesting(true);
      const { error } = await supabase
        .from('mentorship_matches')
        .insert({
          mentor_id: mentorId,
          mentee_id: menteeId,
          status: 'pending',
          matched_specialties: specialties,
          goals,
          current_phase: 'diagnostic',
          phase_progress: 0,
        });

      return !error;
    } catch {
      return false;
    } finally {
      setRequesting(false);
    }
  }, []);

  return { requestMentorship, requesting };
}
