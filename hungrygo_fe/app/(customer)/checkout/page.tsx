'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCartItems, updateCartItem, removeCartItem, clearCart } from '@/store/slices/cartSlice';
import { createOrder } from '@/store/slices/orderSlice';
import { gsap } from 'gsap';

interface DeliveryAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  deliveryInstructions?: string;
}

interface PaymentMethod {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { items, subtotal, loading: cartLoading } = useAppSelector((state) => state.cart);
  const { loading: orderLoading, orderSuccess, error: orderError } = useAppSelector((state) => state.orders);
  
  const [step, setStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    deliveryInstructions: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  });
  const [deliveryTime, setDeliveryTime] = useState('asap');
  const [customDeliveryTime, setCustomDeliveryTime] = useState('');
  const [tipAmount, setTipAmount] = useState(10);
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeApplied, setPromoCodeApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  const stepOneRef = useRef<HTMLDivElement>(null);
  const stepTwoRef = useRef<HTMLDivElement>(null);
  const stepThreeRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  
  // Fetch cart items on component mount
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);
  
  // Handle delivery address input changes
  const handleDeliveryAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress({ ...deliveryAddress, [name]: value });
  };
  
  // Handle payment method input changes
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentMethod({ ...paymentMethod, [name]: value });
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  // Handle card number input with formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentMethod({ ...paymentMethod, cardNumber: formattedValue });
  };
  
  // Handle expiry date input with formatting
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setPaymentMethod({ ...paymentMethod, expiryDate: formattedValue });
  };
  
  // Handle delivery time selection
  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryTime(e.target.value);
  };
  
  // Handle tip amount selection
  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTipAmount(value === 'custom' ? 0 : Number(value));
    if (value !== 'custom') {
      setCustomTipAmount('');
    }
  };
  
  // Handle custom tip amount input
  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setCustomTipAmount(value);
      setTipAmount(value === '' ? 0 : Number(value));
    }
  };
  
  // Apply promo code
  const applyPromoCode = () => {
    // In a real app, this would validate the promo code with an API call
    if (promoCode.toUpperCase() === 'WELCOME20') {
      setPromoCodeApplied(true);
      setPromoDiscount(Math.round(subtotal * 0.2 * 100) / 100); // 20% discount
      
      // Animate the discount amount
      gsap.fromTo(
        '.promo-discount',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
      );
    } else {
      alert('Invalid promo code. Please try again.');
    }
  };
  
  // Calculate order total
  const deliveryFee = 4.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const total = Math.round((subtotal + deliveryFee + tax + tipAmount - promoDiscount) * 100) / 100;
  
  // Proceed to next step
  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      // Validate delivery address
      const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'zipCode', 'phone'];
      const missingFields = requiredFields.filter(field => !deliveryAddress[field as keyof DeliveryAddress]);
      
      if (missingFields.length > 0) {
        alert('Please fill in all required fields.');
        return;
      }
    } else if (step === 2) {
      // Validate payment method
      const requiredFields = ['cardNumber', 'nameOnCard', 'expiryDate', 'cvv'];
      const missingFields = requiredFields.filter(field => !paymentMethod[field as keyof PaymentMethod]);
      
      if (missingFields.length > 0) {
        alert('Please fill in all payment details.');
        return;
      }
      
      // Validate card number format (simplified)
      if (paymentMethod.cardNumber.replace(/\s/g, '').length < 16) {
        alert('Please enter a valid card number.');
        return;
      }
      
      // Validate expiry date format
      if (!/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
        alert('Please enter a valid expiry date (MM/YY).');
        return;
      }
      
      // Validate CVV
      if (!/^\d{3,4}$/.test(paymentMethod.cvv)) {
        alert('Please enter a valid CVV.');
        return;
      }
    }
    
    // Proceed to next step
    setStep(step + 1);
  };
  
  // Go back to previous step
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Place order
  const placeOrder = () => {
    const orderData = {
      items,
      deliveryAddress,
      paymentMethod: {
        ...paymentMethod,
        cardNumber: `**** **** **** ${paymentMethod.cardNumber.slice(-4)}`, // Mask card number for security
      },
      deliveryTime: deliveryTime === 'asap' ? 'As soon as possible' : customDeliveryTime,
      subtotal,
      deliveryFee,
      tipAmount,
      tax,
      promoDiscount,
      total,
    };
    
    dispatch(createOrder(orderData));
  };
  
  // Animate step transitions
  useEffect(() => {
    const refs = [stepOneRef, stepTwoRef, stepThreeRef];
    const currentRef = refs[step - 1];
    
    if (currentRef && currentRef.current) {
      gsap.fromTo(
        currentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [step]);
  
  // Animate success message
  useEffect(() => {
    if (orderSuccess && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
      
      // Animate confetti effect
      const confettiContainer = document.createElement('div');
      confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
      document.body.appendChild(confettiContainer);
      
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'absolute w-2 h-2 rounded-full';
        confetti.style.backgroundColor = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)];
        confetti.style.top = '50%';
        confetti.style.left = '50%';
        confettiContainer.appendChild(confetti);
        
        gsap.to(confetti, {
          x: Math.random() * 500 - 250,
          y: Math.random() * 500 - 250,
          opacity: 0,
          scale: Math.random() * 2,
          duration: Math.random() * 2 + 1,
          ease: 'power2.out',
          onComplete: () => {
            confetti.remove();
            if (i === 99) {
              setTimeout(() => {
                confettiContainer.remove();
              }, 2000);
            }
          }
        });
      }
    }
  }, [orderSuccess]);
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
        
        {/* Checkout Steps */}
        {!orderSuccess && (
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
            </div>
          </div>
        )}
        
        {/* Step 1: Delivery Information */}
        {step === 1 && (
          <div ref={stepOneRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Delivery Information</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                      <input
                        type="text"
                        name="fullName"
                        value={deliveryAddress.fullName}
                        onChange={handleDeliveryAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1*</label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={deliveryAddress.addressLine1}
                        onChange={handleDeliveryAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={deliveryAddress.addressLine2}
                        onChange={handleDeliveryAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                      <input
                        type="text"
                        name="city"
                        value={deliveryAddress.city}
                        onChange={handleDeliveryAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                        <select
                          name="state"
                          value={deliveryAddress.state}
                          onChange={handleDeliveryAddressChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select State</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          {/* Add more states as needed */}
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code*</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={deliveryAddress.zipCode}
                          onChange={handleDeliveryAddressChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                      <input
                        type="tel"
                        name="phone"
                        value={deliveryAddress.phone}
                        onChange={handleDeliveryAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions (Optional)</label>
                      <textarea
                        name="deliveryInstructions"
                        value={deliveryAddress.deliveryInstructions}
                        onChange={handleDeliveryAddressChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="E.g., Gate code, landmark, or special instructions for the delivery person"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Delivery Time</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="asap"
                        name="deliveryTime"
                        value="asap"
                        checked={deliveryTime === 'asap'}
                        onChange={handleDeliveryTimeChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="asap" className="ml-3 block text-sm font-medium text-gray-700">
                        As soon as possible (30-45 minutes)
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="scheduled"
                        name="deliveryTime"
                        value="scheduled"
                        checked={deliveryTime === 'scheduled'}
                        onChange={handleDeliveryTimeChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="scheduled" className="ml-3 block text-sm font-medium text-gray-700">
                        Schedule for later
                      </label>
                    </div>
                    
                    {deliveryTime === 'scheduled' && (
                      <div className="ml-7 mt-2">
                        <input
                          type="datetime-local"
                          value={customDeliveryTime}
                          onChange={(e) => setCustomDeliveryTime(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  {cartLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <div>
                      <div className="max-h-60 overflow-y-auto mb-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-800">{item.quantity}x</span>
                              <span className="ml-2">{item.name}</span>
                            </div>
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tip</span>
                          <span className="font-medium">${tipAmount.toFixed(2)}</span>
                        </div>
                        
                        {promoCodeApplied && (
                          <div className="flex justify-between promo-discount">
                            <span className="text-green-600">Promo Discount</span>
                            <span className="font-medium text-green-600">-${promoDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={nextStep}
                    disabled={items.length === 0 || cartLoading}
                    className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Payment Information */}
        {step === 2 && (
          <div ref={stepTwoRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number*</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentMethod.cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pl-10"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card*</label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={paymentMethod.nameOnCard}
                        onChange={handlePaymentMethodChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY)*</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentMethod.expiryDate}
                          onChange={handleExpiryDateChange}
                          maxLength={5}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentMethod.cvv}
                          onChange={handlePaymentMethodChange}
                          maxLength={4}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Tip</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {[0, 5, 10, 15].map((amount) => (
                      <div key={amount}>
                        <input
                          type="radio"
                          id={`tip-${amount}`}
                          name="tipAmount"
                          value={amount}
                          checked={tipAmount === amount && customTipAmount === ''}
                          onChange={handleTipChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`tip-${amount}`}
                          className={`block text-center py-2 border rounded-lg cursor-pointer transition-colors duration-300 ${tipAmount === amount && customTipAmount === '' ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300 hover:bg-gray-50'}`}
                        >
                          {amount === 0 ? 'No Tip' : `$${amount}`}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="tip-custom"
                      name="tipAmount"
                      value="custom"
                      checked={customTipAmount !== ''}
                      onChange={handleTipChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <label htmlFor="tip-custom" className="ml-3 block text-sm font-medium text-gray-700">
                      Custom Amount
                    </label>
                    
                    {customTipAmount !== '' && (
                      <div className="ml-4 flex-1">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="text"
                            value={customTipAmount}
                            onChange={handleCustomTipChange}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Enter amount"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Promo Code</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoCodeApplied}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter promo code"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={!promoCode || promoCodeApplied}
                      className="px-4 py-2 bg-teal-500 text-white rounded-r-lg hover:bg-teal-600 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {promoCodeApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  
                  {promoCodeApplied && (
                    <div className="mt-2 text-sm text-green-600">
                      Promo code applied! You saved ${promoDiscount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip</span>
                      <span className="font-medium">${tipAmount.toFixed(2)}</span>
                    </div>
                    
                    {promoCodeApplied && (
                      <div className="flex justify-between promo-discount">
                        <span className="text-green-600">Promo Discount</span>
                        <span className="font-medium text-green-600">-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm text-gray-600">Secure payment processing</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-sm text-gray-600">Your information is protected</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Review Order */}
        {step === 3 && (
          <div ref={stepThreeRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Review Your Order</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Delivery Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium">{deliveryAddress.fullName}</p>
                        <p>{deliveryAddress.addressLine1}</p>
                        {deliveryAddress.addressLine2 && <p>{deliveryAddress.addressLine2}</p>}
                        <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}</p>
                        <p className="mt-2">{deliveryAddress.phone}</p>
                        
                        {deliveryAddress.deliveryInstructions && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium">Delivery Instructions:</p>
                            <p className="text-sm">{deliveryAddress.deliveryInstructions}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-md font-medium mb-2">Delivery Time</h4>
                        <p>
                          {deliveryTime === 'asap' 
                            ? 'As soon as possible (30-45 minutes)' 
                            : `Scheduled for: ${new Date(customDeliveryTime).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    
                    {/* Payment Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="h-8 w-8 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h16v2H4V6zm0 4h16v8H4v-8z" />
                          </svg>
                          <div>
                            <p className="font-medium">Credit Card</p>
                            <p className="text-sm">**** **** **** {paymentMethod.cardNumber.slice(-4)}</p>
                          </div>
                        </div>
                        <p>Name: {paymentMethod.nameOnCard}</p>
                        <p>Expires: {paymentMethod.expiryDate}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-md font-medium mb-2">Tip Amount</h4>
                        <p>${tipAmount.toFixed(2)}</p>
                      </div>
                      
                      {promoCodeApplied && (
                        <div className="mt-4">
                          <h4 className="text-md font-medium mb-2">Promo Code</h4>
                          <p className="text-green-600">{promoCode.toUpperCase()} (-${promoDiscount.toFixed(2)})</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Order Items</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    {item.options && (
                                      <div className="text-sm text-gray-500">{item.options}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip</span>
                      <span className="font-medium">${tipAmount.toFixed(2)}</span>
                    </div>
                    
                    {promoCodeApplied && (
                      <div className="flex justify-between promo-discount">
                        <span className="text-green-600">Promo Discount</span>
                        <span className="font-medium text-green-600">-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-4">
                      By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                    
                    <button
                      onClick={placeOrder}
                      disabled={orderLoading}
                      className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300 disabled:bg-teal-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {orderLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'Place Order'}
                    </button>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    disabled={orderLoading}
                    className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Order Success */}
        {orderSuccess && (
          <div ref={successRef} className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We've received your order and will begin processing it right away.
                You will receive a confirmation email shortly.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Order Number</p>
                <p className="text-xl font-bold text-gray-800 mb-4">#ORD-{Math.floor(10000 + Math.random() * 90000)}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                    <p className="text-md font-medium text-gray-800">
                      {deliveryTime === 'asap' 
                        ? new Date(Date.now() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date(customDeliveryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-md font-bold text-gray-800">${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300">
                  Track Order
                </button>
                <button 
                  onClick={() => window.location.href = '/orders'}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  View Order History
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Order Error */}
        {orderError && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Processing Failed</h2>
              <p className="text-gray-600 mb-6">
                We're sorry, but there was an issue processing your order. Please try again or contact customer support.
              </p>
              
              <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-700">{orderError}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300"
                >
                  Try Again
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}