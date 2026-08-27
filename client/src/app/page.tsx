"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  ArrowRight, BookOpen, ShieldCheck, Truck, 
  Recycle, IndianRupee, ShoppingCart, Tag, Search, Star
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  book_type: string;
  condition: string;
  price: number;
  images: string[];
  createdAt: string;
}

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the latest 4 books for the homepage
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get("sbtech-production.up.railway.app/api/books");
        const sortedBooks = response.data.sort((a: Book, b: Book) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 4); 
        
        setFeaturedBooks(sortedBooks);
      } catch (err) {
        console.error("Failed to fetch featured books", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* ========================================== */}
      {/* SECTION 1: THE HERO (PERFECTED) */}
      {/* ========================================== */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        
        {/* Professional Dot Pattern Texture with Fade-Out Mask */}
        <div 
          className="absolute inset-0 z-0 opacity-60" 
          style={{ 
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
          }} 
        />
        
        {/* Soft Ambient Spotlight behind the text */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-50/80 rounded-full blur-[100px] pointer-events-none z-0" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
              Your next great read, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">delivered today.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Explore thousands of brand new releases and verified pre-loved books. A premium marketplace built for readers, by readers.
            </p>
            
            {/* Primary Action Area */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <Link 
                href="/catalog" 
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                Browse Catalog
              </Link>
              <Link 
                href="/sell" 
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border border-gray-200 shadow-sm"
              >
                <BookOpen className="w-5 h-5" />
                Sell Your Books
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-14 flex flex-col items-center justify-center gap-3">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                    User
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                Trusted by 10,000+ readers
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 2: THE TRUST PILLARS */}
      {/* ========================================== */}
      <section className="py-20 bg-gray-50 border-y border-gray-100 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Inventory</h3>
              <p className="text-gray-500 font-medium">Every book is manually checked for quality. No torn pages, no fake listings.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Truck className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Tracked Delivery</h3>
              <p className="text-gray-500 font-medium">Premium packaging and lightning-fast logistics to get your books to you safely.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Recycle className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Cycle</h3>
              <p className="text-gray-500 font-medium">Read, return, and earn. Keep great stories in circulation and save shelf space.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 3: LIVE FEATURED ARRIVALS */}
      {/* ========================================== */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">New Arrivals</h2>
              <p className="text-gray-500 mt-2 font-medium text-lg">Just added to the marketplace.</p>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors group">
              View All Books
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse">
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded-2xl mb-6"></div>
                  <div className="h-5 bg-gray-100 rounded-md w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded-md w-1/2 mb-6"></div>
                  <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                </div>
              ))
            ) : featuredBooks.length === 0 ? (
              // Empty State
              <div className="col-span-full bg-gray-50 rounded-3xl p-16 text-center border border-gray-100">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Inventory Syncing</h3>
                <p className="text-gray-500 mt-2">Check back soon for our newest arrivals.</p>
              </div>
            ) : (
              // Live Book Cards
              featuredBooks.map((book) => (
                <Link href={`/catalog/${book._id}`} key={book._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer">
                  
                  {/* Image Block */}
                  <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-100 p-6">
                    {book.images && book.images.length > 0 ? (
                      <img 
                        src={`sbtech-production.up.railway.app${book.images[0]}`} 
                        alt={book.title}
                        className="object-cover w-full h-full rounded-md shadow-md group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <BookOpen className="w-12 h-12 text-gray-300" />
                    )}
                    
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                      book.book_type === 'New' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {book.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
                    </div>
                  </div>

                  {/* Content Block */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 font-medium line-clamp-1">by {book.author}</p>
                    
                    {book.book_type === "Used" && (
                      <div className="flex items-center gap-1.5 mb-4">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {book.condition.replace("_", " ")}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center text-xl font-black text-gray-900 tracking-tight">
                        <IndianRupee className="w-4 h-4 mr-0.5 text-gray-900" />
                        {book.price}
                      </div>
                      
                      <div className="w-10 h-10 bg-gray-50 text-gray-900 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Mobile View All Button */}
          <Link href="/catalog" className="mt-10 sm:hidden flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold w-full active:bg-gray-800">
            View All Books
          </Link>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 4: THE SELLER CTA (DARK MODE CLOSER) */}
      {/* ========================================== */}
      <section className="py-20 bg-gray-900 m-4 rounded-[2.5rem] mb-12 relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Turn your shelf into cash.
          </h2>
          <p className="text-lg text-gray-400 mb-10 font-medium leading-relaxed">
            Finished reading? List your books on MarketEngine in seconds. We handle the visibility, you get paid. 
          </p>
          <Link 
            href="/sell" 
            className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:-translate-y-1"
          >
            List a Book
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}