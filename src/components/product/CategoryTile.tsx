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
          'relative overflow-hidden',
          size === 'sm' && 'aspect-square',
          size === 'md' && 'aspect-[4/5]',
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
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <span className="text-accent text-sm font-medium mb-1">
            {category.productCount} Products
          </span>
          <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-primary-foreground mb-2">
            {category.name}
          </h3>
          <p className="text-primary-foreground/80 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>
          <div className="flex items-center gap-2 text-primary-foreground font-medium group-hover:text-accent transition-colors">
            <span>Explore</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
