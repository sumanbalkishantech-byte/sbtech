"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { 
  BookOpen, ShoppingCart, Search, SlidersHorizontal, 
  ArrowDownUp, IndianRupee, Loader2, Tag
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  book_type: string;
  condition: string;
  description: string;
  price: number;
  images: string[];
  createdAt: string;
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type"); 

  // --- STATE MANAGEMENT ---
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>(
    urlType === "new" ? "New" : urlType === "used" ? "Used" : "All"
  );
  const [filterCondition, setFilterCondition] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>("newest");

  // Fetch all approved books on load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://sbtech-production.up.railway.app/api/books");
        setBooks(response.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Update type filter if URL changes
  useEffect(() => {
    if (urlType === "new") setFilterType("New");
    else if (urlType === "used") setFilterType("Used");
    else setFilterType("All");
  }, [urlType]);

  // --- FILTERING & SORTING ENGINE ---
  let processedBooks = [...books];

  // 1. Search Filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    processedBooks = processedBooks.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  // 2. Type Filter
  if (filterType !== "All") {
    processedBooks = processedBooks.filter((b) => b.book_type === filterType);
  }

  // 3. Condition Filter
  if (filterCondition !== "All") {
    processedBooks = processedBooks.filter((b) => b.condition === filterCondition);
  }

  // 4. Price Filter
  processedBooks = processedBooks.filter((b) => b.price <= maxPrice);

  // 5. Sorting
  processedBooks.sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#E27142]" />
          <p className="text-[#183629]/50 font-bold tracking-widest uppercase text-xs animate-pulse">Loading Library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative z-10">
      
      {/* ================= SIDEBAR FILTERS ================= */}
      <aside className="w-full lg:w-72 shrink-0 space-y-8">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#183629]/40" />
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#183629]/10 rounded-2xl focus:ring-2 focus:ring-[#E27142]/20 focus:border-[#E27142] outline-none shadow-sm transition-all font-medium text-[#183629] placeholder-[#183629]/40"
          />
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-[#183629]/5 shadow-sm space-y-8">
          <div className="flex items-center gap-2 border-b border-[#183629]/5 pb-4">
            <SlidersHorizontal className="w-5 h-5 text-[#183629]" />
            <h3 className="text-lg font-bold text-[#183629]">Filters</h3>
          </div>

          {/* Book Type Filter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">Book Type</h4>
            <div className="flex flex-col gap-3">
              {["All", "New", "Used"].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="bookType"
                    checked={filterType === type}
                    onChange={() => setFilterType(type)}
                    className="w-4 h-4 text-[#183629] border-[#183629]/20 focus:ring-[#183629] cursor-pointer"
                  />
                  <span className={`text-sm font-bold transition-colors ${filterType === type ? "text-[#183629]" : "text-[#183629]/60 group-hover:text-[#183629]"}`}>
                    {type === "All" ? "All Books" : type === "New" ? "Brand New (Retail)" : "Pre-Loved (Used)"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          {filterType !== "New" && (
            <div className="space-y-4 pt-6 border-t border-[#183629]/5">
              <h4 className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">Physical Condition</h4>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="w-full p-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl outline-none focus:border-[#E27142] text-sm font-bold text-[#183629] cursor-pointer"
              >
                <option value="All">Any Condition</option>
                <option value="Like_New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          )}

          {/* Price Range Slider */}
          <div className="space-y-4 pt-6 border-t border-[#183629]/5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">Max Price</h4>
              <span className="text-sm font-black text-[#183629]">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#E27142]"
            />
            <div className="flex justify-between text-xs text-[#183629]/40 font-bold">
              <span>₹100</span>
              <span>₹5000+</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CATALOG GRID ================= */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-[#183629]/5 shadow-sm">
          <p className="text-sm font-medium text-[#183629]/60 pl-2">
            Showing <span className="font-bold text-[#183629]">{processedBooks.length}</span> results
          </p>
          
          <div className="flex items-center gap-3">
            <ArrowDownUp className="w-4 h-4 text-[#183629]/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 pl-4 pr-8 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl outline-none focus:border-[#183629] text-sm font-bold text-[#183629] appearance-none cursor-pointer"
            >
              <option value="newest">Sort: Newest Arrivals</option>
              <option value="price_asc">Sort: Price (Low to High)</option>
              <option value="price_desc">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {processedBooks.length === 0 ? (
          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-[#183629]/5 p-16 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="bg-[#F9F8F4] p-6 rounded-full mb-6 border border-[#183629]/5">
              <Search className="w-10 h-10 text-[#183629]/30" />
            </div>
            <h3 className="text-xl font-bold text-[#183629] mb-2">No matches found</h3>
            <p className="text-[#183629]/60 max-w-md font-medium">
              We couldn't find any books matching your current filters. Try adjusting the price range or searching for something else.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setFilterType("All");
                setFilterCondition("All");
                setMaxPrice(5000);
              }}
              className="mt-8 px-6 py-2.5 border-2 border-[#183629] text-[#183629] rounded-xl font-bold hover:bg-[#183629] hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Book Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {processedBooks.map((book) => (
              <Link href={`/catalog/${book._id}`} key={book._id} className="bg-white rounded-3xl shadow-sm border border-[#183629]/5 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                
                {/* Image Section */}
                <div className="aspect-[3/4] bg-[#F9F8F4] relative overflow-hidden flex items-center justify-center border-b border-[#183629]/5 p-6">
                  {book.images && book.images.length > 0 ? (
                    <img 
                      src={`https://sbtech-production.up.railway.app${book.images[0]}`} 
                      alt={book.title}
                      className="object-cover w-full h-full rounded shadow-sm group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-[#183629]/20" />
                  )}
                  
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                    book.book_type === 'New' 
                    ? 'bg-[#183629] text-white border-[#183629]' 
                    : 'bg-[#E27142] text-white border-[#E27142]'
                  }`}>
                    {book.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#183629] line-clamp-1 mb-1 group-hover:text-[#E27142] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#183629]/60 mb-4 font-medium">by {book.author}</p>
                  
                  {book.book_type === "Used" && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <Tag className="w-3.5 h-3.5 text-[#183629]/40" />
                      <span className="text-xs font-bold text-[#183629]/60 bg-[#F9F8F4] px-2.5 py-1 rounded border border-[#183629]/10">
                        {book.condition.replace("_", " ")}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-[#183629]/5">
                    <div className="flex items-center text-xl font-bold text-[#183629] tracking-tight">
                      <IndianRupee className="w-5 h-5 mr-0.5" />
                      {book.price}
                    </div>
                    
                    <button className="flex items-center gap-2 bg-[#EAE7DC] text-[#183629] hover:bg-[#183629] hover:text-white px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm shadow-sm">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 bg-[#F9F8F4] overflow-hidden">
      
      {/* Seamless Washi Paper Texture */}
      <div 
        className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-[#E27142]" />
          </div>
        }>
          <CatalogContent />
        </Suspense>
      </div>
    </main>
  );
}