
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCompanies, useDeleteCompany } from "@/hooks/useCompanies";
import { useSendNewsletter } from "@/hooks/useNewsletter";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompaniesTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: companies } = useCompanies();
  const deleteCompany = useDeleteCompany();
  const sendNewsletter = useSendNewsletter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleEditCompany = (companyId: string) => {
    navigate(`/create-content?edit=company&id=${companyId}`);
  };

  const handleDeleteCompany = async (company: any) => {
    if (window.confirm("هل أنت متأكد من حذف رحلة هذه الشركة؟")) {
      try {
        await deleteCompany.mutateAsync(company.id);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف رحلة الشركة بنجاح",
        });
      } catch (error) {
        toast({
          title: "خطأ في الحذف",
          description: "فشل في حذف رحلة الشركة",
          variant: "destructive",
        });
      }
    }
  };

  const handleSendNewsletter = async (company: any) => {
    if (window.confirm(`هل تريد إرسال رحلة شركة "${company.name}" للمشتركين في النشرة البريدية؟`)) {
      try {
        await sendNewsletter.mutateAsync({
          title: company.name,
          content: company.description || company.content,
          type: 'company'
        });
        toast({
          title: "تم إرسال النشرة البريدية!",
          description: "تم إرسال رحلة الشركة لجميع المشتركين في النشرة البريدية",
        });
      } catch (error: any) {
        toast({
          title: "خطأ في إرسال النشرة البريدية",
          description: error.message || "فشل في إرسال النشرة البريدية",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة رحلات الشركات</h2>
        <Button onClick={() => navigate("/create-content?tab=company")}>
          إنشاء رحلة شركة جديدة
        </Button>
      </div>
      <div className="grid gap-4">
        {companies?.map((company) => (
          <Card key={company.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                  <p className="text-muted-foreground mb-2">{company.description}</p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>القطاع: {company.sector}</span>
                    <span>•</span>
                    <span>الحالة: {company.status}</span>
                    <span>•</span>
                    <span>التاريخ: {formatDate(company.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCompany(company.id)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {company.status === 'published' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendNewsletter(company)}
                      disabled={sendNewsletter.isPending}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCompany(company)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompaniesTab;
