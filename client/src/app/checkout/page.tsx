"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCartStore } from "@/store/useCartStore";
import { 
  CreditCard, CheckCircle, MapPin, IndianRupee, Loader2, 
  ShieldCheck, ArrowLeft, Mail, TicketPercent, Wallet
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Payment State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<{type: 'success'|'error'|'', msg: string}>({type: '', msg: ''});

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    pinCode: "",
  });

  useEffect(() => {
    setIsMounted(true);
    // Protect the route: If cart is empty and they haven't just succeeded, boot them out
    if (items.length === 0 && !isSuccess) {
      router.push("/catalog");
    }
  }, [items, router, isSuccess]);

  if (!isMounted) return null;

  // Calculations
  const subtotal = getTotal();
  const shipping = 50;
  const total = subtotal + shipping - discountAmount;

  // Simulated Coupon Logic
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponStatus({ type: '', msg: '' });

    setTimeout(() => {
      setIsApplyingCoupon(false);
      const code = couponCode.toUpperCase();
      
      if (code === "SKDS20") {
        const discount = Math.floor(subtotal * 0.20);
        setDiscountAmount(discount);
        setCouponStatus({ type: 'success', msg: 'Agency 20% discount applied!' });
      } else if (code === "GMI15") {
        const discount = Math.floor(subtotal * 0.15);
        setDiscountAmount(discount);
        setCouponStatus({ type: 'success', msg: 'VIP 15% discount applied!' });
      } else {
        setDiscountAmount(0);
        setCouponStatus({ type: 'error', msg: 'Invalid or expired coupon code.' });
      }
    }, 800);
  };

  // REAL Backend Order Processing
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please log in to complete your purchase.");
        router.push("/login");
        return;
      }
      
      // Send the real order to our new backend route!
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        { items, totalAmount: total, paymentMethod, shippingAddress: formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsProcessing(false);
      setIsSuccess(true);
      
      // Use the real MongoDB ID for the order number on the UI
      setOrderId(`ORD-${response.data._id.substring(0, 6).toUpperCase()}`);
      clearCart(); // Wipe the Zustand cart clean

      // Redirect to the Dashboard after showing the success screen
      setTimeout(() => {
        router.push("/dashboard");
      }, 4000); 
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("Payment failed. Please check your connection and try again.");
    }
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-emerald-50/50 p-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl shadow-emerald-200/20 text-center max-w-lg w-full border border-emerald-100 animate-in zoom-in duration-500">
          <div className="mx-auto bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium mb-6">
            Thank you, {formData.fullName.split(" ")[0] || "Guest"}. A confirmation has been sent to <span className="text-gray-800 font-semibold">{formData.email}</span>.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Order Number</p>
            <p className="text-xl font-black text-indigo-600 tracking-widest">{orderId}</p>
            <p className="text-xs text-gray-400 mt-2 font-medium">Payment Method: {paymentMethod.toUpperCase()}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-bold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to your Dashboard...
          </div>
        </div>
      </main>
    );
  }

  // --- CHECKOUT FORM ---
  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT: Forms */}
          <div className="flex-1 space-y-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              
              {/* CONTACT INFORMATION */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <Mail className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-colors" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                      <input required type="tel" pattern="[0-9]{10}" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-colors" placeholder="9876543210" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SHIPPING INFORMATION */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-colors" placeholder="John Doe" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Full Address</label>
                    <textarea required rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-colors resize-none" placeholder="123 Market Street, Apt 4B" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">City</label>
                      <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-colors" placeholder="Mumbai" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">PIN Code</label>
                      <input required type="text" pattern="[0-9]{6}" value={formData.pinCode} onChange={(e) => setFormData({...formData, pinCode: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-colors" placeholder="400001" />
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <Wallet className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* UPI Option */}
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" />
                      <span className="font-bold text-gray-900">UPI (GPay, PhonePe, Paytm)</span>
                    </div>
                    {paymentMethod === 'upi' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                  </label>

                  {/* Card Option */}
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" />
                      <span className="font-bold text-gray-900">Credit / Debit Card</span>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                  </label>

                  {/* COD Option */}
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" />
                      <span className="font-bold text-gray-900">Cash on Delivery (COD)</span>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                  </label>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT: Order Summary & Pay */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Item List */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between items-start text-sm">
                    <span className="text-gray-600 pr-4 line-clamp-2 leading-tight">{item.title}</span>
                    <span className="text-gray-900 font-bold whitespace-nowrap">₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Engine */}
              <div className="mb-6 pt-6 border-t border-gray-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                  <TicketPercent className="w-4 h-4 text-indigo-600" />
                  Have a promo code?
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none uppercase font-medium text-sm transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="bg-gray-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50"
                  >
                    {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {couponStatus.msg && (
                  <p className={`text-xs font-bold mt-2 pl-1 ${couponStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {couponStatus.msg}
                  </p>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-4 text-sm font-medium text-gray-500 mb-6 pb-6 border-b border-gray-100 pt-6 border-t border-dashed">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-gray-900 flex items-center"><IndianRupee className="w-3.5 h-3.5" />{subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Standard Shipping</span>
                  <span className="text-gray-900 flex items-center"><IndianRupee className="w-3.5 h-3.5" />{shipping}</span>
                </div>
                
                {/* Dynamic Discount Line */}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span>Discount Applied</span>
                    <span className="flex items-center">- <IndianRupee className="w-3.5 h-3.5 ml-1" />{discountAmount}</span>
                  </div>
                )}
              </div>

              {/* Final Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-base font-bold text-gray-900">Total to Pay</span>
                <span className="text-3xl font-black text-indigo-600 flex items-center tracking-tighter">
                  <IndianRupee className="w-6 h-6 mr-0.5" />{Math.max(0, total)}
                </span>
              </div>

              {/* Submit Form Button */}
              <button 
                form="checkout-form"
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 disabled:opacity-80"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {paymentMethod === 'cod' ? 'Confirm Order' : 'Pay Securely'}
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                256-bit SSL Encrypted Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}