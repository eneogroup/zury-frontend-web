'use client';

import { useState, useEffect } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export function useFilters() {
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [quartiers, setQuartiers] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        // Charger catégories
        const catRes = await fetch(`${API_URL}/api/v1/categories/`);
        const catJson = await catRes.json();
        const catData = catJson.success ? catJson.data : catJson;
        setCategories(Array.isArray(catData) ? catData : []);

        // Charger quartiers
        const quartRes = await fetch(`${API_URL}/api/v1/quartiers/`);
        const quartJson = await quartRes.json();
        const quartData = quartJson.success ? quartJson.data : quartJson;
        setQuartiers(Array.isArray(quartData) ? quartData : []);
      } catch (error) {
        console.error('Error loading filters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  return { categories, quartiers, loading };
}