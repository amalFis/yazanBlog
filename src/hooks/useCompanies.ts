
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Founder {
  id: string;
  name: string;
  title: string;
  image_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  description: string;
  logo_url?: string;
  content?: string;
  founders?: Founder[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export const useCompanies = (includeStatus?: 'all' | 'published') => {
  return useQuery({
    queryKey: ['companies', includeStatus],
    queryFn: async () => {
      let query = supabase
        .from('companies')
        .select(`
          *,
          founders (
            id,
            name,
            title,
            image_url,
            linkedin_url,
            twitter_url
          )
        `);
      
      if (includeStatus === 'published') {
        query = query.eq('status', 'published');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Company[];
    },
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          founders (
            id,
            name,
            title,
            image_url,
            linkedin_url,
            twitter_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Company;
    },
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'founders'>) => {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Company> & { id: string }) => {
      const { data, error } = await supabase
        .from('companies')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};
