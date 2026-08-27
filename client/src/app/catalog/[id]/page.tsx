"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { 
  ArrowLeft, ShoppingCart, Truck, ShieldCheck, 
  IndianRupee, Loader2, BookOpen, Tag, Check
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore"; // IMPORT THE STORE

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
  
  // Get the addItem function from our global store
  const addItem = useCartStore((state) => state.addItem);
  
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdded, setIsAdded] = useState(false); // State for the button animation

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`sbtech-production.up.railway.app/api/books/${id}`);
        setBook(response.data);
      } catch (err: any) {
        setError("Book not found or no longer available.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchBookDetails();
  }, [id]);

  // Handle adding the item to the cart
  const handleAddToCart = () => {
    if (!book) return;
    
    addItem({
      _id: book._id,
      title: book.title,
      price: book.price,
      image: book.images && book.images.length > 0 ? book.images[0] : "",
      book_type: book.book_type,
    });
    
    // Trigger the success animation
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50/50 px-6">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/catalog" className="text-indigo-600 font-medium hover:underline">
          ← Back to Catalog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Navigation */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to browsing
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT: Image Showcase */}
          <div className="w-full md:w-1/2 bg-gray-50/50 p-8 lg:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
            <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${
              book.book_type === 'New' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              {book.book_type === 'New' ? '✨ Brand New' : '📚 Pre-Loved'}
            </div>

            <div className="aspect-[3/4] w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex items-center justify-center">
              {book.images && book.images.length > 0 ? (
                <img 
                  src={`sbtech-production.up.railway.app${book.images[0]}`} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="w-24 h-24 text-gray-200" />
              )}
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-2">
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="text-lg text-gray-500 mt-2 font-medium">by {book.author}</p>
            </div>

            {/* Condition Badge (If Used) */}
            {book.book_type === "Used" && (
              <div className="flex items-center gap-2 mt-4 inline-flex w-fit bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Condition: {book.condition.replace("_", " ")}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-8 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center text-4xl font-black text-gray-900 tracking-tighter">
                <IndianRupee className="w-8 h-8 mr-1" />
                {book.price}
              </div>
              <p className="text-sm text-gray-400 mt-2">Taxes included. Shipping calculated at checkout.</p>
            </div>

            {/* Synopsis */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Synopsis</h3>
              <p className="text-gray-600 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-4">
              
              {/* SMART ADD TO CART BUTTON */}
              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                  isAdded 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30' 
                  : 'bg-gray-900 hover:bg-indigo-600 text-white hover:shadow-indigo-500/30 hover:-translate-y-0.5'
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

              <div className="flex items-center justify-center gap-6 pt-4 text-sm font-medium text-gray-500">
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