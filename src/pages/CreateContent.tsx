
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateArticle, useUpdateArticle, useArticle } from '@/hooks/useArticles';
import { useCreateCompany, useUpdateCompany, useCompany } from '@/hooks/useCompanies';
import { useCreateFounder, useUpdateFounder, useDeleteFounder, useFounders } from '@/hooks/useFounders';
import { useImageUpload } from '@/hooks/useImageUpload';
import RichTextEditor from '@/components/RichTextEditor';
import { ArrowLeft, Save, Upload, Plus, Trash2, Linkedin, Twitter } from 'lucide-react';

interface FounderForm {
  id?: string;
  name: string;
  title: string;
  image_url: string;
  linkedin_url: string;
  twitter_url: string;
}

const CreateContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadImage, isUploading } = useImageUpload();
  const [searchParams] = useSearchParams();
  
  const editType = searchParams.get('edit');
  const editId = searchParams.get('id');
  const defaultTab = searchParams.get('tab') || (editType === 'article' ? 'article' : editType === 'company' ? 'company' : 'article');
  
  const createArticle = useCreateArticle();
  const createCompany = useCreateCompany();
  const updateArticle = useUpdateArticle();
  const updateCompany = useUpdateCompany();
  const createFounder = useCreateFounder();
  const updateFounder = useUpdateFounder();
  const deleteFounder = useDeleteFounder();
  
  const { data: existingArticle } = useArticle(editType === 'article' && editId ? editId : '');
  const { data: existingCompany } = useCompany(editType === 'company' && editId ? editId : '');
  const { data: existingFounders } = useFounders(editType === 'company' && editId ? editId : '');

  // Article form state
  const [articleForm, setArticleForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image_url: '',
    status: 'draft' as 'draft' | 'published'
  });

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    name: '',
    sector: '',
    description: '',
    logo_url: '',
    content: '',
    status: 'draft' as 'draft' | 'published'
  });

  // Founders state
  const [founders, setFounders] = useState<FounderForm[]>([{
    name: '',
    title: '',
    image_url: '',
    linkedin_url: '',
    twitter_url: ''
  }]);

  // Load existing data for editing
  useEffect(() => {
    if (editType === 'article' && existingArticle) {
      setArticleForm({
        title: existingArticle.title || '',
        excerpt: existingArticle.excerpt || '',
        content: existingArticle.content || '',
        category: existingArticle.category || '',
        image_url: existingArticle.image_url || '',
        status: existingArticle.status || 'draft'
      });
    }
  }, [editType, existingArticle]);

  useEffect(() => {
    if (editType === 'company' && existingCompany) {
      setCompanyForm({
        name: existingCompany.name || '',
        sector: existingCompany.sector || '',
        description: existingCompany.description || '',
        logo_url: existingCompany.logo_url || '',
        content: existingCompany.content || '',
        status: existingCompany.status || 'draft'
      });
    }
  }, [editType, existingCompany]);

  useEffect(() => {
    if (editType === 'company' && existingFounders && existingFounders.length > 0) {
      setFounders(existingFounders.map(founder => ({
        id: founder.id,
        name: founder.name || '',
        title: founder.title || '',
        image_url: founder.image_url || '',
        linkedin_url: founder.linkedin_url || '',
        twitter_url: founder.twitter_url || ''
      })));
    }
  }, [editType, existingFounders]);

  const handleImageUpload = async (file: File, type: 'article' | 'company' | 'founder', founderIndex?: number) => {
    try {
      const imageUrl = await uploadImage(file, 'images');
      
      if (type === 'article') {
        setArticleForm(prev => ({ ...prev, image_url: imageUrl }));
      } else if (type === 'company') {
        setCompanyForm(prev => ({ ...prev, logo_url: imageUrl }));
      } else if (type === 'founder' && founderIndex !== undefined) {
        setFounders(prev => prev.map((founder, index) => 
          index === founderIndex ? { ...founder, image_url: imageUrl } : founder
        ));
      }
      
      toast({
        title: "تم رفع الصورة بنجاح!",
        description: "تم رفع الصورة وحفظ الرابط",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة",
        variant: "destructive"
      });
    }
  };

  const addFounder = () => {
    setFounders(prev => [...prev, {
      name: '',
      title: '',
      image_url: '',
      linkedin_url: '',
      twitter_url: ''
    }]);
  };

  const removeFounder = (index: number) => {
    if (founders.length > 1) {
      setFounders(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateFounderData = (index: number, field: keyof FounderForm, value: string) => {
    setFounders(prev => prev.map((founder, i) => 
      i === index ? { ...founder, [field]: value } : founder
    ));
  };

  const handleCreateOrUpdateArticle = async () => {
    try {
      if (!articleForm.title || !articleForm.excerpt || !articleForm.category) {
        toast({
          title: "بيانات ناقصة",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive"
        });
        return;
      }

      if (editType === 'article' && editId) {
        await updateArticle.mutateAsync({ id: editId, ...articleForm });
        toast({
          title: "تم تحديث المقال بنجاح!",
          description: "تم حفظ التعديلات على المقال",
        });
      } else {
        await createArticle.mutateAsync(articleForm);
        toast({
          title: "تم إنشاء المقال بنجاح!",
          description: "تم حفظ المقال وسيظهر في قائمة المقالات",
        });
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "خطأ في حفظ المقال",
        description: "حدث خطأ أثناء حفظ المقال",
        variant: "destructive"
      });
    }
  };

  const handleCreateOrUpdateCompany = async () => {
    try {
      if (!companyForm.name || !companyForm.sector || !companyForm.description) {
        toast({
          title: "بيانات ناقصة",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive"
        });
        return;
      }

      let savedCompany;
      
      if (editType === 'company' && editId) {
        savedCompany = await updateCompany.mutateAsync({ 
          id: editId, 
          ...companyForm
        });
        toast({
          title: "تم تحديث رحلة الشركة بنجاح!",
          description: "تم حفظ التعديلات على رحلة الشركة",
        });
      } else {
        savedCompany = await createCompany.mutateAsync(companyForm);
        toast({
          title: "تم إنشاء رحلة الشركة بنجاح!",
          description: "تم حفظ رحلة الشركة وستظهر في القائمة",
        });
      }

      // Handle founders
      const validFounders = founders.filter(f => f.name.trim() !== '');
      const companyId = savedCompany?.id || editId;

      if (companyId) {
        // If editing, delete existing founders first
        if (editType === 'company' && existingFounders) {
          for (const existingFounder of existingFounders) {
            await deleteFounder.mutateAsync(existingFounder.id);
          }
        }

        // Create new founders
        for (const founder of validFounders) {
          await createFounder.mutateAsync({
            ...founder,
            company_id: companyId
          });
        }
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "خطأ في حفظ رحلة الشركة",
        description: "حدث خطأ أثناء حفظ رحلة الشركة",
        variant: "destructive"
      });
    }
  };

  const pageTitle = editType === 'article' && editId ? 'تعديل المقال' : 
                   editType === 'company' && editId ? 'تعديل رحلة الشركة' : 
                   'إنشاء محتوى جديد';

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للوحة التحكم
            </Button>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={defaultTab} className="space-y-6" dir="rtl">
          {!editType && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="article">مقال جديد</TabsTrigger>
              <TabsTrigger value="company">رحلة شركة جديدة</TabsTrigger>
            </TabsList>
          )}

          {/* إنشاء/تعديل مقال */}
          <TabsContent value="article">
            <Card>
              <CardHeader>
                <CardTitle>{editType === 'article' && editId ? 'تعديل المقال' : 'إنشاء مقال جديد'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6" dir="rtl">
                <div className="space-y-2">
                  <label className="text-sm font-medium">عنوان المقال *</label>
                  <Input
                    value={articleForm.title}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل عنوان المقال"
                    dir="rtl"
                    style={{ direction: 'rtl', textAlign: 'right' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ملخص المقال *</label>
                  <Textarea
                    value={articleForm.excerpt}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="اكتب ملخصاً مختصراً عن المقال"
                    rows={3}
                    dir="rtl"
                    style={{ direction: 'rtl', textAlign: 'right' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">التصنيف *</label>
                  <Select value={articleForm.category} onValueChange={(value) => setArticleForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="اختر تصنيف المقال" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="إدارة المنتجات">إدارة المنتجات</SelectItem>
                      <SelectItem value="النمو والتطوير">النمو والتطوير</SelectItem>
                      <SelectItem value="تحليل البيانات">تحليل البيانات</SelectItem>
                      <SelectItem value="القيادة والإدارة">القيادة والإدارة</SelectItem>
                      <SelectItem value="ريادة الأعمال">ريادة الأعمال</SelectItem>
                      <SelectItem value="التكنولوجيا">التكنولوجيا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">صورة المقال</label>
                  <div className="flex flex-col gap-2">
                    <Input
                      value={articleForm.image_url}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="رابط الصورة أو ارفع صورة جديدة"
                      dir="rtl"
                    />
                    <label htmlFor="article-image-upload">
                      <Button variant="outline" size="sm" asChild disabled={isUploading}>
                        <span>
                          <Upload className="ml-2 h-4 w-4" />
                          {isUploading ? "جاري الرفع..." : "رفع صورة"}
                        </span>
                      </Button>
                      <input
                        id="article-image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'article');
                        }}
                      />
                    </label>
                  </div>
                  {articleForm.image_url && (
                    <img src={articleForm.image_url} alt="معاينة" className="w-32 h-32 object-cover rounded" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">محتوى المقال</label>
                  <RichTextEditor
                    value={articleForm.content}
                    onChange={(value) => setArticleForm(prev => ({ ...prev, content: value }))}
                    placeholder="اكتب محتوى المقال هنا..."
                    height="500px"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">حالة النشر</label>
                  <Select value={articleForm.status} onValueChange={(value: 'draft' | 'published') => setArticleForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreateOrUpdateArticle} disabled={createArticle.isPending || updateArticle.isPending} className="w-full">
                  <Save className="ml-2 h-4 w-4" />
                  {createArticle.isPending || updateArticle.isPending ? "جاري الحفظ..." : editType === 'article' && editId ? "حفظ التعديلات" : "حفظ المقال"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* إنشاء/تعديل رحلة شركة */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>{editType === 'company' && editId ? 'تعديل رحلة الشركة' : 'إنشاء رحلة شركة جديدة'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6" dir="rtl">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم الشركة *</label>
                  <Input
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم الشركة"
                    dir="rtl"
                    style={{ direction: 'rtl', textAlign: 'right' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">القطاع *</label>
                  <Select value={companyForm.sector} onValueChange={(value) => setCompanyForm(prev => ({ ...prev, sector: value }))}>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="اختر قطاع الشركة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="التكنولوجيا المالية">التكنولوجيا المالية</SelectItem>
                      <SelectItem value="التعليم الإلكتروني">التعليم الإلكتروني</SelectItem>
                      <SelectItem value="التكنولوجيا الصحية">التكنولوجيا الصحية</SelectItem>
                      <SelectItem value="اللوجستيات والتوصيل">اللوجستيات والتوصيل</SelectItem>
                      <SelectItem value="التجارة الإلكترونية">التجارة الإلكترونية</SelectItem>
                      <SelectItem value="التطبيقات الذكية">التطبيقات الذكية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">وصف الشركة *</label>
                  <Textarea
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="اكتب وصفاً شاملاً عن الشركة"
                    rows={4}
                    dir="rtl"
                    style={{ direction: 'rtl', textAlign: 'right' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">شعار الشركة</label>
                  <div className="flex flex-col gap-2">
                    <Input
                      value={companyForm.logo_url}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, logo_url: e.target.value }))}
                      placeholder="رابط الشعار أو ارفع صورة جديدة"
                      dir="rtl"
                    />
                    <label htmlFor="company-logo-upload">
                      <Button variant="outline" size="sm" asChild disabled={isUploading}>
                        <span>
                          <Upload className="ml-2 h-4 w-4" />
                          {isUploading ? "جاري الرفع..." : "رفع شعار"}
                        </span>
                      </Button>
                      <input
                        id="company-logo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'company');
                        }}
                      />
                    </label>
                  </div>
                  {companyForm.logo_url && (
                    <img src={companyForm.logo_url} alt="معاينة الشعار" className="w-32 h-32 object-cover rounded" />
                  )}
                </div>

                {/* نظام المؤسسين */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">المؤسسون</label>
                    <Button type="button" variant="outline" size="sm" onClick={addFounder}>
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة مؤسس
                    </Button>
                  </div>

                  {founders.map((founder, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">المؤسس {index + 1}</h4>
                          {founders.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFounder(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">اسم المؤسس</label>
                            <Input
                              value={founder.name}
                              onChange={(e) => updateFounderData(index, 'name', e.target.value)}
                              placeholder="اسم المؤسس"
                              dir="rtl"
                              style={{ direction: 'rtl', textAlign: 'right' }}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">المسمى الوظيفي</label>
                            <Input
                              value={founder.title}
                              onChange={(e) => updateFounderData(index, 'title', e.target.value)}
                              placeholder="مثال: الرئيس التنفيذي"
                              dir="rtl"
                              style={{ direction: 'rtl', textAlign: 'right' }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">صورة المؤسس</label>
                          <div className="flex flex-col gap-2">
                            <Input
                              value={founder.image_url}
                              onChange={(e) => updateFounderData(index, 'image_url', e.target.value)}
                              placeholder="رابط صورة المؤسس"
                              dir="rtl"
                            />
                            <label htmlFor={`founder-image-${index}`}>
                              <Button variant="outline" size="sm" asChild disabled={isUploading}>
                                <span>
                                  <Upload className="ml-2 h-4 w-4" />
                                  {isUploading ? "جاري الرفع..." : "رفع صورة"}
                                </span>
                              </Button>
                              <input
                                id={`founder-image-${index}`}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, 'founder', index);
                                }}
                              />
                            </label>
                          </div>
                          {founder.image_url && (
                            <img src={founder.image_url} alt="معاينة" className="w-16 h-16 object-cover rounded-full" />
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Linkedin className="h-4 w-4" />
                              رابط LinkedIn
                            </label>
                            <Input
                              value={founder.linkedin_url}
                              onChange={(e) => updateFounderData(index, 'linkedin_url', e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                              dir="ltr"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Twitter className="h-4 w-4" />
                              رابط Twitter
                            </label>
                            <Input
                              value={founder.twitter_url}
                              onChange={(e) => updateFounderData(index, 'twitter_url', e.target.value)}
                              placeholder="https://twitter.com/username"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">محتوى رحلة الشركة</label>
                  <RichTextEditor
                    value={companyForm.content}
                    onChange={(value) => setCompanyForm(prev => ({ ...prev, content: value }))}
                    placeholder="اكتب محتوى رحلة الشركة هنا..."
                    height="400px"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">حالة النشر</label>
                  <Select value={companyForm.status} onValueChange={(value: 'draft' | 'published') => setCompanyForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreateOrUpdateCompany} disabled={createCompany.isPending || updateCompany.isPending} className="w-full">
                  <Save className="ml-2 h-4 w-4" />
                  {createCompany.isPending || updateCompany.isPending ? "جاري الحفظ..." : editType === 'company' && editId ? "حفظ التعديلات" : "حفظ رحلة الشركة"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateContent;
