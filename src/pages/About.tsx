import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePersonalInfo } from "@/hooks/usePersonalInfo";
import { useExperiences } from "@/hooks/useExperiences";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const About = () => {
  const { data: personalInfo } = usePersonalInfo();
  const { data: experiences } = useExperiences();
  const [openExperience, setOpenExperience] = useState<string | null>(null);

  const toggleExperience = (experienceId: string) => {
    setOpenExperience(openExperience === experienceId ? null : experienceId);
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                حياك، أنا {personalInfo?.name || "يزن صالح"}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {personalInfo?.bio || "خبير في إدارة المنتجات الرقمية والنمو في الشركات الناشئة. أشارك هنا تجاربي ورؤيتي حول عالم ريادة الأعمال والتكنولوجيا."}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-full max-w-sm h-96 overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={personalInfo?.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face"}
                    alt={personalInfo?.name || "يزن صالح"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section - Smaller and aligned with image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            الخبرات المهنية
          </h2>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            {experiences?.map((experience) => (
              <Card key={experience.id} className="overflow-hidden">
                <Collapsible>
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleExperience(experience.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-lg bg-white border flex items-center justify-center">
                            <img
                              src={experience.logo_url || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=60&h=60&fit=crop"}
                              alt={`${experience.company} logo`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="text-right">
                            <h3 className="text-base font-semibold text-card-foreground">
                              {experience.position}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {openExperience === experience.id ? 
                            <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          }
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="px-4 pb-4 pt-0 border-t bg-secondary/30">
                      <div className="space-y-2 text-right">
                        <p className="text-base text-primary font-medium">
                          {experience.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {experience.duration}
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;