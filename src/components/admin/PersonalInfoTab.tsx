
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePersonalInfo, useUpdatePersonalInfo } from "@/hooks/usePersonalInfo";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useToast } from "@/hooks/use-toast";

const PersonalInfoTab = () => {
  const { toast } = useToast();
  const { data: personalInfo } = usePersonalInfo();
  const updatePersonalInfo = useUpdatePersonalInfo();
  const { uploadImage } = useImageUpload();

  const [personalForm, setPersonalForm] = useState({
    name: "",
    title: "",
    bio: "",
    profile_image_url: "",
  });

  useEffect(() => {
    if (personalInfo) {
      setPersonalForm({
        name: personalInfo.name || "",
        title: personalInfo.title || "",
        bio: personalInfo.bio || "",
        profile_image_url: personalInfo.profile_image_url || "",
      });
    }
  }, [personalInfo]);

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePersonalInfo.mutateAsync(personalForm);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث المعلومات الشخصية بنجاح",
      });
    } catch (error) {
      console.error("خطأ في الحفظ:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ المعلومات الشخصية",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file, 'profiles');
        setPersonalForm(prev => ({ ...prev, profile_image_url: imageUrl }));
        toast({
          title: "تم رفع الصورة بنجاح",
          description: "تم رفع صورة الملف الشخصي بنجاح",
        });
      } catch (error) {
        toast({
          title: "خطأ في رفع الصورة",
          description: "فشل في رفع الصورة",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>المعلومات الشخصية</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePersonalSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              value={personalForm.name}
              onChange={(e) => setPersonalForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="اسمك الكامل"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">المسمى الوظيفي</Label>
            <Input
              id="title"
              value={personalForm.title}
              onChange={(e) => setPersonalForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="مسماك الوظيفي"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">النبذة الشخصية</Label>
            <Textarea
              id="bio"
              value={personalForm.bio}
              onChange={(e) => setPersonalForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="اكتب نبذة عن نفسك"
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile_image">صورة الملف الشخصي</Label>
            <Input
              id="profile_image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {personalForm.profile_image_url && (
              <img 
                src={personalForm.profile_image_url} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          <Button 
            type="submit" 
            disabled={updatePersonalInfo.isPending}
            className="w-full"
          >
            {updatePersonalInfo.isPending ? "جاري الحفظ..." : "حفظ المعلومات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoTab;
