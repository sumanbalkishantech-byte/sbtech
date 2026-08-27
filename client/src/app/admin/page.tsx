"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  ShieldCheck, Check, Clock, IndianRupee, Loader2, 
  LayoutDashboard, PlusCircle, UploadCloud, BookOpen, 
  Receipt, User, MapPin, Calendar 
} from "lucide-react";

interface PendingBook {
  _id: string;
  title: string;
  author: string;
  condition: string;
  description: string;
  createdAt: string;
}

interface PlatformOrder {
  _id: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    email: string;
    city: string;
  };
  items: any[];
}

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "add" | "orders">("pending");
  
  // --- STATE ---
  const [books, setBooks] = useState<PendingBook[]>([]);
  const [allOrders, setAllOrders] = useState<PlatformOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- DIRECT ADD STATE ---
  const [isAddingDirect, setIsAddingDirect] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "", author: "", description: "", condition: "Like_New", price: "", book_type: "New"
  });
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      
      if (!token || !userString || JSON.parse(userString).role !== "super_admin") {
        router.push("/dashboard");
        return;
      }

      try {
        const [booksRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/books/admin/pending", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/orders/admin/all", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setBooks(booksRes.data);
        setAllOrders(ordersRes.data);
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  // --- HANDLERS ---
  const handlePriceChange = (bookId: string, value: string) => {
    setPrices((prev) => ({ ...prev, [bookId]: value }));
  };

  const handleApprove = async (bookId: string) => {
    const price = prices[bookId];
    if (!price || isNaN(Number(price))) {
      alert("Please enter a valid price before approving.");
      return;
    }

    setProcessingId(bookId);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/books/admin/review/${bookId}`,
        { status: "Approved", price: Number(price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
      const newPrices = { ...prices };
      delete newPrices[bookId];
      setPrices(newPrices);
    } catch (err) {
      alert("Failed to approve book. Check server console.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDirectAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.price || isNaN(Number(newBook.price))) {
      alert("Please set a valid price.");
      return;
    }

    setIsAddingDirect(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", newBook.title);
      formData.append("author", newBook.author);
      formData.append("description", newBook.description);
      formData.append("book_type", newBook.book_type);
      
      if (newBook.book_type === "Used") {
        formData.append("condition", newBook.condition);
      }
      
      if (newImage) formData.append("images", newImage);

      const uploadRes = await axios.post("http://localhost:5000/api/books/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });

      const newBookId = uploadRes.data.book._id;

      await axios.put(
        `http://localhost:5000/api/books/admin/review/${newBookId}`,
        { status: "Approved", price: Number(newBook.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Book successfully added to the live storefront!");
      setNewBook({ title: "", author: "", description: "", condition: "Like_New", price: "", book_type: "New" });
      setNewImage(null);
      
    } catch (err) {
      alert("Error adding book directly to inventory.");
    } finally {
      setIsAddingDirect(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAllOrders((prevOrders) => 
        prevOrders.map((order) => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
      </main>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 flex flex-col md:flex-row">
      
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-tr from-rose-600 to-orange-500 text-white p-2.5 rounded-xl shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Workspace</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Super Admin</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "pending" 
              ? "bg-rose-50 text-rose-700 border border-rose-100 shadow-sm" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Pending Queue
            {books.length > 0 && (
              <span className="ml-auto bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {books.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "add" 
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Direct Add Inventory
          </button>

          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "orders" 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Platform Orders
            {allOrders.length > 0 && (
              <span className="ml-auto bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {allOrders.length}
              </span>
            )}
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-6 md:p-12 max-w-6xl">
        
        {/* VIEW 1: PENDING QUEUE */}
        {activeTab === "pending" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Submissions</h1>
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/80 border-b border-gray-100 px-8 py-5 flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-800">Requires Pricing & Approval</h2>
              </div>

              {books.length === 0 ? (
                <div className="p-16 text-center text-gray-500">
                  Your queue is empty. All books have been reviewed!
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {books.map((book) => (
                    <div key={book._id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                            Condition: {book.condition.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Author: {book.author}</p>
                        <p className="text-sm text-gray-500 max-w-2xl line-clamp-2">{book.description}</p>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto shrink-0 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="relative w-32">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[2]" />
                          <input
                            type="number"
                            placeholder="Price"
                            value={prices[book._id] || ""}
                            onChange={(e) => handlePriceChange(book._id, e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-rose-500 outline-none text-sm font-medium"
                          />
                        </div>
                        <button
                          onClick={() => handleApprove(book._id)}
                          disabled={processingId === book._id}
                          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                        >
                          {processingId === book._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Approve</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: DIRECT ADD INVENTORY */}
        {activeTab === "add" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add to Live Inventory</h1>
            <form onSubmit={handleDirectAdd} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Book Title</label>
                  <input type="text" required value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Author</label>
                  <input type="text" required value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea required rows={3} value={newBook.description} onChange={(e) => setNewBook({...newBook, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Inventory Type</label>
                  <select value={newBook.book_type} onChange={(e) => setNewBook({...newBook, book_type: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none font-medium text-indigo-700">
                    <option value="New">Brand New (Retail)</option>
                    <option value="Used">Pre-Loved (Used)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Physical Condition</label>
                  <select value={newBook.condition} onChange={(e) => setNewBook({...newBook, condition: e.target.value})} disabled={newBook.book_type === "New"} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none disabled:opacity-50 disabled:bg-gray-100">
                    <option value="Like_New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Selling Price (₹)</label>
                  <input type="number" required min="1" value={newBook.price} onChange={(e) => setNewBook({...newBook, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none" placeholder="e.g. 450" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Upload Image</label>
                  <div className="relative">
                    <input type="file" required accept="image/*" onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)} className="hidden" id="admin-file" />
                    <label htmlFor="admin-file" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 rounded-xl cursor-pointer transition-colors font-medium text-sm h-[50px]">
                      <UploadCloud className="w-5 h-5" />
                      {newImage ? "Image Selected" : "Choose File"}
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isAddingDirect} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-medium transition-all mt-4">
                {isAddingDirect ? <Loader2 className="w-5 h-5 animate-spin" /> : <><BookOpen className="w-5 h-5" /> Publish to Storefront</>}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3: PLATFORM ORDERS (ADMIN VIEW) */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All Platform Orders</h1>
            
            {allOrders.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <Receipt className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders placed yet</h3>
                <p className="text-gray-500">When customers purchase books, their order details will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-emerald-200 transition-colors">
                    
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                        <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          ORD-{order._id.substring(0, 6).toUpperCase()}
                        </span>
                        
                        {/* INTERACTIVE STATUS DROPDOWN */}
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer transition-colors ${
                            order.status === 'Processing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                        <div className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400"/> {order.shippingAddress.fullName}</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400"/> {order.shippingAddress.city}</div>
                      </div>

                      <div className="text-xs text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} purchased via {order.paymentMethod.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Paid</span>
                      <div className="text-2xl font-black text-gray-900 flex items-center">
                        <IndianRupee className="w-5 h-5 mr-0.5" />
                        {order.totalAmount}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}