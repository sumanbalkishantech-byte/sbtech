"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, ArrowRight, ShoppingBag, IndianRupee, BookOpen, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  
  // Pull exactly what we need from our global Zustand store
  const { items, removeItem, getTotal } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const subtotal = getTotal();
  const shipping = items.length > 0 ? 50 : 0; // Flat ₹50 shipping fee for example
  const total = subtotal + shipping;

  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Cart</h1>
          <p className="text-gray-500 mt-1 font-medium">Review your items before checkout.</p>
        </div>

        {items.length === 0 ? (
          /* --- EMPTY CART STATE --- */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center min-h-[50vh]">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Looks like you haven't added any books yet. Explore our catalog to find your next great read.
            </p>
            <Link 
              href="/catalog" 
              className="bg-gray-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Start Browsing
            </Link>
          </div>
        ) : (
          /* --- FILLED CART STATE --- */
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column: Cart Items */}
            <div className="flex-1 space-y-6">
              {items.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative group">
                  
                  {/* Item Image */}
                  <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-100">
                    {item.image ? (
                      <img src={`http://localhost:5000${item.image}`} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-8 h-8 text-gray-300" />
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-md text-xs font-bold border ${
                          item.book_type === 'New' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        }`}>
                          {item.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end text-lg font-black text-gray-900">
                          <IndianRupee className="w-4 h-4 mr-0.5" />
                          {item.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeItem(item._id)}
                    className="absolute -top-3 -right-3 bg-white border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 p-2.5 rounded-full shadow-sm transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm font-medium text-gray-500 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span className="text-gray-900 flex items-center"><IndianRupee className="w-3.5 h-3.5" />{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Standard Shipping</span>
                    <span className="text-gray-900 flex items-center"><IndianRupee className="w-3.5 h-3.5" />{shipping}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-indigo-600 flex items-center">
                    <IndianRupee className="w-6 h-6 mr-0.5" />{total}
                  </span>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                  Secure Checkout
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}