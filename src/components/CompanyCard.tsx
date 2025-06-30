
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CompanyCardProps {
  id: string;
  name: string;
  sector: string;
  description: string;
  logo_url?: string;
}

const CompanyCard = ({ id, name, sector, description, logo_url }: CompanyCardProps) => {
  return (
    <article className="bg-card rounded-lg overflow-hidden shadow-sm card-hover border">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 flex items-center justify-center p-6 bg-secondary/50">
          <img
            src={logo_url || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop"}
            alt={`${name} logo`}
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
              {sector}
            </span>
          </div>
          <h3 className="text-xl font-bold text-card-foreground mb-3">
            {name}
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>
          <Link to={`/company/${id}`}>
            <Button variant="outline" size="sm">
              اعرف المزيد عن الرحلة
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CompanyCard;
