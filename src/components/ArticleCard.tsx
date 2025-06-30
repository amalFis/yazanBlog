
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image_url?: string;
}

const ArticleCard = ({ id, title, excerpt, category, date, image_url }: ArticleCardProps) => {
  return (
    <article className="bg-card rounded-lg overflow-hidden shadow-sm card-hover border">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={image_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"}
            alt={title}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {category}
            </span>
            <span className="text-muted-foreground text-sm">{date}</span>
          </div>
          <h3 className="text-xl font-bold text-card-foreground mb-3 leading-tight">
            {title}
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {excerpt}
          </p>
          <Link to={`/article/${id}`}>
            <Button variant="outline" size="sm">
              اقرأ المزيد
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
