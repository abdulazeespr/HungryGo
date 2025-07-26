'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCartItems, updateCartItem, removeCartItem, clearCart } from '@/store/slices/cartSlice';
import { gsap } from 'gsap';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, loading, error } = useAppSelector((state) => state.cart);
  
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const emptyCartRef = useRef<HTMLDivElement>(null);
  
  // Fetch cart items on component mount
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);
  
  // Handle quantity change
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ id, quantity }));
  };
  
  // Handle item removal
  const handleRemoveItem = (id: string) => {
    setIsRemoving(id);
    
    // Animate item removal
    const itemElement = document.getElementById(`cart-item-${id}`);
    if (itemElement) {
      gsap.to(itemElement, {
        height: 0,
        opacity: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        onComplete: () => {
          dispatch(removeCartItem(id));
          setIsRemoving(null);
        }
      });
    } else {
      dispatch(removeCartItem(id));
      setIsRemoving(null);
    }
  };
  
  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      // Animate all items
      const cartItems = document.querySelectorAll('.cart-item');
      
      gsap.to(cartItems, {
        height: 0,
        opacity: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        stagger: 0.1,
        duration: 0.3,
        onComplete: () => {
          dispatch(clearCart());
        }
      });
    }
  };
  
  // Proceed to checkout
  const handleCheckout = () => {
    router.push('/checkout');
  };
  
  // Animate cart items on load
  useEffect(() => {
    if (!loading && items.length > 0 && cartRef.current) {
      gsap.fromTo(
        '.cart-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }
      );
      
      gsap.fromTo(
        '.cart-summary',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.2, ease: 'power2.out' }
      );
    }
    
    if (!loading && items.length === 0 && emptyCartRef.current) {
      gsap.fromTo(
        emptyCartRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [loading, items.length]);
  
  // Calculate cart totals
  const deliveryFee = items.length > 0 ? 4.99 : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>
        
        {loading ? (
          // Loading skeleton
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-24 h-10 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="pt-4 mt-4 border-t">
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Cart</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => dispatch(fetchCartItems())}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          // Empty cart
          <div ref={emptyCartRef} className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any meals to your cart yet. Browse our meal plans to find something delicious!
            </p>
            <button 
              onClick={() => router.push('/meal-plans')}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300"
            >
              Browse Meal Plans
            </button>
          </div>
        ) : (
          // Cart with items
          <div ref={cartRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Cart Items ({items.length})</h2>
                  <button 
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-300"
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      id={`cart-item-${item.id}`}
                      className="p-6 flex flex-col sm:flex-row sm:items-center cart-item"
                    >
                      <div className="flex-shrink-0 w-full sm:w-auto mb-4 sm:mb-0">
                        {item.image ? (
                          <div className="relative w-full sm:w-24 h-24 rounded-md overflow-hidden">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 sm:ml-6">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                        )}
                        {item.options && (
                          <p className="text-gray-500 text-sm mt-1">Options: {item.options}</p>
                        )}
                        <p className="text-gray-900 font-medium mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center mt-4 sm:mt-0">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isRemoving === item.id}
                          className="ml-4 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.push('/meal-plans')}
                  className="text-teal-600 hover:text-teal-800 font-medium flex items-center transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4 cart-summary">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
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
                    
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300 flex items-center justify-center"
                    >
                      Proceed to Checkout
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-4">
                      <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h16v2H4V6zm0 4h16v8H4v-8z" />
                      </svg>
                      <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                        <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                      </svg>
                      <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Secure checkout • Fast delivery • 100% satisfaction guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}