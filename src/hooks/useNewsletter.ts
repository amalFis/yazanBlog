
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
      // الحصول على قائمة المشتركين
      const { data: subscribers, error: subscribersError } = await supabase
        .from('newsletter_subscribers')
        .select('email, name')
        .eq('status', 'active');

      if (subscribersError) throw subscribersError;

      if (!subscribers || subscribers.length === 0) {
        throw new Error('لا يوجد مشتركون في النشرة البريدية');
      }

      // إرسال النشرة البريدية
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          title,
          content,
          type,
          subscribers
        }
      });

      if (error) throw error;
      return data;
    },
  });
};
