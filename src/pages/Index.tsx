import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePersonalInfo } from "@/hooks/usePersonalInfo";
import { useArticles } from "@/hooks/useArticles";
import { useCompanies } from "@/hooks/useCompanies";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft } from "lucide-react";

const Index = () => {
  const { data: personalInfo, isLoading: personalInfoLoading } = usePersonalInfo();
  const { data: articles, isLoading: articlesLoading } = useArticles('published');
  const { data: companies, isLoading: companiesLoading } = useCompanies('published');

  // دمج المقالات والشركات وترتيبها حسب التاريخ
  const allContent = [
    ...(articles || []).map(article => ({
      ...article,
      type: 'article' as const,
      date: new Date(article.created_at)
    })),
    ...(companies || []).map(company => ({
      ...company,
      type: 'company' as const,
      date: new Date(company.created_at)
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);

  const isLoading = articlesLoading || companiesLoading;

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-6">
              {personalInfoLoading ? (
                <>
                  <Skeleton className="h-16 w-96" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-12 w-48" />
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                    حياك، أنا {personalInfo?.name || "يزن صالح"}
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {personalInfo?.bio?.substring(0, 200) || "خبير في إدارة المنتجات الرقمية والنمو في الشركات الناشئة. أشارك هنا تجاربي ورؤيتي حول عالم ريادة الأعمال والتكنولوجيا."}
                    {personalInfo?.bio && personalInfo.bio.length > 200 && "..."}
                  </p>
                  <Link to="/about">
                    <Button size="lg" className="text-lg px-8">
                      تعرف على {personalInfo?.name?.split(' ')[0] || "يزن"} أكثر
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="relative">
                {personalInfoLoading ? (
                  <Skeleton className="w-full max-w-sm h-96 mx-auto rounded-2xl" />
                ) : (
                  <div className="w-full max-w-sm mx-auto h-96 overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={personalInfo?.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face"}
                      alt={personalInfo?.name || "يزن صالح"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              أحدث الإضافات
            </h2>
            <p className="text-muted-foreground text-lg">
              أحدث المقالات ورحلات الشركات الملهمة
            </p>
          </div>

          {/* Latest Content Grid - 2 columns with consistent card heights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                  <div className="p-6 h-56 flex gap-4">
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
            ) : allContent.length > 0 ? (
              allContent.map((item) => (
                <Link key={`${item.type}-${item.id}`} to={item.type === 'article' ? `/article/${item.id}` : `/company/${item.id}`}>
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-lg transition-shadow cursor-pointer group relative h-56">
                    <div className="p-6 h-full">
                      <div className="flex gap-4 h-full" dir="rtl">
                        {/* الصورة على اليمين - Fixed size with contain behavior */}
                        <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
                          <img
                            src={item.type === 'article' ? 
                              (item.image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop") :
                              (item.logo_url || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop")
                            }
                            alt={item.type === 'article' ? item.title : item.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        
                        {/* المحتوى على اليسار - Flexible with consistent layout */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-card-foreground mb-2 leading-tight line-clamp-2">
                              {item.type === 'article' ? item.title : item.name}
                            </h3>
                            
                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-3">
                              {item.type === 'article' ? item.excerpt : item.description}
                            </p>
                          </div>
                          
                          {/* المعلومات في الأسفل */}
                          <div className="flex items-center gap-3 flex-wrap mt-auto">
                            <Badge variant={item.type === 'article' ? 'default' : 'secondary'} className="font-medium text-xs">
                              {item.type === 'article' ? 'مقال' : 'رحلة شركة'}
                            </Badge>
                            {item.type === 'article' && (
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            )}
                            {item.type === 'company' && (
                              <Badge variant="outline" className="text-xs">
                                {item.sector}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{item.date.toLocaleDateString('en-GB')}</span>
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
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">لا يوجد محتوى متاح حالياً.</p>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <Link to="/articles">
              <Button variant="outline">عرض جميع المقالات</Button>
            </Link>
            <Link to="/company-journeys">
              <Button variant="outline">عرض جميع رحلات الشركات</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;