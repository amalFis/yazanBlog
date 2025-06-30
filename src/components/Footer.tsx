import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSubscribeToNewsletter } from "@/hooks/useNewsletterSubscribers";
import { useToast } from "@/hooks/use-toast";
import { Linkedin, Twitter, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const { data: siteSettings } = useSiteSettings();
  const { toast } = useToast();
  const subscribeToNewsletter = useSubscribeToNewsletter();
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      await subscribeToNewsletter.mutateAsync({ name: name.trim(), email: email.trim() });
      
      toast({
        title: "تم الاشتراك بنجاح!",
        description: "شكراً لك على الاشتراك في النشرة البريدية.",
      });
      
      setEmail("");
      setName("");
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "خطأ في الاشتراك",
        description: "حدث خطأ أثناء الاشتراك، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* القسم الأيسر: الوصف المختصر والروابط */}
          <div className="order-1">
            <h3 className="text-2xl font-bold mb-4">يزن صالح</h3>
            <p className="text-primary-foreground/90 mb-6 leading-relaxed text-lg">
              مدونة شخصية متخصصة في إدارة المنتجات الرقمية والنمو في الشركات الناشئة. 
              أشارك تجاربي وخبراتي في عالم ريادة الأعمال والتكنولوجيا.
            </p>
            
            {/* أيقونات التواصل الاجتماعي */}
            <div className="flex gap-4">
              {siteSettings?.linkedin_url && (
                <a
                  href={siteSettings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              
              {siteSettings?.twitter_url && (
                <a
                  href={siteSettings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
                  title="Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              
              {siteSettings?.whatsapp_number && (
                <a
                  href={`https://wa.me/${siteSettings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
              )}
              
              {siteSettings?.contact_email && (
                <a
                  href={`mailto:${siteSettings.contact_email}`}
                  className="w-12 h-12 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
                  title="Email"
                >
                  <Mail className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
          
          {/* القسم الأيمن: الاشتراك في النشرة البريدية */}
          <div className="order-2">
            <h2 className="text-2xl font-bold mb-4">
              اشترك في النشرة البريدية
            </h2>
            <p className="text-primary-foreground/90 mb-6 leading-relaxed">
              احصل على آخر المقالات والرؤى مباشرة في بريدك الإلكتروني
            </p>
            
            {/* نموذج الاشتراك */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* الحقول والزر في صف واحد */}
              <div className="flex flex-col lg:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 h-12 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 focus:bg-white transition-colors"
                  dir="rtl"
                  style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
                />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 focus:bg-white transition-colors"
                  dir="rtl"
                  style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
                />
                <Button 
                  type="submit" 
                  className="h-12 px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap" 
                  disabled={subscribeToNewsletter.isPending}
                  style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
                >
                  {subscribeToNewsletter.isPending ? "جاري الاشتراك..." : "اشترك"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 mt-12 text-center">
          <p className="text-primary-foreground/70">
            © 2024 يزن صالح. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;