import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArticle } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

const Article = () => {
  const { id } = useParams();
  const { data: article, isLoading, error } = useArticle(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center" dir="rtl">
          <h1 className="text-2xl font-bold text-primary mb-4">
            المقال غير موجود
          </h1>
          <p className="text-muted-foreground">
            عذراً، لم نتمكن من العثور على هذا المقال.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16" dir="rtl">
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="text-muted-foreground">{formatDate(article.created_at)}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
            {article.title}
          </h1>
          
          {article.image_url && (
            <div className="w-full h-80 overflow-hidden rounded-lg shadow-lg mb-8 bg-gray-50 flex items-center justify-center">
              <img
                src={article.image_url}
                alt={article.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="mb-8">
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {article.excerpt}
          </p>
          
          {article.content && (
            <div 
              className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                direction: 'rtl',
                textAlign: 'right'
              }}
            />
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default Article;