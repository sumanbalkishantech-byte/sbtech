"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { 
  BookOpen, Clock, CheckCircle, Package, Plus, 
  Receipt, ShoppingBag, IndianRupee, Calendar, CreditCard
} from "lucide-react";

// Interfaces for our data
interface Book {
  _id: string;
  title: string;
  author: string;
  status: string;
  price: number | null;
  createdAt: string;
}

interface OrderItem {
  _id: string;
  title: string;
  price: number;
  book_type: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // State
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState<"listings" | "orders">("listings");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      
      if (!token) {
        router.push("/login");
        return;
      }

      if (userString) {
        setUserName(JSON.parse(userString).name.split(" ")[0]);
      }

      try {
        const [booksRes, ordersRes] = await Promise.all([
          axios.get("https://sbtech-production.up.railway.app/api/books/mybooks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://sbtech-production.up.railway.app/api/orders/myorders", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setBooks(booksRes.data);
        setOrders(ordersRes.data);
      } catch (err: any) {
        setError("Failed to load dashboard data. Please try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F9F8F4]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E27142]"></div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-80px)] py-12 px-6 bg-[#F9F8F4] overflow-hidden">
      
      {/* Seamless Washi Paper Texture */}
      <div 
        className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#183629] tracking-tight">Hello, {userName}</h1>
            <p className="text-[#183629]/60 mt-2 font-medium">Manage your activity on the marketplace.</p>
          </div>
          <Link 
            href="/sell" 
            className="inline-flex items-center justify-center gap-2 bg-[#E27142] hover:bg-[#c45a31] text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-xl shadow-[#E27142]/20 hover:-translate-y-1"
          >
            <Plus className="w-4 h-4" />
            List Another Book
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-[#183629]/10 mb-8">
          <button 
            onClick={() => setActiveTab("listings")}
            className={`pb-4 text-sm font-bold transition-colors relative uppercase tracking-wider ${activeTab === "listings" ? "text-[#183629]" : "text-[#183629]/40 hover:text-[#183629]"}`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Listings
            </div>
            {activeTab === "listings" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E27142] rounded-t-full"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-sm font-bold transition-colors relative uppercase tracking-wider ${activeTab === "orders" ? "text-[#183629]" : "text-[#183629]/40 hover:text-[#183629]"}`}
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Order History
            </div>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E27142] rounded-t-full"></span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-bold">
            {error}
          </div>
        )}

        {/* --- TAB CONTENT: MY LISTINGS --- */}
        {activeTab === "listings" && (
          <div className="animate-in fade-in duration-500">
            {books.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-[#183629]/5 p-16 flex flex-col items-center justify-center text-center min-h-[40vh]">
                <div className="bg-[#F9F8F4] p-5 rounded-full mb-6 border border-[#183629]/5">
                  <Package className="w-8 h-8 text-[#183629]/30" />
                </div>
                <h3 className="text-xl font-bold text-[#183629]">No books listed yet</h3>
                <p className="text-[#183629]/60 mt-2 font-medium max-w-sm">Start selling your pre-loved books by submitting them for review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div key={book._id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#183629]/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-[#F9F8F4] border border-[#183629]/5 p-3 rounded-xl text-[#183629]">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      
                      {book.status === "Pending_Review" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#183629]/5 text-[#183629] text-xs font-bold uppercase tracking-wider rounded-full border border-[#183629]/10">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#183629] truncate mb-1">{book.title}</h3>
                    <p className="text-sm font-medium text-[#183629]/60 truncate mb-6">by {book.author}</p>

                    <div className="pt-5 border-t border-[#183629]/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#183629]/40 uppercase tracking-widest">
                        Listed {new Date(book.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-lg font-black text-[#183629]">
                        {book.price ? `₹${book.price}` : "TBD"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: ORDER HISTORY --- */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-500">
            {orders.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-[#183629]/5 p-16 flex flex-col items-center justify-center text-center min-h-[40vh]">
                <div className="bg-[#F9F8F4] p-5 rounded-full mb-6 border border-[#183629]/5">
                  <ShoppingBag className="w-8 h-8 text-[#183629]/30" />
                </div>
                <h3 className="text-xl font-bold text-[#183629]">No past orders</h3>
                <p className="text-[#183629]/60 mt-2 font-medium max-w-sm mb-6">You haven't purchased any books yet. Explore our catalog to find your next great read.</p>
                <Link 
                  href="/catalog" 
                  className="text-[#E27142] font-bold hover:text-[#c45a31] uppercase tracking-wider text-sm transition-colors flex items-center gap-1"
                >
                  Browse Catalog &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-[2rem] shadow-sm border border-[#183629]/5 overflow-hidden transition-all hover:shadow-md">
                    
                    {/* Order Header */}
                    <div className="bg-[#F9F8F4]/80 border-b border-[#183629]/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-[#183629]/40 uppercase tracking-widest">Order ID</span>
                          <span className="text-sm font-black text-[#183629] bg-white px-3 py-1 rounded-lg border border-[#183629]/10 shadow-sm">
                            ORD-{order._id.substring(0, 6).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#183629]/60 uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-[#EAE7DC] text-[#183629] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#183629]/10 w-fit">
                        <CheckCircle className="w-4 h-4" />
                        {order.status}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-8 divide-y divide-[#183629]/5">
                      {order.items.map((item, index) => (
                        <div key={index} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-[#183629] text-lg">{item.title}</h4>
                            <span className="inline-block mt-2 px-2.5 py-1 bg-[#F9F8F4] text-[#183629]/60 text-[10px] uppercase tracking-widest font-bold rounded-md border border-[#183629]/5">
                              {item.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
                            </span>
                          </div>
                          <div className="font-black text-[#183629] text-lg flex items-center shrink-0">
                            <IndianRupee className="w-4 h-4 mr-0.5 opacity-80" />
                            {item.price}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="bg-[#F9F8F4]/50 border-t border-[#183629]/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#183629]/50 uppercase tracking-widest">
                        <CreditCard className="w-4 h-4" />
                        Paid via {order.paymentMethod.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">Order Total</span>
                        <span className="text-2xl font-black text-[#E27142] flex items-center">
                          <IndianRupee className="w-5 h-5 mr-0.5" />
                          {order.totalAmount}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}