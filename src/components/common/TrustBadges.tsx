import React from 'react';
import { Shield, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const badges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: '256-bit SSL encryption',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Dedicated customer care',
  },
];

interface TrustBadgesProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  className,
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap justify-center gap-6', className)}>
        {badges.map((badge) => (
          <div key={badge.title} className="flex items-center gap-2 text-muted-foreground">
            <badge.icon className="h-4 w-4" />
            <span className="text-sm">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {badges.map((badge) => (
        <div key={badge.title} className="trust-badge">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <badge.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{badge.title}</h4>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
