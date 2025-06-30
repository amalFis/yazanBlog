
-- إنشاء جدول المعلومات الشخصية
CREATE TABLE personal_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إنشاء جدول الخبرات العملية
CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  duration VARCHAR(255) NOT NULL,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إنشاء جدول المقالات
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  category VARCHAR(255) NOT NULL,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إنشاء جدول رحلات الشركات
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  founding_story TEXT,
  founders VARCHAR(500),
  milestones TEXT[], -- مصفوفة من النصوص للمحطات المهمة
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إنشاء جدول المشتركين في النشرة
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إنشاء جدول إعدادات الموقع
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL,
  site_description TEXT,
  contact_email VARCHAR(255),
  linkedin_url TEXT,
  twitter_url TEXT,
  medium_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إنشاء جدول النشرات المرسلة
CREATE TABLE newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE
);

-- إدراج بيانات أولية للمعلومات الشخصية
INSERT INTO personal_info (name, title, bio, profile_image_url) VALUES 
('يزن صالح', 'خبير إدارة المنتجات والنمو في الشركات الناشئة', 
'أنا يزن صالح، خبير في إدارة المنتجات الرقمية والنمو في الشركات الناشئة بخبرة تزيد عن ٨ سنوات في هذا المجال. عملت مع العديد من الشركات الناشئة والمؤسسات التقنية في المنطقة العربية، وساهمت في بناء وتطوير منتجات رقمية حققت نجاحاً ملموساً في السوق.', 
'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face');

-- إدراج الخبرات العملية الأولية
INSERT INTO experiences (company, position, duration, logo_url, order_index) VALUES 
('شركة تقنية رائدة', 'مدير المنتجات الأول', '2022 - الحاضر', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop', 1),
('ستارت أب مبتكرة', 'رئيس قسم النمو', '2020 - 2022', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop', 2),
('منصة تكنولوجية', 'مدير منتجات', '2018 - 2020', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop', 3);

-- إدراج المقالات الأولية
INSERT INTO articles (title, excerpt, category, image_url, status) VALUES 
('كيفية بناء استراتيجية منتج ناجحة في الشركات الناشئة', 'دليل شامل لبناء استراتيجية منتج قوية تساعد الشركات الناشئة على النمو والتطور في السوق التنافسي. سنتناول الخطوات العملية والأدوات المطلوبة...', 'إدارة المنتجات', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop', 'published'),
('تجربتي في قيادة فرق النمو: دروس مستفادة من الميدان', 'نظرة عملية على التحديات والفرص في قيادة فرق النمو، مع تطبيقات عملية من تجارب حقيقية في الشركات الناشئة العربية...', 'النمو والتطوير', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop', 'published'),
('أهمية تحليل البيانات في اتخاذ القرارات الاستراتيجية', 'كيف تستفيد الشركات الناشئة من البيانات لاتخاذ قرارات مدروسة تساهم في نموها وتطورها. أمثلة عملية وأدوات مفيدة...', 'تحليل البيانات', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', 'published'),
('بناء ثقافة الابتكار في الفرق التقنية', 'استراتيجيات عملية لخلق بيئة عمل محفزة للإبداع والابتكار، وكيفية تطبيقها في الشركات الناشئة والمؤسسات التقنية...', 'القيادة والإدارة', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop', 'published');

-- إدراج رحلات الشركات الأولية
INSERT INTO companies (name, sector, description, logo_url, founding_story, founders, milestones, status) VALUES 
('تطبيق تِك', 'التكنولوجيا المالية', 'منصة دفع رقمية تهدف إلى تسهيل المعاملات المالية في المنطقة العربية من خلال حلول مبتكرة وآمنة. بدأت الشركة كفكرة بسيطة وتطورت لتصبح إحدى أهم منصات الدفع في المنطقة...', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop', 'بدأت فكرة تطبيق تِك في عام 2020 عندما واجه المؤسسون صعوبة في إجراء المعاملات المالية الرقمية بسهولة وأمان. قرروا إنشاء منصة تجمع بين البساطة والأمان لتصبح الحل الأمثل للمدفوعات الرقمية.', 'أحمد محمد وسارة علي', '{"2020: تأسيس الشركة وجمع الاستثمار الأولي", "2021: إطلاق النسخة التجريبية مع 1000 مستخدم", "2022: الوصول إلى 50,000 مستخدم نشط", "2023: توسع الخدمات لتشمل 5 دول عربية", "2024: جمع استثمار من الفئة A بقيمة 10 مليون دولار"}', 'published'),
('منصة نمو', 'التعليم الإلكتروني', 'منصة تعليمية تركز على تطوير المهارات المهنية والتقنية للشباب العربي من خلال محتوى عالي الجودة. تجمع المنصة بين التعلم التفاعلي والتطبيق العملي لضمان فعالية التعلم...', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop', 'وُلدت فكرة منصة نمو من إيمان المؤسسين بأهمية التعليم المستمر وتطوير المهارات في عصر التحول الرقمي. هدفوا إلى سد الفجوة بين التعليم الأكاديمي ومتطلبات سوق العمل.', 'محمد خالد وليلى حسن', '{"2021: تأسيس المنصة وإطلاق أول 10 دورات", "2022: وصول عدد المتعلمين إلى 25,000", "2023: شراكة مع 50 خبير في مختلف المجالات", "2024: إطلاق برنامج الشهادات المعتمدة"}', 'published'),
('تطبيق صحتي', 'التكنولوجيا الصحية', 'تطبيق صحي شامل يوفر خدمات طبية رقمية للمستخدمين، من الاستشارات الطبية عن بُعد إلى إدارة الملفات الصحية. يهدف إلى جعل الرعاية الصحية أكثر إتاحة وسهولة...', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=200&fit=crop', 'نشأت فكرة تطبيق صحتي من حاجة ملحة لجعل الخدمات الصحية أكثر إتاحة ووصولاً للجميع، خاصة في المناطق النائية.', 'د. فاطمة أحمد ومحمد سالم', '{"2022: تأسيس الشركة والحصول على التراخيص الطبية", "2023: إطلاق النسخة الأولى مع 500 طبيب", "2024: الوصول إلى 100,000 مستخدم نشط"}', 'published'),
('منصة توصيل', 'اللوجستيات والتوصيل', 'منصة ذكية لخدمات التوصيل تربط بين التجار والعملاء من خلال شبكة واسعة من السائقين. تتميز بالسرعة والموثوقية في التوصيل مع تتبع مباشر للطلبات...', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop', 'ظهرت فكرة منصة توصيل لحل مشكلة التوصيل السريع والموثوق في المدن الكبيرة، مع التركيز على خدمة العملاء.', 'عمر خالد ونور الدين', '{"2021: تأسيس الشركة وبناء الفريق الأساسي", "2022: إطلاق الخدمة في 3 مدن رئيسية", "2023: شراكة مع أكثر من 1000 متجر", "2024: توسع الخدمات لتشمل 10 مدن"}', 'published');

-- إدراج إعدادات الموقع الأولية
INSERT INTO site_settings (site_name, site_description, contact_email, linkedin_url, twitter_url, medium_url) VALUES 
('يزن صالح', 'مدونة شخصية متخصصة في إدارة المنتجات الرقمية والنمو في الشركات الناشئة', 'yazan@example.com', '#', '#', '#');

-- إنشاء RLS policies لحماية البيانات
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة العامة للمحتوى
CREATE POLICY "Allow public read access to personal_info" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access to experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access to published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access to published companies" ON companies FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access to site_settings" ON site_settings FOR SELECT USING (true);

-- سياسات الكتابة للمشتركين (النشرة)
CREATE POLICY "Allow public insert to newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- سياسات الإدارة الكاملة (ستحتاج تعديل حسب نظام المصادقة)
-- هذه السياسات ستحتاج تعديل لاحقاً بناءً على نظام المصادقة المستخدم
CREATE POLICY "Allow admin full access to personal_info" ON personal_info FOR ALL USING (true);
CREATE POLICY "Allow admin full access to experiences" ON experiences FOR ALL USING (true);
CREATE POLICY "Allow admin full access to articles" ON articles FOR ALL USING (true);
CREATE POLICY "Allow admin full access to companies" ON companies FOR ALL USING (true);
CREATE POLICY "Allow admin full access to newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (true);
CREATE POLICY "Allow admin full access to site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Allow admin full access to newsletters" ON newsletters FOR ALL USING (true);
