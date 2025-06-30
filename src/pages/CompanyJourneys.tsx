import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCompanies } from "@/hooks/useCompanies";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const CompanyJourneys = () => {
  const { data: companies, isLoading } = useCompanies('published');

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            رحلات الشركات
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            قصص ملهمة من رحلات الشركات الناشئة، من الفكرة إلى التطبيق والنمو
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="aspect-square">
                <CardContent className="p-6 h-full flex items-center justify-center">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                </CardContent>
              </Card>
            ))
          ) : companies && companies.length > 0 ? (
            companies.map((company) => (
              <Link key={company.id} to={`/company/${company.id}`}>
                <Card className="aspect-square group hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <CardContent className="p-2 h-full flex flex-col items-center justify-center relative bg-white">
                    {/* Company Logo - Full display with contain */}
                    <img
                      src={company.logo_url || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop"}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-contain object-center p-2 group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Hover overlay with company info */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-white">
                      <h3 className="font-bold text-lg mb-2 text-center drop-shadow-lg">
                        {company.name}
                      </h3>
                      <p className="text-sm text-center mb-2 opacity-90 drop-shadow-lg">
                        {company.sector}
                      </p>
                      <div className="flex items-center gap-1 text-xs opacity-75">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(company.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-muted-foreground text-lg">لا توجد رحلات شركات متاحة حالياً.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {companies && companies.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              تحميل المزيد من الرحلات
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CompanyJourneys;