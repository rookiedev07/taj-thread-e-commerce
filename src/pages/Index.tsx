import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Truck, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryTile } from '@/components/product/CategoryTile';
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
        <section className="relative h-[80vh] lg:h-[90vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroBanner}
              alt="Stitch & Stone — Modern Fashion"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-foreground/10" />
          </div>

          <div className="relative section-container h-full flex items-center">
            <div className="max-w-2xl slide-up">
              <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm border border-background/30 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-background" />
                <span className="text-background text-xs font-medium tracking-widest uppercase">
                  New Season Collection
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-background mb-6 leading-tight">
                Dress for
                <br />
                <span className="italic font-normal">every</span> moment
              </h1>
              <p className="text-background/80 text-lg mb-8 max-w-md leading-relaxed">
                From minimalist essentials to bold statements — explore hundreds of styles across every category.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-background text-foreground hover:bg-background/90 px-8 py-4 text-base font-medium shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  asChild
                >
                  <Link to="/shop">
                    Shop All Styles
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  className="border-2 border-background text-background bg-transparent hover:bg-background hover:text-foreground px-8 py-4 text-base transition-all duration-300"
                  asChild
                >
                  <Link to="/shop/womens">Shop Women's</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="absolute bottom-0 left-0 right-0 bg-foreground/50 backdrop-blur-sm border-t border-background/10">
            <div className="section-container py-4">
              <div className="flex justify-center gap-12 md:gap-24 text-background">
                {[
                  { value: '500+', label: 'Products' },
                  { value: '6', label: 'Categories' },
                  { value: '4.8★', label: 'Avg. Rating' },
                  { value: '10K+', label: 'Happy Customers' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center hidden sm:block">
                    <div className="text-xl font-bold font-serif">{stat.value}</div>
                    <div className="text-xs text-background/60 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 lg:py-28 section-container">
          <div className="text-center mb-14">
            <span className="text-muted-foreground text-xs uppercase tracking-widest font-medium block mb-3">
              Browse
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {categories.map((category) => (
              <CategoryTile
                key={category.id}
                category={category}
                size="md"
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="section-container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-widest font-medium block mb-3">
                  Just Dropped
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold">
                  New Arrivals
                </h2>
              </div>
              <Link
                to="/shop?filter=new"
                className="hidden sm:flex items-center gap-2 text-foreground font-medium hover:text-muted-foreground transition-colors text-sm"
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

        {/* Split Promo Banner */}
        <section className="py-20 lg:py-28 section-container">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Women's Promo */}
            <Link to="/shop/womens" className="group relative overflow-hidden rounded-2xl aspect-[4/3] lg:aspect-[3/2]">
              <img
                src={categories.find(c => c.id === 'womens')?.image}
                alt="Women's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="text-background/70 text-xs uppercase tracking-widest block mb-2">Explore</span>
                <h3 className="font-serif text-3xl font-semibold text-background mb-3">Women's</h3>
                <div className="flex items-center gap-2 text-background font-medium text-sm group-hover:gap-4 transition-all">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Men's Promo */}
            <Link to="/shop/mens" className="group relative overflow-hidden rounded-2xl aspect-[4/3] lg:aspect-[3/2]">
              <img
                src={categories.find(c => c.id === 'mens')?.image}
                alt="Men's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="text-background/70 text-xs uppercase tracking-widest block mb-2">Explore</span>
                <h3 className="font-serif text-3xl font-semibold text-background mb-3">Men's</h3>
                <div className="flex items-center gap-2 text-background font-medium text-sm group-hover:gap-4 transition-all">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-widest font-medium block mb-3">
                  Customer Favorites
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold">
                  Best Sellers
                </h2>
              </div>
              <Link
                to="/shop?filter=bestsellers"
                className="hidden sm:flex items-center gap-2 text-foreground font-medium hover:text-muted-foreground transition-colors text-sm"
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

        {/* Streetwear & Outerwear Spotlight */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-background/50 text-xs uppercase tracking-widest font-medium block mb-4">
                  Trending Now
                </span>
                <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Street-ready.
                  <br />
                  <span className="text-background/50 italic font-normal">Weather-proof.</span>
                </h2>
                <p className="text-background/60 text-base mb-8 leading-relaxed">
                  Our streetwear and outerwear collections are built for real life. 
                  From heavyweight hoodies to premium wool coats — we've got every layer covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-background text-foreground hover:bg-background/90 font-medium" asChild>
                    <Link to="/shop/streetwear">
                      Shop Streetwear
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-background/30 text-background hover:bg-background/10" asChild>
                    <Link to="/shop/outerwear">Shop Outerwear</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-xl overflow-hidden">
                  <img
                    src={categories.find(c => c.id === 'streetwear')?.image}
                    alt="Streetwear"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden mt-8">
                  <img
                    src={categories.find(c => c.id === 'outerwear')?.image}
                    alt="Outerwear"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-16 lg:py-20 bg-secondary/30">
          <div className="section-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $100' },
                { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
                { icon: Shield, title: 'Secure Payments', desc: 'SSL encrypted checkout' },
                { icon: Star, title: 'Top Rated', desc: '4.8★ from 10,000+ reviews' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{title}</div>
                    <div className="text-muted-foreground text-xs">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Feed Style Grid */}
        <section className="py-20 lg:py-28 section-container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-3">
              #StitchAndStone
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Tag us in your looks for a chance to be featured. Style is personal — show us yours.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={product.images[0]}
                  alt={`Style ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
