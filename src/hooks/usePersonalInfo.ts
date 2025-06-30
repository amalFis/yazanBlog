
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PersonalInfo {
  id: string;
  name: string;
  title: string;
  bio: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export const usePersonalInfo = () => {
  return useQuery({
    queryKey: ['personal-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personal_info')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as PersonalInfo | null;
    },
  });
};

export const useUpdatePersonalInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<PersonalInfo>) => {
      // Get the first record to update
      const { data: existing } = await supabase
        .from('personal_info')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('personal_info')
          .update(updates)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Insert new record if none exists
        const requiredFields = {
          name: updates.name || 'اسم افتراضي',
          title: updates.title || 'مسمى وظيفي',
          bio: updates.bio || 'نبذة شخصية'
        };
        
        const { data, error } = await supabase
          .from('personal_info')
          .insert({ ...requiredFields, ...updates })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-info'] });
    },
  });
};
