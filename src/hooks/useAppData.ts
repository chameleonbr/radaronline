import { useState, useCallback, useEffect } from 'react';
import {
    Action,
    TeamMember,
    Objective,
    Activity,
} from '../types';
import * as dataService from '../services/dataService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/common/Toast';
import {
    DEMO_ACTIONS,
    DEMO_TEAM,
    DEMO_OBJECTIVES,
    DEMO_ACTIVITIES
} from '../data/mockData';

// Mock utils for now to ensure compilation, or import if identified
const CACHE_KEYS = {
    ACTIONS: 'actions',
    TEAMS: 'teams',
    OBJECTIVES: 'objectives',
    ACTIVITIES: 'activities'
};

const getCache = <T>(key: string, micro: string): T | null => {
    try {
        const item = sessionStorage.getItem(`radar_${key}_${micro}`);
        return item ? JSON.parse(item) : null;
    } catch { return null; }
};

const setCache = (key: string, data: any, micro: string) => {
    try {
        sessionStorage.setItem(`radar_${key}_${micro}`, JSON.stringify(data));
    } catch { }
};

const log = (scope: string, msg: string) => console.log(`[${scope}] ${msg}`);
const logError = (scope: string, msg: string, err: any) => console.error(`[${scope}] ${msg}`, err);

// Helper para filtrar ações órfãs
const filterOrphanedActions = (actions: Action[], activitiesByObj: Record<number, Activity[]>) => {
    const allActivityIds = new Set<string>();
    Object.values(activitiesByObj).forEach(activities => {
        activities.forEach(a => allActivityIds.add(String(a.id)));
    });
    return actions.filter(action => allActivityIds.has(String(action.activityId)));
};

export function useAppData() {
    const { user, isDemoMode: isDemo } = useAuth();
    const { showToast } = useToast();

    // State
    const [actions, setActions] = useState<Action[]>([]);
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [activities, setActivities] = useState<Record<number, Activity[]>>({});
    const [teamsByMicro, setTeamsByMicro] = useState<Record<string, TeamMember[]>>({});

    const [isDataLoading, setIsDataLoading] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);

    // Selection State
    const [selectedObjective, setSelectedObjective] = useState<number>(0);
    const [selectedActivity, setSelectedActivity] = useState<string>('');

    // Derived State (memoized logic should happen in components, but base getters here)
    const currentTeam = user?.microregiaoId ? (teamsByMicro[user.microregiaoId] || []) : [];

    // -- Actions --

    const loadData = useCallback(async (forceRefresh = false) => {
        // Se não estiver autenticado, não carrega (o AuthContext deve lidar com redirect)
        if (!user && !isDemo) return;

        setIsDataLoading(true);
        setDataError(null);

        try {
            // 1. DEMO MODE
            if (isDemo) {
                setActions(DEMO_ACTIONS);
                setTeamsByMicro(DEMO_TEAM);
                setObjectives(DEMO_OBJECTIVES);
                setActivities(DEMO_ACTIVITIES);

                // Setup initial selection
                if (DEMO_OBJECTIVES.length > 0) {
                    setSelectedObjective(DEMO_OBJECTIVES[0].id);
                    const firstObjActs = DEMO_ACTIVITIES[DEMO_OBJECTIVES[0].id] || [];
                    if (firstObjActs.length > 0) setSelectedActivity(firstObjActs[0].id);
                }

                setIsDataLoading(false);
                return;
            }

            // 2. REAL MODE
            const microId = user?.role === 'admin' || user?.role === 'superadmin' ? undefined : user?.microregiaoId;
            const cacheKey = microId || 'all';

            // Cache Check
            if (!forceRefresh) {
                const [cachedActions, cachedTeams, cachedObjs, cachedActs] = [
                    getCache<Action[]>(CACHE_KEYS.ACTIONS, cacheKey),
                    getCache<Record<string, TeamMember[]>>(CACHE_KEYS.TEAMS, cacheKey),
                    getCache<Objective[]>(CACHE_KEYS.OBJECTIVES, cacheKey),
                    getCache<Record<number, Activity[]>>(CACHE_KEYS.ACTIVITIES, cacheKey)
                ];

                if (cachedActions && cachedTeams && cachedObjs && cachedActs) {
                    log('useAppData', '⚡ Using cached data');
                    setActions(cachedActions);
                    setTeamsByMicro(cachedTeams);
                    setObjectives(cachedObjs);
                    setActivities(cachedActs);
                    setIsDataLoading(false);

                    // Initial selection from cache
                    if (cachedObjs.length > 0 && selectedObjective === 0) {
                        setSelectedObjective(cachedObjs[0].id);
                        const firstActs = cachedActs[cachedObjs[0].id] || [];
                        if (firstActs.length > 0) setSelectedActivity(firstActs[0].id);
                    }

                    // Background refresh implicitly handled by next steps if we wanted "stale-while-revalidate",
                    // but for now we follow the existing logic which seems to prioritize cache OR fetch.
                    // To be safer, we can return here or continue to fetch in background.
                    // For this refactor, let's respect the "load only if needed" pattern unless generic.
                    // IF we want background update:
                    // fetchAndSetData(microId, cacheKey); 
                    // return; 
                }
            }

            // Fetch
            const [actionsData, teamsData, objectivesData, activitiesData] = await Promise.all([
                dataService.loadActions(microId),
                dataService.loadTeams(microId),
                dataService.loadObjectives(microId),
                dataService.loadActivities(microId),
            ]);

            const validActions = filterOrphanedActions(actionsData, activitiesData);

            // Save Cache
            setCache(CACHE_KEYS.ACTIONS, validActions, cacheKey);
            setCache(CACHE_KEYS.TEAMS, teamsData, cacheKey);
            setCache(CACHE_KEYS.OBJECTIVES, objectivesData, cacheKey);
            setCache(CACHE_KEYS.ACTIVITIES, activitiesData, cacheKey);

            // Update State
            setActions(validActions);
            setTeamsByMicro(teamsData);
            setObjectives(objectivesData);
            setActivities(activitiesData);

            // Fix Selection Logic
            if (objectivesData.length > 0) {
                // Keep current if valid, else first
                const nextObjId = objectivesData.some((o: Objective) => o.id === selectedObjective)
                    ? selectedObjective
                    : objectivesData[0].id;

                // We only change if it's different (react handles this check too but good for logic)
                if (nextObjId !== selectedObjective) setSelectedObjective(nextObjId);

                const acts = activitiesData[nextObjId] || [];
                if (acts.length > 0) {
                    const actExists = acts.some((a: Activity) => a.id === selectedActivity);
                    if (!actExists) setSelectedActivity(acts[0].id);
                } else {
                    setSelectedActivity('');
                }
            } else {
                setSelectedObjective(0);
                setSelectedActivity('');
            }

        } catch (error: any) {
            logError('useAppData', 'Error loading data', error);
            setDataError(error.message || 'Erro ao carregar dados');
            showToast('Erro ao atualizar dados. Verifique a conexão.', 'error');
        } finally {
            setIsDataLoading(false);
        }
    }, [user, isDemo, selectedObjective, selectedActivity, showToast]);

    // Initial Load
    useEffect(() => {
        loadData();
    }, [loadData]);


    // Actions CRUD Helpers (Wrappers needing access to state for optimistic updates)
    const refreshActions = async () => {
        // Simplistic refresh for now - ideally we specific optimized updates
        const microId = user?.role === 'admin' || user?.role === 'superadmin' ? undefined : user?.microregiaoId;
        if (!microId && !user && !isDemo) return;

        const newActions = await dataService.loadActions(microId);
        // We need activities to filter orphans, using current state
        const valid = filterOrphanedActions(newActions, activities);
        setActions(valid);
        setCache(CACHE_KEYS.ACTIONS, valid, microId || 'all');
    };

    return {
        // Data
        actions,
        setActions, // Expose setter for optimistic updates
        objectives,
        setObjectives,
        activities,
        setActivities,
        teamsByMicro,
        setTeamsByMicro,
        currentTeam,

        // Status
        isDataLoading,
        dataError,
        loadData,
        refreshActions,

        // Selection
        selectedObjective,
        setSelectedObjective,
        selectedActivity,
        setSelectedActivity,
    };
}
