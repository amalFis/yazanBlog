
-- إنشاء جدول المؤسسين
CREATE TABLE IF NOT EXISTS founders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- إنشاء فهرس على company_id لتسريع الاستعلامات
CREATE INDEX IF NOT EXISTS idx_founders_company_id ON founders(company_id);

-- تعديل جدول الشركات لإزالة الحقول القديمة غير المستخدمة
ALTER TABLE companies DROP COLUMN IF EXISTS founding_story;
ALTER TABLE companies DROP COLUMN IF EXISTS founders;
ALTER TABLE companies DROP COLUMN IF EXISTS milestones;

-- إضافة حقل المحتوى للشركات
ALTER TABLE companies ADD COLUMN IF NOT EXISTS content TEXT;
