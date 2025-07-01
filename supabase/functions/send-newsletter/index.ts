import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterData {
  title: string;
  content: string;
  type: 'article' | 'company';
  subscribers: Array<{ email: string; name: string }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // parse and validate body
    const { title, content, type, subscribers }: NewsletterData = await req.json();
    if (!Array.isArray(subscribers) || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ error: "لا يوجد مشتركون في النشرة البريدية" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending newsletter to", subscribers.length, "subscribers");

    // send each email
    const FROM_ADDRESS = Deno.env.get("EMAIL_FROM")!;         // e.g. "alyazansal@gmail.com"
    const FROM_NAME    = Deno.env.get("EMAIL_FROM_NAME")!;   // e.g. "نشرة الموقع"

    const results = await Promise.allSettled(
      subscribers.map(subscriber => {
        const html = `
          <html dir="rtl">
            <body style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
              <div style="max-width: 600px; margin:0 auto; padding:20px;">
                <h1 style="color:#333; border-bottom:2px solid #0066cc; padding-bottom:10px;">
                  ${type === 'article' ? 'مقال جديد' : 'رحلة شركة جديدة'}
                </h1>
                <p style="font-size:16px; color:#666;">مرحباً ${subscriber.name}،</p>
                <p style="font-size:16px; color:#333;">
                  ${type === 'article'
                    ? 'تم نشر مقال جديد بعنوان:'
                    : 'تم نشر رحلة شركة جديدة بعنوان:'}
                </p>
                <h2 style="color:#0066cc; margin:20px 0;">${title}</h2>
                <div style="background:#f9f9f9; padding:20px; border-radius:8px; margin:20px 0;">
                  ${content.substring(0, 300)}...
                </div>
                <div style="text-align:center; margin:30px 0;">
                  <a href="${Deno.env.get('SITE_URL')!}"
                     style="background:#0066cc; color:white; padding:12px 24px; text-decoration:none; border-radius:6px;">
                    اقرأ المزيد
                  </a>
                </div>
                <hr style="margin:30px 0; border:none; border-top:1px solid #eee;">
                <p style="font-size:14px; color:#999; text-align:center;">
                  تم إرسال هذه الرسالة لأنك مشترك في النشرة البريدية لدينا.<br>
                  إذا كنت لا ترغب في استقبال هذه الرسائل، يمكنك إلغاء الاشتراك في أي وقت.
                </p>
              </div>
            </body>
          </html>
        `;

        return resend.emails.send({
          from: `${FROM_NAME} <${FROM_ADDRESS}>`,
          to: [subscriber.email],
          reply_to: FROM_ADDRESS,
          subject: `${type === 'article' ? 'مقال جديد' : 'رحلة شركة جديدة'}: ${title}`,
          html
        });
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed     = results.filter(r => r.status === 'rejected').length;
    console.log(`Newsletter result — sent: ${successful}, failed: ${failed}`);

    return new Response(
      JSON.stringify({ success: true, sent: successful, failed }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err: any) {
    console.error("Error in send-newsletter:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
