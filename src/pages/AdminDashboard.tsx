
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Building, Briefcase, Settings, User } from "lucide-react";
import PersonalInfoTab from "@/components/admin/PersonalInfoTab";
import SiteSettingsTab from "@/components/admin/SiteSettingsTab";
import ArticlesTab from "@/components/admin/ArticlesTab";
import CompaniesTab from "@/components/admin/CompaniesTab";
import ExperiencesTab from "@/components/admin/ExperiencesTab";
import SubscribersTab from "@/components/admin/SubscribersTab";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">لوحة التحكم</h1>
        
        <Tabs defaultValue="personal" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-6" dir="rtl">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              المعلومات الشخصية
            </TabsTrigger>
            <TabsTrigger value="site" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              إعدادات الموقع
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              المقالات
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              رحلات الشركات
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              الخبرات
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              المشتركين
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <PersonalInfoTab />
          </TabsContent>

          <TabsContent value="site" className="space-y-6">
            <SiteSettingsTab />
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <ArticlesTab />
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <CompaniesTab />
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <ExperiencesTab />
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <SubscribersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
