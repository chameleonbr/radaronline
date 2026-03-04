import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Material, MaterialType, MaterialCategory } from '../types/repository.types';

// =====================================================
// DTO → Domain Mapper
// =====================================================

function mapMaterial(row: Record<string, unknown>): Material {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    type: row.type as MaterialType,
    category: row.category as MaterialCategory,
    author: row.author as string,
    fileUrl: row.file_url as string | null,
    fileSize: row.file_size as number | null,
    downloads: (row.downloads as number) || 0,
    views: (row.views as number) || 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// =====================================================
// Hook
// =====================================================

export interface MaterialFormData {
  title: string;
  description: string;
  type: MaterialType;
  category: MaterialCategory;
  author: string;
  url?: string;
}

export function useRepository() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setMaterials((data || []).map(mapMaterial));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar materiais');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchMaterials(); }, [fetchMaterials]);

  const addMaterial = useCallback(async (data: MaterialFormData): Promise<boolean> => {
    try {
      const { error } = await supabase.from('materials').insert({
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        author: data.author,
        file_url: data.url || null,
      });
      if (error) throw error;
      await fetchMaterials();
      return true;
    } catch {
      return false;
    }
  }, [fetchMaterials]);

  const stats = {
    total: materials.length,
    byType: {
      video: materials.filter(m => m.type === 'video').length,
      manual: materials.filter(m => m.type === 'manual').length,
      faq: materials.filter(m => m.type === 'faq').length,
      template: materials.filter(m => m.type === 'template').length,
      legislacao: materials.filter(m => m.type === 'legislacao').length,
    },
  };

  return { materials, loading, error, stats, addMaterial, refetch: fetchMaterials };
}
