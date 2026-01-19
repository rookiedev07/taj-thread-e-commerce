import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Share2, Truck, RotateCcw, Shield, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { getProductBySlug, products, reviews as allReviews } from '@/data/products';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, setCartOpen } = useCart();

  const product = slug ? getProductBySlug(slug) : undefined;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="section-container py-16 text-center">
          <h1 className="font-serif text-2xl font-semibold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const productReviews = allReviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="section-container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            to={`/shop/${product.category}`}
            className="hover:text-foreground transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="mb-8 lg:mb-0">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'shrink-0 w-20 h-24 rounded-md overflow-hidden border-2 transition-colors',
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-border'
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.isNew && (
                <Badge className="bg-primary text-primary-foreground">New</Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-accent text-accent-foreground">Best Seller</Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">-{discountPercentage}% Off</Badge>
              )}
            </div>

            {/* Title & Rating */}
            <h1 className="font-serif text-2xl lg:text-3xl font-semibold mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-border'
                    )}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <Separator className="my-6" />

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Color</span>
                {selectedColor && (
                  <span className="text-sm text-muted-foreground">{selectedColor}</span>
                )}
              </div>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => color.available && setSelectedColor(color.name)}
                    disabled={!color.available}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all relative',
                      selectedColor === color.name
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border',
                      !color.available && 'opacity-40 cursor-not-allowed'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {!color.available && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-0.5 bg-foreground/50 rotate-45 absolute" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Size</span>
                <button className="text-sm text-primary underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => size.available && setSelectedSize(size.value)}
                    disabled={!size.available}
                    className={cn(
                      'px-4 py-2 border rounded-md transition-all text-sm font-medium',
                      selectedSize === size.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary',
                      !size.available &&
                        'opacity-40 cursor-not-allowed line-through hover:border-border'
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <span className="font-medium mb-3 block">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stockCount < 20 && (
                  <span className="text-sm text-destructive">
                    Only {product.stockCount} left in stock
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-6">
              <Button
                className="flex-1 btn-hero"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                Add to Bag
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={cn(
                    'h-5 w-5',
                    isWishlisted && 'fill-destructive text-destructive'
                  )}
                />
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full mb-6"
              onClick={handleBuyNow}
              disabled={!selectedSize || !selectedColor}
            >
              Buy Now
            </Button>

            {(!selectedSize || !selectedColor) && (
              <p className="text-sm text-destructive mb-6">
                Please select a size and color to continue
              </p>
            )}

            {/* Delivery Info */}
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-medium text-sm">Free Shipping</span>
                  <p className="text-xs text-muted-foreground">
                    {product.deliveryEstimate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">30-day easy returns</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Details, Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Product Details</h3>
                  <dl className="space-y-3">
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Fabric</dt>
                      <dd>{product.fabric}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-muted-foreground">Category</dt>
                      <dd className="capitalize">{product.category}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Care Instructions</h3>
                  <ul className="space-y-2">
                    {product.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              {productReviews.length > 0 ? (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-4 w-4',
                                i < review.rating
                                  ? 'fill-accent text-accent'
                                  : 'text-border'
                              )}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold mb-1">{review.title}</h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        {review.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.author} • {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this product.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-semibold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
