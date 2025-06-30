
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useArticles, useDeleteArticle } from "@/hooks/useArticles";
import { useSendNewsletter } from "@/hooks/useNewsletter";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArticlesTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: articles } = useArticles();
  const deleteArticle = useDeleteArticle();
  const sendNewsletter = useSendNewsletter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleEditArticle = (articleId: string) => {
    navigate(`/create-content?edit=article&id=${articleId}`);
  };

  const handleDeleteArticle = async (article: any) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      try {
        await deleteArticle.mutateAsync(article.id);
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف المقال بنجاح",
        });
      } catch (error) {
        toast({
          title: "خطأ في الحذف",
          description: "فشل في حذف المقال",
          variant: "destructive",
        });
      }
    }
  };

  const handleSendNewsletter = async (article: any) => {
    if (window.confirm(`هل تريد إرسال هذا المقال "${article.title}" للمشتركين في النشرة البريدية؟`)) {
      try {
        await sendNewsletter.mutateAsync({
          title: article.title,
          content: article.content || article.excerpt,
          type: 'article'
        });
        toast({
          title: "تم إرسال النشرة البريدية!",
          description: "تم إرسال المقال لجميع المشتركين في النشرة البريدية",
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
        <h2 className="text-2xl font-bold">إدارة المقالات</h2>
        <Button onClick={() => navigate("/create-content")}>
          إنشاء مقال جديد
        </Button>
      </div>
      <div className="grid gap-4">
        {articles?.map((article) => (
          <Card key={article.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                  <p className="text-muted-foreground mb-2">{article.excerpt}</p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>الفئة: {article.category}</span>
                    <span>•</span>
                    <span>الحالة: {article.status}</span>
                    <span>•</span>
                    <span>التاريخ: {formatDate(article.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditArticle(article.id)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {article.status === 'published' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendNewsletter(article)}
                      disabled={sendNewsletter.isPending}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteArticle(article)}
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

export default ArticlesTab;
