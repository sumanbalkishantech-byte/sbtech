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
  const urlType = searchParams.get("type"); // "new" or "used"

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
        const response = await axios.get("http://localhost:5000/api/books");
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

  // 2. Type Filter (New vs Old)
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
    // Default: Newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-gray-500 font-medium animate-pulse">Loading Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* ================= SIDEBAR FILTERS ================= */}
      <aside className="w-full lg:w-72 shrink-0 space-y-8">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm transition-all font-medium text-gray-700"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <SlidersHorizontal className="w-5 h-5 text-gray-900" />
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          </div>

          {/* Book Type Filter */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Book Type</h4>
            <div className="flex flex-col gap-2">
              {["All", "New", "Used"].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="bookType"
                    checked={filterType === type}
                    onChange={() => setFilterType(type)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className={`text-sm font-medium transition-colors ${filterType === type ? "text-indigo-600" : "text-gray-600 group-hover:text-gray-900"}`}>
                    {type === "All" ? "All Books" : type === "New" ? "Brand New (Retail)" : "Pre-Loved (Old Books)"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition Filter (Only show if 'Used' or 'All' is selected) */}
          {filterType !== "New" && (
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Physical Condition</h4>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 text-sm font-medium text-gray-700"
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
          <div className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Max Price</h4>
              <span className="text-sm font-bold text-indigo-600">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 font-medium">
              <span>₹100</span>
              <span>₹5000+</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CATALOG GRID ================= */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 pl-2">
            Showing <span className="font-bold text-gray-900">{processedBooks.length}</span> results
          </p>
          
          <div className="flex items-center gap-3">
            <ArrowDownUp className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 text-sm font-medium text-gray-700 appearance-none cursor-pointer"
            >
              <option value="newest">Sort by: Newest Arrivals</option>
              <option value="price_asc">Sort by: Price (Low to High)</option>
              <option value="price_desc">Sort by: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {processedBooks.length === 0 ? (
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any books matching your current filters. Try adjusting the price range or searching for something else.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setFilterType("All");
                setFilterCondition("All");
                setMaxPrice(5000);
              }}
              className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Book Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {processedBooks.map((book) => (
              <Link href={`/catalog/${book._id}`} key={book._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                
                {/* Image Section */}
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
                  {book.images && book.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5000${book.images[0]}`} 
                      alt={book.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-gray-300" />
                  )}
                  
                  {/* NEW BADGE LOGIC: Explicitly shows "Brand New" or "Pre-Loved" */}
                  <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md border ${
                    book.book_type === 'New' 
                    ? 'bg-emerald-500/90 text-white border-emerald-400/50' 
                    : 'bg-indigo-600/90 text-white border-indigo-500/50'
                  }`}>
                    {book.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">by {book.author}</p>
                  
                  {/* Secondary Condition Badge for Used Books */}
                  {book.book_type === "Used" && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <Tag className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                        Condition: {book.condition.replace("_", " ")}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50">
                    <div className="flex items-center text-xl font-black text-gray-900 tracking-tight">
                      <IndianRupee className="w-5 h-5 mr-0.5" />
                      {book.price}
                    </div>
                    
                    <button className="flex items-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm shadow-sm hover:shadow-indigo-500/30">
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
    <main className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 bg-gray-50/50">
      <div className="container mx-auto max-w-7xl">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
        }>
          <CatalogContent />
        </Suspense>
      </div>
    </main>
  );
}