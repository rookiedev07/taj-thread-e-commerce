import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types/product';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryTileProps {
  category: Category;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  category,
  className,
  size = 'md',
}) => {
  return (
    <Link
      to={`/shop/${category.id}`}
      className={cn('category-tile group block', className)}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl',
          size === 'sm' && 'aspect-square',
          size === 'md' && 'aspect-[3/4]',
          size === 'lg' && 'aspect-[3/4]'
        )}
      >
        {/* Image */}
        <img
          src={category.image}
          alt={category.name}
          className="category-image w-full h-full object-cover transition-transform duration-700"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-4 lg:p-5 flex flex-col justify-end">
          <h3 className="font-serif text-lg lg:text-xl font-semibold text-background mb-1 leading-tight">
            {category.name}
          </h3>
          <div className="flex items-center gap-1.5 text-background/80 text-xs font-medium group-hover:text-background transition-colors">
            <span>Explore</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
