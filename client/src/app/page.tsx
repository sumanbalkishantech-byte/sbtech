"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  ArrowRight, BookOpen, ShieldCheck, Truck, 
  Recycle, IndianRupee, ShoppingCart, Tag, Search
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
        const response = await axios.get("https://sbtech-production.up.railway.app/api/books");
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
    <div className="flex flex-col min-h-screen bg-[#F9F8F4]">
      
      {/* ========================================== */}
      {/* SECTION 1: THE HERO (ORGANIC EDITORIAL) */}
      {/* ========================================== */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-[#F9F8F4]">
        
        {/* 1. Organic Washi Paper Grain Texture */}
        <div 
          className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* 2. Ambient Watercolor Blooms */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#E27142]/10 blur-[120px]" />
          <div className="absolute top-[40%] -left-[10%] w-[700px] h-[700px] rounded-full bg-[#183629]/5 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Typography & CTAs */}
            <div className="flex flex-col items-start text-left max-w-xl">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-[#183629] tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
                New Books.<br />
                Used Books.<br />
                <span className="text-[#E27142]">Smart Choice.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#183629]/80 font-medium mb-10 leading-relaxed">
                Buy new books or pre-loved books at the best prices. Explore thousands of verified titles in our premium marketplace.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link 
                  href="/catalog?type=new" 
                  className="w-full sm:w-auto flex items-center justify-center bg-[#183629] hover:bg-[#12291f] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-xl shadow-[#183629]/20 hover:-translate-y-0.5"
                >
                  Shop New Books
                </Link>
                <Link 
                  href="/catalog?type=used" 
                  className="w-full sm:w-auto flex items-center justify-center bg-white/50 backdrop-blur-sm hover:bg-white text-[#183629] border-2 border-[#183629] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  Shop Used Books
                </Link>
              </div>
            </div>

            {/* Right Column: Lifestyle Visual */}
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-[#183629]/10 group">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200" 
                alt="Stack of premium books" 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Sustainability Badge */}
              <div className="absolute top-6 right-6 bg-[#183629] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md bg-opacity-90 border border-white/10">
                <Recycle className="w-6 h-6 text-[#E27142]" />
                <div className="flex flex-col text-sm font-bold leading-tight">
                  <span>Reduce</span>
                  <span>Reuse</span>
                  <span>Read More</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 2: THE TRUST PILLARS */}
      {/* ========================================== */}
      <section className="py-20 bg-white border-y border-gray-100 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-[#F9F8F4] shadow-sm border border-[#183629]/10 rounded-2xl flex items-center justify-center text-[#183629] mb-6 transition-transform hover:scale-110 duration-300">
                <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#183629] mb-3">Verified Inventory</h3>
              <p className="text-[#183629]/70 font-medium leading-relaxed">Every book is manually checked for quality. No torn pages, no fake listings.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-[#F9F8F4] shadow-sm border border-[#183629]/10 rounded-2xl flex items-center justify-center text-[#183629] mb-6 transition-transform hover:scale-110 duration-300">
                <Truck className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#183629] mb-3">Fast & Tracked Delivery</h3>
              <p className="text-[#183629]/70 font-medium leading-relaxed">Premium packaging and lightning-fast logistics to get your books to you safely.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-[#F9F8F4] shadow-sm border border-[#183629]/10 rounded-2xl flex items-center justify-center text-[#183629] mb-6 transition-transform hover:scale-110 duration-300">
                <Recycle className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#183629] mb-3">Sustainable Cycle</h3>
              <p className="text-[#183629]/70 font-medium leading-relaxed">Read, return, and earn. Keep great stories in circulation and save shelf space.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 3 & 4: TEXTURED BOTTOM WRAPPER */}
      {/* ========================================== */}
      <div className="relative bg-[#F9F8F4]">
        
        {/* Seamless grain texture for the entire bottom half */}
        <div 
          className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* SECTION 3: LIVE FEATURED ARRIVALS */}
        <section className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#183629] tracking-tight">New Arrivals</h2>
                <p className="text-[#183629]/70 mt-2 font-medium text-lg">Just added to the marketplace.</p>
              </div>
              <Link href="/catalog" className="hidden sm:flex items-center gap-2 text-[#E27142] font-bold hover:text-[#c45a31] transition-colors group">
                View All Books
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[#183629]/5 shadow-sm animate-pulse">
                    <div className="w-full aspect-[3/4] bg-[#F9F8F4] rounded-lg mb-6"></div>
                    <div className="h-5 bg-[#F9F8F4] rounded-md w-3/4 mb-3"></div>
                    <div className="h-4 bg-[#F9F8F4] rounded-md w-1/2 mb-6"></div>
                    <div className="h-10 bg-[#F9F8F4] rounded-lg w-full"></div>
                  </div>
                ))
              ) : featuredBooks.length === 0 ? (
                <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-xl p-16 text-center border border-[#183629]/5">
                  <BookOpen className="w-12 h-12 text-[#183629]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#183629]">Inventory Syncing</h3>
                  <p className="text-[#183629]/70 mt-2">Check back soon for our newest arrivals.</p>
                </div>
              ) : (
                featuredBooks.map((book) => (
                  <Link href={`/catalog/${book._id}`} key={book._id} className="bg-white rounded-xl shadow-sm border border-[#183629]/5 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer">
                    
                    <div className="aspect-[3/4] bg-[#F9F8F4] relative overflow-hidden flex items-center justify-center border-b border-[#183629]/5 p-6">
                      {book.images && book.images.length > 0 ? (
                        <img 
                          src={`https://sbtech-production.up.railway.app${book.images[0]}`} 
                          alt={book.title}
                          className="object-cover w-full h-full rounded shadow-[5px_5px_15px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-[#183629]/20" />
                      )}
                      
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                        book.book_type === 'New' 
                        ? 'bg-[#183629] text-white border-[#183629]' 
                        : 'bg-[#E27142] text-white border-[#E27142]'
                      }`}>
                        {book.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-[#183629] line-clamp-1 mb-1 group-hover:text-[#E27142] transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-[#183629]/70 mb-4 font-medium line-clamp-1">by {book.author}</p>
                      
                      {book.book_type === "Used" && (
                        <div className="flex items-center gap-1.5 mb-4">
                          <Tag className="w-3 h-3 text-[#183629]/50" />
                          <span className="text-xs font-semibold text-[#183629]/70 bg-[#F9F8F4] px-2 py-0.5 rounded border border-[#183629]/10">
                            {book.condition.replace("_", " ")}
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#183629]/5">
                        <div className="flex items-center text-xl font-bold text-[#183629] tracking-tight">
                          <IndianRupee className="w-4 h-4 mr-0.5" />
                          {book.price}
                        </div>
                        
                        <div className="w-10 h-10 bg-[#F9F8F4] text-[#183629] group-hover:bg-[#183629] group-hover:text-white rounded flex items-center justify-center transition-all duration-300">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <Link href="/catalog" className="mt-10 sm:hidden flex items-center justify-center gap-2 bg-[#183629] text-white py-4 rounded-lg font-bold w-full active:bg-[#12291f]">
              View All Books
            </Link>
          </div>
        </section>

        {/* SECTION 4: THE SELLER CTA */}
        <section className="pb-16 relative z-10">
          <div className="py-20 bg-[#183629] lg:mx-8 mx-4 rounded-3xl relative overflow-hidden shadow-2xl">
            <div 
              className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
            
            <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Turn your shelf into cash.
              </h2>
              <p className="text-lg text-[#F9F8F4]/80 mb-10 font-medium leading-relaxed">
                Finished reading? List your books on KitabPoint in seconds. We handle the visibility, you get paid. 
              </p>
              <Link 
                href="/sell" 
                className="inline-flex items-center justify-center gap-2 bg-[#E27142] hover:bg-[#c45a31] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl shadow-[#E27142]/20 hover:-translate-y-1"
              >
                List a Book
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}