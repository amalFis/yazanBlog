import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArticles } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ChevronLeft } from "lucide-react";

const Articles = () => {
  const { data: articles, isLoading } = useArticles('published');

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            المقالات
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            مجموعة من المقالات المتخصصة في إدارة المنتجات والنمو في الشركات الناشئة
          </p>
        </div>

        {/* Articles Grid - 2 columns with uniform card heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading skeletons with fixed height
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm border h-56">
                <div className="p-6 h-full flex gap-4">
                  <Skeleton className="w-32 h-32 rounded flex-shrink-0" />
                  <div className="flex-1 flex flex-col">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-12 w-full flex-1 mb-3" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : articles && articles.length > 0 ? (
            articles.map((article) => (
              <Link key={article.id} to={`/article/${article.id}`}>
                <div className="bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-lg transition-shadow cursor-pointer group relative h-56">
                  <div className="p-6 h-full">
                    <div className="flex gap-4 h-full" dir="rtl">
                      {/* الصورة على اليمين - Fixed size with contain behavior */}
                      <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
                        <img
                          src={article.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop"}
                          alt={article.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {/* المحتوى على اليسار - Flexible with consistent layout */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-card-foreground mb-2 leading-tight line-clamp-2">
                            {article.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-3">
                            {article.excerpt}
                          </p>
                        </div>
                        
                        {/* المعلومات في الأسفل */}
                        <div className="flex items-center gap-3 flex-wrap mt-auto">
                          <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-xs">
                            {article.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(article.created_at).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronLeft className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">لا توجد مقالات متاحة حالياً.</p>
            </div>
          )}
        </div>

        {/* Load More Button - only show if there are more than 6 articles */}
        {articles && articles.length > 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              تحميل المزيد من المقالات
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Articles;