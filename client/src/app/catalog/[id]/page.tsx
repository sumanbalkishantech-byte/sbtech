"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { 
  ArrowLeft, ShoppingCart, Truck, ShieldCheck, 
  IndianRupee, Loader2, BookOpen, Tag, Check
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

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

export default function SingleBookPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const addItem = useCartStore((state) => state.addItem);
  
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://sbtech-production.up.railway.app/api/books/${id}`);
        setBook(response.data);
      } catch (err: any) {
        setError("Book not found or no longer available.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchBookDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    
    addItem({
      _id: book._id,
      title: book.title,
      price: book.price,
      image: book.images && book.images.length > 0 ? book.images[0] : "",
      book_type: book.book_type,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F9F8F4]">
        <Loader2 className="w-10 h-10 animate-spin text-[#E27142]" />
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#F9F8F4] px-6">
        <BookOpen className="w-16 h-16 text-[#183629]/20 mb-4" />
        <h1 className="text-2xl font-bold text-[#183629] mb-2">Book Not Found</h1>
        <p className="text-[#183629]/60 mb-6 font-medium">{error}</p>
        <Link href="/catalog" className="text-[#E27142] font-bold hover:underline">
          ← Back to Catalog
        </Link>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-80px)] py-12 px-6 bg-[#F9F8F4]">
      
      {/* Seamless Washi Paper Texture */}
      <div 
        className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Navigation */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-bold text-[#183629]/50 hover:text-[#E27142] transition-colors mb-8 group uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to browsing
        </button>

        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-[#183629]/5 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT: Image Showcase */}
          <div className="w-full md:w-1/2 bg-[#F9F8F4]/50 p-8 lg:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#183629]/5 relative">
            <div className={`absolute top-6 left-6 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm border ${
              book.book_type === 'New' 
              ? 'bg-[#183629] text-white border-[#183629]' 
              : 'bg-[#E27142] text-white border-[#E27142]'
            }`}>
              {book.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
            </div>

            <div className="aspect-[3/4] w-full max-w-md bg-[#F9F8F4] rounded-2xl shadow-sm border border-[#183629]/5 overflow-hidden flex items-center justify-center p-4">
              {book.images && book.images.length > 0 ? (
                <img 
                  src={`https://sbtech-production.up.railway.app${book.images[0]}`} 
                  alt={book.title}
                  className="w-full h-full object-cover rounded shadow-[4px_4px_12px_rgba(0,0,0,0.05)]"
                />
              ) : (
                <BookOpen className="w-24 h-24 text-[#183629]/10" />
              )}
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-2">
              <h1 className="text-3xl lg:text-4xl font-black text-[#183629] tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="text-lg text-[#183629]/70 mt-2 font-medium">by {book.author}</p>
            </div>

            {/* Condition Badge (If Used) */}
            {book.book_type === "Used" && (
              <div className="flex items-center gap-2 mt-4 inline-flex w-fit bg-[#F9F8F4] px-3 py-1.5 rounded-lg border border-[#183629]/10">
                <Tag className="w-4 h-4 text-[#183629]/50" />
                <span className="text-sm font-bold text-[#183629]/70">
                  Condition: {book.condition.replace("_", " ")}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-8 mb-8 pb-8 border-b border-[#183629]/10">
              <div className="flex items-center text-4xl font-black text-[#183629] tracking-tighter">
                <IndianRupee className="w-8 h-8 mr-1" />
                {book.price}
              </div>
              <p className="text-sm text-[#183629]/50 mt-2 font-medium">Taxes included. Shipping calculated at checkout.</p>
            </div>

            {/* Synopsis */}
            <div className="mb-10">
              <h3 className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest mb-3">Synopsis</h3>
              <p className="text-[#183629]/80 leading-relaxed font-medium">
                {book.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-4">
              
              {/* SMART ADD TO CART BUTTON */}
              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl ${
                  isAdded 
                  ? 'bg-[#183629] text-white shadow-[#183629]/20' 
                  : 'bg-[#E27142] hover:bg-[#c45a31] text-white shadow-[#E27142]/20 hover:-translate-y-1'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 pt-4 text-xs font-bold uppercase tracking-wider text-[#183629]/40">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Fast Delivery
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Quality
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}