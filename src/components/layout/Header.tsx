import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/shop', label: 'All' },
  { href: '/shop/womens', label: "Women's" },
  { href: '/shop/mens', label: "Men's" },
  { href: '/shop/streetwear', label: 'Streetwear' },
  { href: '/shop/outerwear', label: 'Outerwear' },
  { href: '/shop/footwear', label: 'Footwear' },
  { href: '/shop/accessories', label: 'Accessories' },
];

export const Header: React.FC = () => {
  const { itemCount, toggleCart } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top Banner */}
      <div className="bg-foreground text-background text-center py-2 px-4 text-xs tracking-widest font-medium uppercase">
        <span>Free shipping on orders over $100 · New arrivals every week</span>
      </div>

      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-card">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link
                    to="/"
                    className="font-serif text-2xl font-bold text-foreground tracking-tight"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Stitch & Stone
                  </Link>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        'text-base py-3 px-3 rounded-lg transition-colors',
                        location.pathname === link.href
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-foreground hover:bg-secondary'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pt-8 border-t border-border">
                  <Link
                    to={isAuthenticated ? '/account' : '/auth'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>{isAuthenticated ? 'My Account' : 'Sign In / Register'}</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-xl lg:text-2xl font-bold text-foreground tracking-tight">
              Stitch & Stone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors underline-animate py-1',
                  location.pathname === link.href ||
                  (link.href !== '/shop' && location.pathname.startsWith(link.href))
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Button>

            <Link to={isAuthenticated ? '/account' : '/auth'}>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
