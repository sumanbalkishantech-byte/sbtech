"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, ArrowRight, ShoppingBag, IndianRupee, BookOpen, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  
  const { items, removeItem, getTotal } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const subtotal = getTotal();
  const shipping = items.length > 0 ? 50 : 0; 
  const total = subtotal + shipping;

  return (
    <main className="relative min-h-[calc(100vh-80px)] py-12 px-6 bg-[#F9F8F4]">
      
      {/* Seamless Washi Paper Texture (Matching Homepage) */}
      <div 
        className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#183629] tracking-tight drop-shadow-sm">Your Cart</h1>
          <p className="text-[#183629]/70 mt-2 font-medium text-lg">Review your curated selections.</p>
        </div>

        {items.length === 0 ? (
          /* --- EMPTY CART STATE --- */
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#183629]/5 p-16 flex flex-col items-center justify-center text-center min-h-[50vh]">
            <div className="bg-[#F9F8F4] p-6 rounded-full mb-6 border border-[#183629]/5">
              <ShoppingBag className="w-12 h-12 text-[#183629]/30" />
            </div>
            <h2 className="text-2xl font-bold text-[#183629] mb-2">Your cart is empty</h2>
            <p className="text-[#183629]/70 max-w-md mb-8 font-medium">
              Looks like you haven't added any books yet. Explore our catalog to find your next great read.
            </p>
            <Link 
              href="/catalog" 
              className="bg-[#183629] hover:bg-[#12291f] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-[#183629]/10 hover:-translate-y-1"
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
                <div key={item._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#183629]/5 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative group hover:shadow-md transition-all duration-300">
                  
                  {/* Item Image */}
                  <div className="w-24 h-32 bg-[#F9F8F4] rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-[#183629]/5 shadow-sm">
                    {item.image ? (
                      <img src={`https://sbtech-production.up.railway.app${item.image}`} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-8 h-8 text-[#183629]/20" />
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#183629] line-clamp-1 group-hover:text-[#E27142] transition-colors">{item.title}</h3>
                        <span className={`inline-block mt-3 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                          item.book_type === 'New' 
                          ? 'bg-[#183629] text-white border-[#183629]' 
                          : 'bg-[#E27142] text-white border-[#E27142]'
                        }`}>
                          {item.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end text-2xl font-black text-[#183629]">
                          <IndianRupee className="w-5 h-5 mr-0.5 opacity-80" />
                          {item.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeItem(item._id)}
                    className="absolute -top-3 -right-3 bg-white border border-[#183629]/10 text-[#183629]/40 hover:text-red-500 hover:border-red-200 hover:bg-red-50 p-2.5 rounded-full shadow-sm transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#183629]/5 sticky top-28">
                <h2 className="text-2xl font-bold text-[#183629] mb-8">Order Summary</h2>
                
                <div className="space-y-5 text-base font-medium text-[#183629]/70 mb-8 pb-8 border-b border-[#183629]/10">
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span className="text-[#183629] font-bold flex items-center"><IndianRupee className="w-4 h-4" />{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Standard Shipping</span>
                    <span className="text-[#183629] font-bold flex items-center"><IndianRupee className="w-4 h-4" />{shipping}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-10">
                  <span className="text-lg font-bold text-[#183629]">Total</span>
                  <span className="text-4xl font-black text-[#E27142] flex items-center tracking-tight drop-shadow-sm">
                    <IndianRupee className="w-8 h-8 mr-0.5 opacity-90" />{total}
                  </span>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full flex items-center justify-center gap-2 bg-[#183629] hover:bg-[#12291f] text-white py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-[#183629]/20 hover:-translate-y-1"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-[#183629]/50 uppercase tracking-widest">
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