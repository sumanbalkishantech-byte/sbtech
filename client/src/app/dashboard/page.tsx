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
        // Fetch both listings and orders at the same time
        const [booksRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/books/mybooks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/orders/myorders", {
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
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6 bg-gray-50/50">
      <div className="max-w-5xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello, {userName}</h1>
            <p className="text-gray-500 mt-1">Manage your activity on the marketplace.</p>
          </div>
          <Link 
            href="/sell" 
            className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            List Another Book
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab("listings")}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "listings" ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Listings
            </div>
            {activeTab === "listings" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "orders" ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Order History
            </div>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* --- TAB CONTENT: MY LISTINGS --- */}
        {activeTab === "listings" && (
          <>
            {books.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No books listed yet</h3>
                <p className="text-gray-500 mt-1 max-w-sm">Start selling your pre-loved books by submitting them for admin review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div key={book._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      
                      {book.status === "Pending_Review" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
                    <p className="text-sm text-gray-500 truncate mb-4">by {book.author}</p>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Listed {new Date(book.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {book.price ? `₹${book.price}` : "Pricing TBD"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* --- TAB CONTENT: ORDER HISTORY --- */}
        {activeTab === "orders" && (
          <>
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No past orders</h3>
                <p className="text-gray-500 mt-1 max-w-sm mb-6">You haven't purchased any books yet. Explore our catalog to find your next great read.</p>
                <Link 
                  href="/catalog" 
                  className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                >
                  Browse Catalog →
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Order Header */}
                    <div className="bg-gray-50/80 border-b border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                          <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            ORD-{order._id.substring(0, 6).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 w-fit">
                        <CheckCircle className="w-4 h-4" />
                        {order.status}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 divide-y divide-gray-50">
                      {order.items.map((item, index) => (
                        <div key={index} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-gray-900">{item.title}</h4>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
                              {item.book_type === 'New' ? 'Brand New' : 'Pre-Loved'}
                            </span>
                          </div>
                          <div className="font-bold text-gray-900 flex items-center shrink-0">
                            <IndianRupee className="w-4 h-4" />
                            {item.price}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="bg-gray-50/50 border-t border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <CreditCard className="w-4 h-4" />
                        Paid via {order.paymentMethod.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-500 uppercase">Order Total</span>
                        <span className="text-2xl font-black text-gray-900 flex items-center">
                          <IndianRupee className="w-5 h-5 mr-0.5" />
                          {order.totalAmount}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}