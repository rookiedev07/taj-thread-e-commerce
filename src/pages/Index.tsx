import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryTile } from '@/components/product/CategoryTile';
import { TrustBadges } from '@/components/common/TrustBadges';
import { categories, getFeaturedProducts, getNewArrivals, getBestSellers } from '@/data/products';
import heroBanner from '@/assets/hero-banner.jpg';

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const bestSellers = getBestSellers();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroBanner}
              alt="Taj & Thread Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
          </div>

          <div className="relative section-container h-full flex items-center">
            <div className="max-w-xl slide-up">
              <span className="inline-block text-accent font-medium mb-4 tracking-wide">
                New Ramadan Collection 2024
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Elegance Rooted in Tradition
              </h1>
              <p className="text-primary-foreground/90 text-lg mb-8 max-w-md">
                Discover premium Muslim fashion that celebrates heritage while embracing modern sophistication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero" asChild>
                  <Link to="/shop">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button className="btn-outline-elegant text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-foreground" asChild>
                  <Link to="/shop/abayas">Shop Abayas</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24 section-container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
              Shop by Category
            </h2>
            <div className="gold-accent mx-auto" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <CategoryTile
                key={category.id}
                category={category}
                size={index < 2 ? 'lg' : 'md'}
                className={index < 2 ? 'lg:col-span-1' : ''}
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="section-container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-accent font-medium text-sm uppercase tracking-wider mb-2 block">
                  Fresh Finds
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold">
                  New Arrivals
                </h2>
              </div>
              <Link
                to="/shop?filter=new"
                className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="sm:hidden text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/shop?filter=new">View All New Arrivals</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Banner */}
        <section className="py-16 lg:py-24 section-container">
          <div className="bg-primary rounded-2xl overflow-hidden bg-pattern-islamic">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 lg:p-12">
                <span className="text-accent font-medium text-sm uppercase tracking-wider mb-4 block">
                  Limited Edition
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                  Ramadan Exclusive Collection
                </h2>
                <p className="text-primary-foreground/80 mb-6">
                  Celebrate the holy month with our specially curated collection featuring intricate embroidery and luxurious fabrics.
                </p>
                <Button className="btn-gold" asChild>
                  <Link to="/shop?collection=ramadan">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="aspect-square lg:aspect-auto lg:h-96">
                <img
                  src={heroBanner}
                  alt="Ramadan Collection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16 lg:py-24">
          <div className="section-container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-accent font-medium text-sm uppercase tracking-wider mb-2 block">
                  Customer Favorites
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold">
                  Best Sellers
                </h2>
              </div>
              <Link
                to="/shop?filter=bestsellers"
                className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="sm:hidden text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/shop?filter=bestsellers">View All Best Sellers</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-16 lg:py-20 bg-secondary/50">
          <div className="section-container">
            <TrustBadges />
          </div>
        </section>

        {/* Instagram Feed / Social Proof */}
        <section className="py-16 lg:py-24 section-container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
              #TajAndThread
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join our community and share your style. Tag us for a chance to be featured.
            </p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <div
                key={product.id}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={product.images[0]}
                  alt={`Community post ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
