import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const steps = ['Shipping', 'Summary', 'Payment', 'Confirmation'];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, shipping, total, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', apartment: '', city: '', state: '', postalCode: '', country: 'United States',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    setCurrentStep(3);
    setIsLoading(false);
  };

  if (items.length === 0 && currentStep < 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className={cn('flex items-center gap-2', index <= currentStep ? 'text-primary' : 'text-muted-foreground')}>
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2',
                  index < currentStep ? 'bg-primary text-primary-foreground border-primary' :
                  index === currentStep ? 'border-primary text-primary' : 'border-border')}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step}</span>
              </div>
              {index < steps.length - 1 && <ChevronRight className="h-4 w-4 text-border" />}
            </React.Fragment>
          ))}
        </div>

        {currentStep === 3 ? (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h1 className="font-serif text-3xl font-semibold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">Order #TT-{Date.now().toString().slice(-8)}</p>
            <p className="text-muted-foreground mb-8">We'll send you a confirmation email shortly.</p>
            <Button className="btn-hero" asChild><Link to="/shop">Continue Shopping</Link></Button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-3">
              {currentStep === 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1" required /></div>
                    <div><Label>Last Name</Label><Input name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1" required /></div>
                    <div className="col-span-2"><Label>Email</Label><Input name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1" required /></div>
                    <div className="col-span-2"><Label>Street Address</Label><Input name="street" value={formData.street} onChange={handleInputChange} className="mt-1" required /></div>
                    <div><Label>City</Label><Input name="city" value={formData.city} onChange={handleInputChange} className="mt-1" required /></div>
                    <div><Label>Postal Code</Label><Input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="mt-1" required /></div>
                  </div>
                  <Button className="btn-hero mt-8" onClick={handleContinue}>Continue to Summary</Button>
                </div>
              )}
              {currentStep === 1 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4 pb-4 border-b">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-24 object-cover rounded" />
                        <div className="flex-1"><p className="font-medium">{item.product.name}</p><p className="text-sm text-muted-foreground">{item.selectedSize} • {item.selectedColor} • Qty: {item.quantity}</p></div>
                        <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="btn-hero mt-8" onClick={handleContinue}>Continue to Payment</Button>
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-6">Payment Method</h2>
                  <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                    <p className="text-muted-foreground text-center">Payment integration ready for backend connection</p>
                  </div>
                  <Button className="btn-hero" onClick={handlePlaceOrder} disabled={isLoading}>
                    {isLoading ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
                  </Button>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 mt-8 lg:mt-0">
              <div className="bg-secondary/50 rounded-lg p-6 sticky top-32">
                <h3 className="font-semibold mb-4">Order Total</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
