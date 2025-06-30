import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePersonalInfo } from "@/hooks/usePersonalInfo";

const Header = () => {
  const { data: personalInfo } = usePersonalInfo();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            {personalInfo?.name || "يزن صالح"}
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/about">
              <Button variant="ghost">عن يزن</Button>
            </Link>
            <Link to="/articles">
              <Button variant="ghost">المقالات</Button>
            </Link>
            <Link to="/company-journeys">
              <Button variant="ghost">رحلات الشركات</Button>
            </Link>
          </nav>
          
          {/* Mobile menu button - to be implemented later if needed */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              ☰
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;