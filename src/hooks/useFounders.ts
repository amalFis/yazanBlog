
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Founder {
  id: string;
  name: string;
  title: string;
  image_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  company_id: string;
  created_at: string;
}

export const useFounders = (companyId: string) => {
  return useQuery({
    queryKey: ['founders', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('founders')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Founder[];
    },
    enabled: !!companyId,
  });
};

export const useCreateFounder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (founder: Omit<Founder, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('founders')
        .insert([founder])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founders'] });
    },
  });
};

export const useUpdateFounder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Founder> & { id: string }) => {
      const { data, error } = await supabase
        .from('founders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founders'] });
    },
  });
};

export const useDeleteFounder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('founders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founders'] });
    },
  });
};
