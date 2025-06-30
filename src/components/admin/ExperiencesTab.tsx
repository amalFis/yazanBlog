
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience } from "@/hooks/useExperiences";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";

const ExperiencesTab = () => {
  const { toast } = useToast();
  const { data: experiences } = useExperiences();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const [experienceForm, setExperienceForm] = useState({
    company: "",
    position: "",
    duration: "",
    logo_url: "",
    order_index: 0,
  });
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExperienceId) {
        await updateExperience.mutateAsync({ 
          id: editingExperienceId, 
          ...experienceForm 
        });
        toast({
          title: "تم التعديل بنجاح",
          description: "تم تعديل الخبرة بنجاح",
        });
      } else {
        await createExperience.mutateAsync(experienceForm);
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تمت إضافة الخبرة بنجاح",
        });
      }
      setIsAddingExperience(false);
      setEditingExperienceId(null);
      setExperienceForm({
        company: "",
        position: "",
        duration: "",
        logo_url: "",
        order_index: 0,
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ الخبرة",
        variant: "destructive",
      });
    }
  };

  const handleEditExperience = (experience: any) => {
    setEditingExperienceId(experience.id);
    setExperienceForm({
      company: experience.company,
      position: experience.position,
      duration: experience.duration,
      logo_url: experience.logo_url || "",
      order_index: experience.order_index,
    });
    setIsAddingExperience(true);
  };

  const handleDeleteExperience = async (experience: any) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الخبرة؟")) {
      try {
        await deleteExperience.mutateAsync(experience.id);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف الخبرة بنجاح",
        });
      } catch (error) {
        toast({
          title: "خطأ في الحذف",
          description: "فشل في حذف الخبرة",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة الخبرات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences?.map((experience) => (
            <div key={experience.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{experience.company}</p>
                <p className="text-sm text-muted-foreground">{experience.position}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {experience.duration}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditExperience(experience)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteExperience(experience)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {(!experiences || experiences.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              لا يوجد خبرات حتى الآن
            </p>
          )}
        </div>
        
        <Button onClick={() => {
          setIsAddingExperience(true);
          setExperienceForm({ company: "", position: "", duration: "", logo_url: "", order_index: 0 });
          setEditingExperienceId(null);
        }}>
          إضافة خبرة جديدة
        </Button>
        
        {isAddingExperience && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              {editingExperienceId ? "تعديل خبرة" : "إضافة خبرة جديدة"}
            </h3>
            <form onSubmit={handleExperienceSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">الشركة</Label>
                <Input
                  id="company"
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                  placeholder="اسم الشركة"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">المسمى الوظيفي</Label>
                <Input
                  id="position"
                  value={experienceForm.position}
                  onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                  placeholder="المسمى الوظيفي"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">المدة</Label>
                <Input
                  id="duration"
                  value={experienceForm.duration}
                  onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                  placeholder="المدة"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">رابط الشعار</Label>
                <Input
                  id="logo_url"
                  value={experienceForm.logo_url}
                  onChange={(e) => setExperienceForm({ ...experienceForm, logo_url: e.target.value })}
                  placeholder="رابط الشعار"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index">ترتيب العرض</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={experienceForm.order_index}
                  onChange={(e) => setExperienceForm({ ...experienceForm, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="ترتيب العرض"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createExperience.isPending || updateExperience.isPending}>
                  {createExperience.isPending || updateExperience.isPending
                    ? "جاري الحفظ..."
                    : editingExperienceId
                      ? "تعديل الخبرة"
                      : "إضافة الخبرة"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsAddingExperience(false);
                    setEditingExperienceId(null);
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperiencesTab;
