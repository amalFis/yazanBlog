import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SendNewsletterData {
  title: string;
  content: string;
  type: 'article' | 'company';
}

export const useSendNewsletter = () => {
  return useMutation({
    mutationFn: async ({ title, content, type }: SendNewsletterData) => {
      // 1. جلب قائمة المشتركين من Supabase
      const { data: subscribers, error: subscribersError } = await supabase
        .from('newsletter_subscribers')
        .select('email, name')
        .eq('status', 'active');

      if (subscribersError) {
        throw subscribersError;
      }
      if (!subscribers || subscribers.length === 0) {
        throw new Error('لا يوجد مشتركون في النشرة البريدية');
      }

      // 2. استدعاء الـ Edge Function مع method و headers و JSON.stringify للـ body
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          type,
          subscribers, // مصفوفة المشتركين كما جلبناها أعلاه
        }),
      });

      if (error) {
        throw error;
      }
      return data;
    },
  });
};
